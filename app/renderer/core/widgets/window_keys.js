"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowKeys = void 0;
var hooks_1 = require("preact/hooks");
// Listens for keys on the whole window. An ordinary effect runs some time after
// painting, so a listener rebuilt on every render still holds the last render's
// values for a moment, and a key pressed right after changing rows acts on the
// row before; a new one misses what's pressed first. This one attaches as the
// screen commits, and always calls the newest handler, set while rendering.
var useWindowKeys = function (onKey) {
    var latest = (0, hooks_1.useRef)(onKey);
    latest.current = onKey;
    (0, hooks_1.useLayoutEffect)(function () {
        var heard = function (event) { return latest.current(event); };
        window.addEventListener('keydown', heard);
        return function () { return window.removeEventListener('keydown', heard); };
    }, []);
};
exports.useWindowKeys = useWindowKeys;
