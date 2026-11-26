"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardNote = exports.handoffSections = void 0;
var checkpoints_1 = require("./checkpoints");
// A line that is a heading alone: "Next steps:", "## Next steps", "3. Decisions:"
// or "**Left:**". A line with text after its colon is content.
var HEADING = /^\s*(?:#{1,4}\s+|\d+[.)]\s+)?\**([A-Za-z][A-Za-z0-9 '&/-]{0,40}?)\**\s*:?\**\s*$/;
var isHeading = function (line) {
    var m = line.match(HEADING);
    if (m === null)
        return null;
    var hasMark = /:\**\s*$/.test(line) || /^\s*(#|\d+[.)]\s)/.test(line) || /^\s*\*\*/.test(line);
    return hasMark ? m[1].trim() : null;
};
// The note as its sections, in order; null when it has fewer than two
// headings, and the card shows it as plain text.
var handoffSections = function (text) {
    var _a, _b;
    var sections = [];
    var before = [];
    for (var _i = 0, _c = text.split('\n'); _i < _c.length; _i++) {
        var line = _c[_i];
        var heading = isHeading(line);
        if (heading !== null)
            sections.push({ heading: heading, lines: [] });
        else if (line.trim() !== '')
            ((_b = (_a = sections.at(-1)) === null || _a === void 0 ? void 0 : _a.lines) !== null && _b !== void 0 ? _b : before).push(line.trim());
    }
    if (sections.length < 2)
        return null;
    return before.length === 0 ? sections : __spreadArray([{ heading: 'Note', lines: before }], sections, true);
};
exports.handoffSections = handoffSections;
// What the Continue card shows: the note Continue carries on from. A
// checkpoint's points are listed, its goal left plain.
var cardNote = function (task) {
    var note = (0, checkpoints_1.latestNote)(task);
    var c = task.checkpoint;
    if (note === 'checkpoint' && c !== null && c.written !== null) {
        var sections = (0, checkpoints_1.checkpointSections)(c).map(function (s) { return ({
            heading: s.heading,
            lines: s.heading === 'Goal' ? s.lines : s.lines.map(function (line) { return "- ".concat(line); }),
        }); });
        return { title: 'Checkpoint', written: c.written, text: '', sections: sections };
    }
    if (note === 'handoff' && task.handoff !== null) {
        var _a = task.handoff, text = _a.text, written = _a.written;
        return { title: 'Handoff note', written: written, text: text, sections: (0, exports.handoffSections)(text) };
    }
    return null;
};
exports.cardNote = cardNote;
