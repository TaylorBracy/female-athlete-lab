#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/site" || exit 1

HOST="127.0.0.1"
PORT="5173"
ORIGIN="http://${HOST}:${PORT}"

if [[ ! -d node_modules ]]; then
  echo "First run: installing dependencies (npm install)…"
  npm install
fi

# Stop anything already listening on this port so we always serve the current project
# (a leftover background Vite from another folder is the usual reason changes “don’t show”).
if command -v lsof >/dev/null 2>&1; then
  OLD_PIDS="$(lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN -t 2>/dev/null || true)"
  if [[ -n "${OLD_PIDS}" ]]; then
    echo "Stopping previous process on port ${PORT}…"
    kill ${OLD_PIDS} 2>/dev/null || true
    sleep 0.6
    OLD_PIDS="$(lsof -nP -iTCP:"${PORT}" -sTCP:LISTEN -t 2>/dev/null || true)"
    if [[ -n "${OLD_PIDS}" ]]; then
      kill -9 ${OLD_PIDS} 2>/dev/null || true
      sleep 0.3
    fi
  fi
fi

echo "Starting Vite from: $(pwd)"
nohup npm run dev -- --host "${HOST}" --port "${PORT}" >>/tmp/female-athlete-lab-vite.log 2>&1 &
disown 2>/dev/null || true

for _ in $(seq 1 90); do
  if curl -sf --max-time 1 "${ORIGIN}/" >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

open "${ORIGIN}"
echo "Opened ${ORIGIN}"
echo "Log: /tmp/female-athlete-lab-vite.log — if the page looks old, hard-refresh (Cmd+Shift+R)."
