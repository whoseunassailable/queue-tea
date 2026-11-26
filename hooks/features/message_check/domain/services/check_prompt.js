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
exports.shouldCheck = exports.parseCheckAnswer = exports.checkPrompt = void 0;
var first_object_1 = require("../../../../shared/checkpoints/domain/services/first_object");
var KINDS = ['same', 'new', 'quick', 'unsure'];
var INTENTS = ['understanding', 'improving'];
var DIFFICULTIES = ['light', 'medium', 'hard'];
// `features` are the tasks new work can be filed under, `featureId` the one
// Rohan made active, and `lone` the tasks on their own a first piece of work
// can go under; with none of them, the prompt is as it was before features.
var checkPrompt = function (current, queued, text, features, featureId, lone) {
    if (features === void 0) { features = []; }
    if (featureId === void 0) { featureId = null; }
    if (lone === void 0) { lone = []; }
    return __spreadArray(__spreadArray([
        'You sort a message Rohan just typed for a task queue. Answer with one JSON object only, no other text:',
        features.length + lone.length === 0
            ? '{"kind":"same|new|quick|unsure","intent":"understanding|improving","title":"…","difficulty":"light|medium|hard"}'
            : '{"kind":"same|new|quick|unsure","intent":"understanding|improving","title":"…","difficulty":"light|medium|hard","parent":"<feature id>|none|unsure"}',
        '- same: it continues the current task.',
        '- new: it is other work, to do later.',
        "- quick: a side question that isn't work to queue.",
        '- unsure: you cannot tell.',
        '- intent: understanding when it asks how or why or explores; improving when it asks for a change.',
        '- title (at most 60 characters) and difficulty only for new. A bug fix is usually light, a new feature hard.'
    ], (features.length + lone.length === 0
        ? []
        : __spreadArray(__spreadArray([
            '- parent only for new: the id of the feature or task below that the work is part of; none when it is separate work; unsure when you cannot tell. Give one only on clear evidence, such as the message naming it or plainly being a piece of it, never just because it is active or current. A broad task on its own can take the first piece of it.'
        ], (features.length === 0
            ? []
            : ["Features: ".concat(features.map(function (t) { return "".concat(t.id, " \"").concat(t.title, "\"").concat(t.id === featureId ? ' (active)' : ''); }).join(', '), ".")]), true), (lone.length === 0 ? [] : ["Tasks on their own: ".concat(lone.map(function (t) { return "".concat(t.id, " \"").concat(t.title, "\""); }).join(', '), ".")]), true)), true), [
        current === null
            ? 'No task is current, so any message that is work is new.'
            : "The current task: \"".concat(current.title, "\"."),
        queued.length === 0 ? 'Nothing is queued.' : "Queued: ".concat(queued.map(function (t) { return "\"".concat(t.title, "\""); }).join(', '), "."),
        '',
        'The message:',
        text,
    ], false).join('\n');
};
exports.checkPrompt = checkPrompt;
var parseCheckAnswer = function (reply) {
    var _a;
    var object = (0, first_object_1.firstObject)(reply);
    if (object === null)
        return null;
    var parsed;
    try {
        parsed = JSON.parse(object);
    }
    catch (_b) {
        return null;
    }
    var kind = KINDS.find(function (k) { return k === parsed.kind; });
    var intent = INTENTS.find(function (i) { return i === parsed.intent; });
    if (kind === undefined || intent === undefined)
        return null;
    if (kind !== 'new')
        return { kind: kind, intent: intent };
    var title = typeof parsed.title === 'string' ? parsed.title.trim().slice(0, 60) : '';
    if (title === '')
        return null;
    var difficulty = (_a = DIFFICULTIES.find(function (d) { return d === parsed.difficulty; })) !== null && _a !== void 0 ? _a : 'medium';
    var parent = typeof parsed.parent === 'string' ? parsed.parent.trim() : '';
    return parent === '' ? { kind: kind, intent: intent, title: title, difficulty: difficulty } : { kind: kind, intent: intent, title: title, difficulty: difficulty, parent: parent };
};
exports.parseCheckAnswer = parseCheckAnswer;
// Only what Rohan types is checked: not slash commands, hidden prompts, or
// what a plugin or another session sent.
var shouldCheck = function (e) {
    return e.origin.kind === 'composer' &&
        e.command === undefined &&
        e.isMeta === undefined &&
        (e.attachments === undefined || e.attachments.length === 0);
};
exports.shouldCheck = shouldCheck;
