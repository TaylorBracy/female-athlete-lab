#!/usr/bin/env python3
"""Neutralize paper tint and soften hairline row artifacts in the featured insight PDF."""
from __future__ import annotations

import io
import sys
from pathlib import Path

import fitz
import numpy as np
from PIL import Image

TARGET = np.array([250.0, 249.0, 246.0], dtype=np.float32)  # #faf9f6


def _short_run_mask(cand: np.ndarray, max_run: int) -> np.ndarray:
    h = int(cand.shape[0])
    kill = np.zeros(h, dtype=bool)
    i = 0
    while i < h:
        if not cand[i]:
            i += 1
            continue
        j = i
        while j < h and cand[j]:
            j += 1
        if j - i <= max_run:
            kill[i:j] = True
        i = j
    return kill


def mark_separator_rows(img: np.ndarray) -> np.ndarray:
    """Near-uniform bright or dark full-width rows (hairlines + rules)."""
    row_flat = img.reshape(img.shape[0], -1)
    row_m = row_flat.mean(axis=1)
    row_s = row_flat.std(axis=1)
    bright = (row_m > 242.0) & (row_s < 6.0)
    dark = (row_m < 95.0) & (row_s < 22.0)
    return _short_run_mask(bright | dark, max_run=14)


def recolor_slide_backgrounds(img: np.ndarray) -> np.ndarray:
    """Slides use saturated magenta/pink; old logic only caught pale paper."""
    x = img.astype(np.float32)
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn

    # Keep body copy, titles, and red bullets (dark or deep red; low blue vs red).
    protect = (luma < 78.0) | (
        (r > 85.0)
        & (r > g * 1.35)
        & (r > b * 1.25)
        & (luma < 155.0)
    )

    # Hot pink / magenta panels: high R, G suppressed vs R, enough B to separate from pure red ink.
    pink_slide = (
        ~protect
        & (luma > 92.0)
        & (r > 135.0)
        & (g < 155.0)
        & (r > g + 25.0)
        & (b > 65.0)
        & (b > g * 0.55)
    )

    # Extra catch for lighter rose panels.
    rose_slide = (
        ~protect
        & (luma > 118.0)
        & (sat > 35.0)
        & (r > 170.0)
        & (r >= mx)
        & (b > g)
    )

    panel = pink_slide | rose_slide
    out = x.copy()
    t = TARGET.reshape(1, 1, 3)
    blend = 0.94
    out[panel] = blend * out[panel] + (1.0 - blend) * t
    return np.clip(out, 0.0, 255.0).astype(np.uint8)


def scrub_residual_magenta(img: np.ndarray) -> np.ndarray:
    """Second pass: leftover rose/magenta cast (e.g. anti-aliased panel edges)."""
    x = img.astype(np.float32)
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn

    protect = (luma < 78.0) | (
        (r > 85.0)
        & (r > g * 1.35)
        & (r > b * 1.25)
        & (luma < 155.0)
    )

    residue = (
        ~protect
        & (luma > 98.0)
        & (sat > 18.0)
        & (r > 158.0)
        & (r > g + 10.0)
        & (b > g * 0.48)
        & ((r - b) < 110.0)
    )
    out = x.copy()
    t = TARGET.reshape(1, 1, 3)
    blend = 0.88
    out[residue] = blend * out[residue] + (1.0 - blend) * t
    return np.clip(out, 0.0, 255.0).astype(np.uint8)


def recolor_paper(img: np.ndarray) -> np.ndarray:
    x = img.astype(np.float32)
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    luma = 0.299 * r + 0.587 * g + 0.114 * b
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    sat = mx - mn
    paper = (luma >= 228.0) & (sat <= 38.0)
    out = x.copy()
    t = TARGET.reshape(1, 1, 3)
    blend = 0.68
    out[paper] = blend * out[paper] + (1.0 - blend) * t
    return np.clip(out, 0.0, 255.0).astype(np.uint8)


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    pdf_path = root / "public/papers/ankle-sprains-female-athletes-soccer-vs-basketball.pdf"
    if not pdf_path.is_file():
        print("missing", pdf_path, file=sys.stderr)
        return 1

    doc = fitz.open(pdf_path)
    page = doc[0]
    zoom = 2.25
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    h, w = pix.height, pix.width
    img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(h, w, 3).copy()

    kill = mark_separator_rows(img)
    img[kill, :] = np.clip(TARGET, 0, 255).astype(np.uint8)
    img = recolor_slide_backgrounds(img)
    img = scrub_residual_magenta(img)
    img = recolor_paper(img)

    png_buf = io.BytesIO()
    Image.fromarray(img).save(png_buf, format="PNG", optimize=True)
    png_bytes = png_buf.getvalue()

    out = fitz.open()
    out.new_page(width=page.rect.width, height=page.rect.height)
    out[0].insert_image(page.rect, stream=png_bytes)
    out.save(
        pdf_path,
        garbage=4,
        deflate=True,
        clean=True,
    )
    out.close()
    doc.close()
    print("wrote", pdf_path, "px", w, "x", h)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
