"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotesAsks = exports.askNotes = void 0;
var hooks_1 = require("preact/hooks");
// ⇧⌘N and the palette work from every screen. The app opens Notes and asks
// here; the Notes page acts as soon as it is there to hear it. Only the latest
// ask waits.
var waiting = null;
var listeners = new Set();
var askNotes = function (ask) {
    if (listeners.size === 0)
        waiting = ask;
    else
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var heard = listeners_1[_i];
            heard(ask);
        }
};
exports.askNotes = askNotes;
var useNotesAsks = function (onAsk) {
    var latest = (0, hooks_1.useRef)(onAsk);
    latest.current = onAsk;
    (0, hooks_1.useEffect)(function () {
        var heard = function (ask) { return latest.current(ask); };
        listeners.add(heard);
        if (waiting !== null) {
            var ask = waiting;
            waiting = null;
            heard(ask);
        }
        return function () { return void listeners.delete(heard); };
    }, []);
};
exports.useNotesAsks = useNotesAsks;
