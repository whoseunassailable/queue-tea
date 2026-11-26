"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug = debug;
// A failure, for the debug log.
function debug(to, what, err) {
    to.log("".concat(what, ": ").concat(err instanceof Error ? err.message : String(err)));
}
