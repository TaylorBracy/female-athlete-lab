#!/bin/bash
# Double-click in Finder to start the Vite dev server. Keep this file in the repo root,
# or use the copy on your Desktop (that copy uses an absolute path to this project).

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/site"
if [[ ! -d node_modules ]]; then
  npm install
fi
exec npm run dev
