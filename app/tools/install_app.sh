#!/bin/sh
# Copies the built app to /Applications and tells macOS about its link. The app
# may be open: the new copy goes in beside it and takes its name, so the open
# one keeps the files it already has and restarts into the new one when you
# step away from it.
set -eu

app=Queue-tea.app
apps=${QUEUE_TEA_APPLICATIONS:-/Applications}
target="$apps/$app"
# Not ending in .app, so macOS never takes these for a second Queue-tea.
staged="$apps/.$app.new"
old="$apps/.$app.old"
built=$(ls -d dist/mac*/"$app" 2>/dev/null | head -n 1)

if [ -z "$built" ]; then
  echo "No build found. Run npm run package first." >&2
  exit 1
fi

node tools/release_guard.mjs install "$built" "$target"
# Retain the previous application for recovery, including after a successful
# launch. Timestamped names avoid destroying a prior known-good installation.
old="$apps/.$app.previous-$(date +%Y%m%d-%H%M%S)-$$"
if [ -e "$staged" ]; then
  echo "A staged installation is retained at $staged. Inspect it before retrying." >&2
  exit 1
fi
cp -R "$built" "$staged"
# Check the copied bundle and re-read installed ancestry immediately before the
# swap, so a failed copy or an intervening installer leaves production intact.
node tools/release_guard.mjs install "$staged" "$target"
# Renamed, never written over: macOS kills an open app whose files change under it.
[ ! -e "$target" ] || mv "$target" "$old"
if ! mv "$staged" "$target"; then
  [ ! -e "$old" ] || mv "$old" "$target"
  exit 1
fi
echo "Previous app retained at $old"
PATH="$PATH:/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support" lsregister -f "$target"
echo "Installed at $target"
