#!/bin/sh
# Builds clean integrated source into /Applications. Task commits stay previews.
# tools/hooks/post-commit starts it in the background.
# A commit while it runs asks it to go round again.
set -u
cd "$(dirname "$0")/.." || exit 1

# A task commit must never replace the daily app, even if another updater is
# waiting. Do this before the shared lock and before any package/network work.
node tools/release_guard.mjs refresh || exit 0

logs=$HOME/Library/Logs/Queue-tea
lock=$logs/refresh.lock
mkdir -p "$logs"

if ! mkdir "$lock" 2>/dev/null; then
  if kill -0 "$(cat "$lock/pid" 2>/dev/null)" 2>/dev/null; then
    : >"$lock/again"
    exit 0
  fi
  # Left by a run that was killed.
  rm -rf "$lock"
  mkdir "$lock" || exit 1
fi
echo $$ >"$lock/pid"
trap 'rm -rf "$lock"' EXIT
exec >"$logs/refresh.log" 2>&1

say() {
  echo "$1"
  osascript -e "display notification \"$1\" with title \"Queue-tea\""
}

refresh() {
  [ -d node_modules/electron/dist/Electron.app ] || { npm ci && npx --no install-electron; } || return 1
  npm run package || return 1
  [ ! -e "$lock/again" ] || return 0

  version=$(node -p "require('./package.json').version")
  # An open app moves over by itself; see install_app.sh.
  sh tools/install_app.sh || return 1
  rm -rf dist
  say "Version $version is installed."
}

while :; do
  rm -f "$lock/again"
  refresh || say "The app could not update. See ~/Library/Logs/Queue-tea/refresh.log"
  [ -e "$lock/again" ] || break
done
