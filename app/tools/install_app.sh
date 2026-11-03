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

rm -rf "$staged" "$old"
cp -R "$built" "$staged"
# Renamed, never written over: macOS kills an open app whose files change under it.
[ ! -e "$target" ] || mv "$target" "$old"
mv "$staged" "$target"
rm -rf "$old"
PATH="$PATH:/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support" lsregister -f "$target"
echo "Installed at $target"
