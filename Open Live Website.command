#!/usr/bin/env bash
cd "$(dirname "$0")/site" || exit 1

HOST="127.0.0.1"
PORT="5173"
ORIGIN="http://${HOST}:${PORT}"

if [[ ! -d node_modules ]]; then
  echo "First run: installing dependencies (npm install)…"
  npm install
fi

if ! curl -sf --max-time 1 "${ORIGIN}/" >/dev/null 2>&1; then
  echo "Starting Vite — edit files in site/src (e.g. App.tsx); saves refresh the browser."
  nohup npm run dev -- --host "${HOST}" --port "${PORT}" >>/tmp/female-athlete-lab-vite.log 2>&1 &
  disown 2>/dev/null || true
  for _ in $(seq 1 90); do
    if curl -sf --max-time 1 "${ORIGIN}/" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
fi

open "${ORIGIN}"
echo "Opened ${ORIGIN} — keep this window open or close it; the dev server keeps running in the background."
echo "To stop the server later: Activity Monitor → search \"node\" → quit the one using port ${PORT}, or run: lsof -ti :${PORT} | xargs kill"
exit 0
