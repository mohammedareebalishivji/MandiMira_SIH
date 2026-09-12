#!/usr/bin/env bash
# Start MandiMitra locally: check prerequisites, install deps, run the dev server.
set -euo pipefail

cd "$(dirname "$0")"

PORT="${PORT:-3000}"

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is not installed or not on PATH" >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "==> Installing dependencies..."
  npm install
fi

if [ ! -f .env.local ]; then
  echo "==> No .env.local found; creating one from .env.example"
  cp .env.example .env.local
fi

if grep -q 'GEMINI_API_KEY="MY_GEMINI_API_KEY"' .env.local 2>/dev/null; then
  echo "warning: GEMINI_API_KEY is still the placeholder in .env.local."
  echo "         The UI will load, but Gemini API calls will fail until you set a real key."
fi

echo "==> Starting dev server on http://localhost:${PORT}/"
exec npx vite --port="${PORT}" --host=0.0.0.0
