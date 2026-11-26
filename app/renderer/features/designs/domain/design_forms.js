"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.colourError = exports.numberError = exports.questOfNext = exports.relabel = exports.nextFormOf = exports.validateNext = exports.titleError = exports.labelError = exports.commentError = void 0;
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var designs_1 = require("../../../../shared/designs");
var en_1 = require("../../../l10n/en");
var commentError = function (text) {
    var trimmed = text.trim();
    if (trimmed === '')
        return en_1.t.designs.commentRequired;
    return trimmed.length > designs_1.LIMITS.comment ? en_1.t.designs.commentLong : undefined;
};
exports.commentError = commentError;
var labelError = function (label, taken) {
    var trimmed = label.trim();
    if (trimmed === '')
        return en_1.t.designs.labelRequired;
    if (trimmed.length > designs_1.LIMITS.label)
        return en_1.t.designs.labelLong;
    if ((0, designs_1.folderOf)(trimmed) === '')
        return en_1.t.designs.labelNoLetters;
    return taken.includes((0, designs_1.folderOf)(trimmed)) ? en_1.t.designs.labelTaken(trimmed) : undefined;
};
exports.labelError = labelError;
var titleError = function (title) {
    var trimmed = title.trim();
    if (trimmed === '')
        return en_1.t.designs.questTitleRequired;
    return trimmed.length > designs_1.LIMITS.title ? en_1.t.designs.questTitleLong : undefined;
};
exports.titleError = titleError;
var validateNext = function (form, taken) {
    var label = (0, exports.labelError)(form.label, taken);
    var title = (0, exports.titleError)(form.title);
    return __assign(__assign({}, (label === undefined ? {} : { label: label })), (title === undefined ? {} : { title: title }));
};
exports.validateNext = validateNext;
var lineOf = function (c, names) {
    var _a, _b;
    var design = names[c.design];
    var where = (_a = design === null || design === void 0 ? void 0 : design.name) !== null && _a !== void 0 ? _a : c.design;
    var on = c.on === null ? null : ((_b = design === null || design === void 0 ? void 0 : design.layers[c.on]) !== null && _b !== void 0 ? _b : c.on);
    return "".concat(on === null ? where : "".concat(where, " \u00B7 ").concat(on), ": ").concat(c.text.replace(/\s+/g, ' '));
};
// What the quest says for a label, built from the version it starts from.
var draftOf = function (realm, from, comments, names, label) {
    var folder = "".concat(designs_1.DESIGNS_FOLDER, "/").concat((0, designs_1.folderOf)(label), "/");
    if (from === null)
        return { title: en_1.t.designs.firstTitle(realm), description: en_1.t.designs.firstDescription(realm, folder), criteria: en_1.t.designs.firstVersionLine("".concat(folder, "version.json")) };
    return {
        title: en_1.t.designs.nextTitle(label, from.label),
        description: en_1.t.designs.nextDescription(label, realm, folder, from.label, "".concat(designs_1.DESIGNS_FOLDER, "/").concat(from.folder, "/")),
        criteria: __spreadArray(__spreadArray([], comments.filter(designs_1.isOpen).map(function (c) { return lineOf(c, names); }), true), [en_1.t.designs.nextVersionLine("".concat(folder, "version.json"), from.label)], false).join('\n'),
    };
};
// A realm's first version is suggested as the one after 0, so "1".
var nextFormOf = function (realm, from, comments, names, taken) {
    var _a;
    var label = (0, designs_1.suggestLabel)((_a = from === null || from === void 0 ? void 0 : from.label) !== null && _a !== void 0 ? _a : '0', taken);
    return __assign(__assign({ from: from, label: label }, draftOf(realm, from, comments, names, label)), { priority: 'mid', edited: {} });
};
exports.nextFormOf = nextFormOf;
var relabel = function (form, label, realm, comments, names) {
    var draft = draftOf(realm, form.from, comments, names, label);
    return __assign(__assign({}, form), { label: label, title: form.edited.title ? form.title : draft.title, description: form.edited.description ? form.description : draft.description, criteria: form.edited.criteria ? form.criteria : draft.criteria });
};
exports.relabel = relabel;
var questOfNext = function (form) { return ({
    title: form.title.trim(),
    priority: form.priority,
    difficulty: 'medium',
    parent: { kind: 'none' },
    description: form.description.trim() === '' ? null : form.description.trim(),
    criteria: form.criteria
        .split('\n')
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line !== ''; }),
    // Mocha Mockup drafts the version; agents/mocha-mockup.md has the format.
    helpers: (0, helpers_1.onlyHelpers)(__spreadArray(__spreadArray([], (0, helpers_1.defaultHelpers)().on, true), ['mocha-mockup'], false)),
}); };
exports.questOfNext = questOfNext;
// An inspector field: a whole number from low to high, or a colour.
var numberError = function (text, low, high, name) {
    var value = Number(text.trim());
    return text.trim() === '' || !Number.isFinite(value) || value < low || value > high ? en_1.t.designs.numberRange(name, low, high) : undefined;
};
exports.numberError = numberError;
var colourError = function (text) { return ((0, designs_1.isHex)(text.trim()) ? undefined : en_1.t.designs.colourBad); };
exports.colourError = colourError;
