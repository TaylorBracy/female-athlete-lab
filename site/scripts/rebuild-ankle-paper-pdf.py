#!/usr/bin/env python3
"""
Editorial PDF for the ankle sprains paper — single scroll page, brand typography.
Assets: site/scripts/paper_assets/fig01.jpeg, fig02.png (from original Google Doc export).
Run: python3 site/scripts/rebuild-ankle-paper-pdf.py
"""
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    HRFlowable,
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# Female Athlete Lab — restrained palette
STONE_700 = colors.HexColor("#44403c")
STONE_500 = colors.HexColor("#78716c")
PINK_900 = colors.HexColor("#831843")
RULE = colors.HexColor("#fbcfe8")

# One continuous page: height must exceed all content (points).
PAGE_WIDTH = LETTER[0]
PAGE_HEIGHT = 12000

SCRIPT_DIR = Path(__file__).resolve().parent
ASSETS = SCRIPT_DIR / "paper_assets"
CONTENT_WIDTH = PAGE_WIDTH - 2 * 0.92 * inch


def _p(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _scaled_image(path: Path, max_width_pt: float) -> Table:
    im = PILImage.open(path)
    iw, ih = im.size
    w = max_width_pt
    h = ih * (w / iw)
    img = Image(str(path), width=w, height=h)
    tbl = Table([[img]], colWidths=[CONTENT_WIDTH], hAlign="CENTER")
    tbl.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return tbl


def footer(canvas: canvas.Canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(STONE_500)
    canvas.drawCentredString(PAGE_WIDTH / 2, 0.55 * inch, "1")
    canvas.restoreState()


def build_flowables():
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "T",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=26,
        textColor=colors.HexColor("#1c1917"),
        spaceAfter=8,
        alignment=TA_CENTER,
    )
    subtitle = ParagraphStyle(
        "S",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=STONE_500,
        spaceAfter=28,
        alignment=TA_CENTER,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11.5,
        leading=16,
        textColor=PINK_900,
        spaceBefore=22,
        spaceAfter=10,
        fontTracking=0.5,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=10.5,
        leading=15,
        textColor=STONE_700,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
    )
    lead = ParagraphStyle(
        "Lead",
        parent=body,
        fontSize=11,
        leading=16,
        spaceAfter=14,
    )
    pull = ParagraphStyle(
        "Pull",
        parent=body,
        fontName="Times-Italic",
        textColor=STONE_500,
        leftIndent=12,
        borderPadding=10,
        spaceBefore=6,
        spaceAfter=14,
    )
    story: list = []

    story.append(Paragraph(_p("Ankle Sprains in Female Athletes: Soccer vs. Basketball"), title))
    story.append(Paragraph(_p("Taylor Bracy, DPT"), subtitle))

    story.append(
        Paragraph(
            _p(
                "Ankle sprains are among the most common injuries in female athletes—particularly in high school "
                "and collegiate populations—but they are not interchangeable events. Sport context shapes mechanism, "
                "severity, and return-to-play trajectory. Treating every lateral ankle injury as the same diagnosis "
                "obscures the demand profile that actually caused it."
            ),
            lead,
        )
    )

    story.append(Paragraph(_p("Why context matters"), h2))
    story.append(
        Paragraph(
            _p(
                "Mechanism, severity, and recovery timeline vary by sport. Basketball and soccer both load the ankle "
                "in high-velocity, chaotic environments, but the dominant stressors differ: landing and contact density "
                "in one; cutting, deceleration, and non-contact inversion in the other. That distinction belongs in "
                "both assessment and progression."
            ),
            body,
        )
    )

    # Figure 1 — original export: right column on page 1 alongside early sections.
    fig1 = ASSETS / "fig01.jpeg"
    if fig1.exists():
        story.append(Spacer(1, 8))
        story.append(_scaled_image(fig1, 5.75 * inch))

    story.append(Paragraph(_p("What the epidemiology suggests"), h2))
    story.append(
        Paragraph(
            _p(
                "Among high school female athletes, girls’ basketball reports the highest overall ankle sprain rate; "
                "girls’ soccer follows closely. More than half of these injuries occur during competition rather than "
                "practice. The majority arise from player contact or non-contact movement failure. Two patterns "
                "deserve emphasis: roughly fifteen percent of ankle sprains are recurrent, and non-contact injuries "
                "have trended upward—evidence that luck is an incomplete explanation and that load, mechanics, and "
                "readiness warrant scrutiny."
            ),
            body,
        )
    )

    # Figure 2 — original export: after the movement / load discussion on page 2, before sport comparison.
    fig2 = ASSETS / "fig02.png"
    if fig2.exists():
        story.append(Spacer(1, 8))
        story.append(_scaled_image(fig2, 6.25 * inch))

    story.append(Paragraph(_p("Basketball and soccer: different stress profiles"), h2))
    story.append(
        Paragraph(
            _p(
                "Basketball carries a higher overall injury rate with frequent exposure to jumping, landing, and "
                "contact—often concentrated near the rim. A prototypical scenario is landing on another player’s "
                "foot. Soccer shows a somewhat lower overall rate but contributes a greater share of time-loss "
                "injuries beyond twenty-one days and a higher proportion of non-contact mechanisms—cutting, "
                "deceleration, and uncontrolled inversion are recurring themes."
            ),
            body,
        )
    )
    story.append(
        Paragraph(
            _p(
                "In practical terms, basketball often presents as a frequency problem under compressive and contact "
                "load; soccer frequently presents as a severity and movement-control problem under speed and "
                "direction change."
            ),
            pull,
        )
    )

    story.append(Paragraph(_p("Game versus practice"), h2))
    story.append(
        Paragraph(
            _p(
                "Injury rates are consistently higher in games than in practice—often two to threefold—because "
                "competition amplifies speed, unpredictability, contact, fatigue, and decision load. Practice rarely "
                "replicates that composite stress. Preparation and return-to-play testing should acknowledge the gap."
            ),
            body,
        )
    )

    story.append(Paragraph(_p("Implications for rehabilitation and performance"), h2))
    story.append(
        Paragraph(
            _p(
                "Generic, low-level programs routinely miss sport specificity. Basketball athletes need landing "
                "control under load, frontal-plane stability, and tolerance for contact—not only bands, balance "
                "tasks, and light movement. Soccer athletes need deceleration quality, cutting at speed, and "
                "ankle stiffness with reactive strength—not a linear jog-to-run clearance in isolation."
            ),
            body,
        )
    )
    story.append(
        Paragraph(
            _p(
                "For both populations, recurrent sprain risk and non-contact drivers require intentional programming: "
                "strength, neuromuscular control, progressive loading, and rehearsal of actual sport demands."
            ),
            body,
        )
    )

    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=0.5, color=RULE, spaceBefore=8, spaceAfter=16))

    story.append(Paragraph(_p("Synthesis"), h2))
    story.append(
        Paragraph(
            _p(
                "Ankle sprains follow predictable patterns. Basketball athletes are injured more often overall; soccer "
                "athletes may lose more time per event. Most injuries occur in games, and non-contact burden is "
                "rising. Reducing sprains is not merely an ankle conversation—it requires training the athlete, the "
                "movement solutions they rely on, and the demands of the sport they return to."
            ),
            body,
        )
    )

    return story


def main() -> None:
    # Writes to repo-root private/ — not deployed, not in git (see private/README.md).
    repo_root = Path(__file__).resolve().parent.parent.parent
    out = (
        repo_root
        / "private"
        / "papers"
        / "ankle-sprains-female-athletes-soccer-vs-basketball.pdf"
    )
    out.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(out),
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=0.92 * inch,
        rightMargin=0.92 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.85 * inch,
        title="Ankle Sprains in Female Athletes: Soccer vs. Basketball",
        author="Taylor Bracy, DPT",
    )
    doc.build(build_flowables(), onFirstPage=footer, onLaterPages=footer)
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
