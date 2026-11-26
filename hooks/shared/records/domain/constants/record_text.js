"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECORD_TEXT = void 0;
// What the menu says about a record that can't be read. A reason is shown with
// a capital and a full stop; a fix takes the place of the usual line under it.
exports.RECORD_TEXT = {
    failed: "Couldn't read your task record",
    leftAsItIs: function (canRestore) {
        return "It is left as it is. ".concat(canRestore ? 'Use the last good copy, try again,' : 'Try again,', " or look at the file in ~/.queue-tea/projects.");
    },
    restore: 'Use the last good copy',
    retry: 'Try again',
    cannotOpen: 'Claude Code could not open the file',
    cannotOpenFix: function (file) {
        return "Check that ".concat(file, " is there and that you can read it, then try again. The debug log has the details.");
    },
};
