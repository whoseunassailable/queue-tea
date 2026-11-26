"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrandTurn = exports.errandNote = exports.ERRAND_NOT_SENT = exports.startsAsCommand = exports.errandReply = exports.errandUsage = exports.ERRANDS = void 0;
exports.ERRANDS = { brew: 'brew', instant: 'brew', tea: 'tea' };
var errandUsage = function (command, kind) {
    return "Write what you want after the command: /".concat(command, " <").concat(kind === 'tea' ? 'question' : 'request', ">");
};
exports.errandUsage = errandUsage;
var errandReply = function (kind) {
    return kind === 'brew' ? 'Brewing now, outside the queue.' : 'Pouring an answer, outside the queue.';
};
exports.errandReply = errandReply;
// Claude Code takes no prompt from a plugin that starts with /, as it would
// run as a command: such words are not sent, and Rohan is told why.
var startsAsCommand = function (text) { return text.startsWith('/'); };
exports.startsAsCommand = startsAsCommand;
exports.ERRAND_NOT_SENT = 'Not sent: words that start with / run as a command. Put a word before the / and send it again.';
// The note the model reads just before the errand's words, never shown to
// Rohan: the command's context, recorded after its output.
var errandNote = function (kind, current) {
    var kept = current === null
        ? 'nothing in the queue changes'
        : "the current task \"".concat(current.title, "\", its branch and the queue stay as they are");
    var outside = "It is outside the Queue-tea queue: no task is made and ".concat(kept, ", so don't call task_looks_done for it.");
    return kind === 'brew'
        ? "Rohan ran /brew; the request is the next message. Do it now, in this conversation. ".concat(outside, " Do the work rather than say how, and check it worked before you answer (for a server: that it is listening, and its URL).")
        : "Rohan ran /tea; the question is the next message. Answer or explain it. ".concat(outside, " Read what you need, but change no files.");
};
exports.errandNote = errandNote;
// The main loop's turn that carries the errand's words.
var isErrandTurn = function (e, errand) {
    return errand !== null && !errand.isRunning && e.agentId === undefined && e.text === errand.text;
};
exports.isErrandTurn = isErrandTurn;
