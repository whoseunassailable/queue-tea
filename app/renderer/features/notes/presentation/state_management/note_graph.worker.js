"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var note_graph_layout_1 = require("../../domain/note_graph_layout");
// The layout's own thread. It can't reach the engine's log, so a failure goes
// back with its stack and the window logs it.
var post = function (message) { return self.postMessage(message); };
self.onmessage = function (event) {
    var _a;
    try {
        post({ kind: 'done', points: (0, note_graph_layout_1.layoutOf)(event.data, function (share) { return post({ kind: 'progress', share: share }); }) });
    }
    catch (error) {
        post({ kind: 'failed', detail: error instanceof Error ? ((_a = error.stack) !== null && _a !== void 0 ? _a : error.message) : String(error) });
    }
};
