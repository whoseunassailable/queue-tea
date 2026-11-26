"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_SCRIPT = exports.COMMAND_MARK = void 0;
// How a file is known to be ours, so nobody else's queue-tea is ever replaced.
exports.COMMAND_MARK = '# queue-tea: installed by the Queue-tea app.';
// The `queue-tea` command. It only builds the link the tea cup uses, so there is
// one way into the app. Mac only, like everything that runs osascript.
exports.COMMAND_SCRIPT = "#!/bin/sh\n".concat(exports.COMMAND_MARK, "\nusage() {\n  echo 'usage: queue-tea open [path]' >&2\n  exit 2\n}\n\n[ \"$1\" = open ] || usage\n[ \"$#\" -le 2 ] || usage\n\nfolder=${2:-.}\nif ! full=$(cd -- \"$folder\" 2>/dev/null && pwd -P); then\n  echo \"queue-tea: no such folder: $folder\" >&2\n  exit 1\nfi\n\n# A path can hold anything, so it travels encoded.\nencoded=$(osascript -l JavaScript -e 'function run(argv) { return encodeURIComponent(argv[0]) }' \"$full\")\n\nif ! open \"queue-tea://open?path=$encoded\" 2>/dev/null; then\n  echo 'queue-tea: could not open the app. Is Queue-tea in /Applications?' >&2\n  exit 1\nfi\n");
