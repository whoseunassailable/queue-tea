#!/bin/sh
# Copies the built app to /Applications and tells macOS about its link.
set -eu

app=Queue-tea.app
target="/Applications/$app"
built=$(ls -d dist/mac*/"$app" 2>/dev/null | head -n 1)

if [ -z "$built" ]; then
  echo "No build found. Run npm run package first." >&2
  exit 1
fi
if pgrep -x Queue-tea >/dev/null; then
  echo "Queue-tea is running. Quit it, then run this again." >&2
  exit 1
fi

rm -rf "$target"
cp -R "$built" "$target"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$target"
echo "Installed at $target"
