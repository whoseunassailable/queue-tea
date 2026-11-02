// How a file is known to be ours, so nobody else's queue-tea is ever replaced.
export const COMMAND_MARK = '# queue-tea: installed by the Queue-tea app.'

// The `queue-tea` command. It only builds the link the tea cup uses, so there is
// one way into the app. Mac only, like everything that runs osascript.
export const COMMAND_SCRIPT = `#!/bin/sh
${COMMAND_MARK}
usage() {
  echo 'usage: queue-tea open [path]' >&2
  exit 2
}

[ "$1" = open ] || usage
[ "$#" -le 2 ] || usage

folder=\${2:-.}
if ! full=$(cd -- "$folder" 2>/dev/null && pwd -P); then
  echo "queue-tea: no such folder: $folder" >&2
  exit 1
fi

# A path can hold anything, so it travels encoded.
encoded=$(osascript -l JavaScript -e 'function run(argv) { return encodeURIComponent(argv[0]) }' "$full")

if ! open "queue-tea://open?path=$encoded" 2>/dev/null; then
  echo 'queue-tea: could not open the app. Is Queue-tea in /Applications?' >&2
  exit 1
fi
`
