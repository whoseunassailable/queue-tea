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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPathError = exports.sealOf = exports.sealError = exports.questOf = exports.validateQuest = exports.titleError = exports.emptyQuestForm = void 0;
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var task_rules_1 = require("../../../../../hooks/features/tasks/domain/services/task_rules");
var en_1 = require("../../../l10n/en");
var TITLE_LIMIT = 200;
var emptyQuestForm = function (part) { return ({ title: '', priority: 'mid', difficulty: 'medium', part: part, sagaTitle: '', description: '', criteria: '', helpers: (0, helpers_1.defaultHelpers)().on }); };
exports.emptyQuestForm = emptyQuestForm;
var titleError = function (title) {
    var trimmed = title.trim();
    if (trimmed === '')
        return en_1.t.form.titleRequired;
    return trimmed.length > TITLE_LIMIT ? en_1.t.form.titleLong : undefined;
};
exports.titleError = titleError;
var validateQuest = function (form) { return (__assign(__assign(__assign({}, ((0, exports.titleError)(form.title) === undefined ? {} : { title: (0, exports.titleError)(form.title) })), (form.part === 'unset' ? { part: en_1.t.form.pickPart } : {})), (form.part === 'new' && form.sagaTitle.trim() === '' ? { sagaTitle: en_1.t.form.sagaRequired } : {}))); };
exports.validateQuest = validateQuest;
var parentOf = function (form) {
    if (form.part === 'new')
        return { kind: 'new', title: form.sagaTitle.trim() };
    return form.part === 'none' || form.part === 'unset' ? { kind: 'none' } : { kind: 'task', id: form.part };
};
var questOf = function (form) { return ({
    title: form.title.trim(),
    priority: form.priority,
    difficulty: form.difficulty,
    parent: parentOf(form),
    description: form.description.trim() === '' ? null : form.description.trim(),
    criteria: form.criteria
        .split('\n')
        .map(function (line) { return line.trim(); })
        .filter(function (line) { return line !== ''; }),
    helpers: form.helpers,
}); };
exports.questOf = questOf;
var sealError = function (form) { return (form.waitFor === null && form.reason.trim() === '' ? en_1.t.form.sealRequired : undefined); };
exports.sealError = sealError;
var sealOf = function (form) { return (form.waitFor !== null ? { waitFor: form.waitFor } : { reason: form.reason.trim() }); };
exports.sealOf = sealOf;
// A file, on one line, inside the realm. Main checks the same again.
var logPathError = function (path, realmPath) {
    var trimmed = path.trim();
    if (trimmed === '')
        return en_1.t.finish.pathRequired;
    if (trimmed.endsWith('/') || /[\r\n]/.test(trimmed))
        return en_1.t.finish.pathBad;
    return (0, task_rules_1.logFileIn)(realmPath, trimmed) === null ? en_1.t.finish.pathOutside : undefined;
};
exports.logPathError = logPathError;
