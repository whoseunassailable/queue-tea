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
exports.sealOf = exports.logPathIn = exports.logPathOf = exports.questEditOf = exports.newQuestOf = exports.parentOf = exports.difficultyOf = exports.platformOf = exports.priorityOf = exports.questIdOf = void 0;
var task_rules_1 = require("../../../../../hooks/features/tasks/domain/services/task_rules");
var calendar_1 = require("../../../../shared/calendar");
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var test_profile_1 = require("../../../../../hooks/shared/records/domain/services/test_profile");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var TITLE_LIMIT = 200;
var PRIORITIES = ['urgent', 'high', 'mid', 'okay', 'low'];
var DIFFICULTIES = ['light', 'medium', 'hard'];
var PLATFORMS = ['claude', 'codex'];
// Everything from the window is checked again here: a screen's checks are for
// the person using it, and these are for the record.
var questIdOf = function (value) {
    if (typeof value !== 'string' || value === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.badQuest);
    return value;
};
exports.questIdOf = questIdOf;
var priorityOf = function (value) {
    if (!PRIORITIES.includes(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return value;
};
exports.priorityOf = priorityOf;
var platformOf = function (value) {
    if (!PLATFORMS.includes(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.badPlatform);
    return value;
};
exports.platformOf = platformOf;
var difficultyOf = function (value) {
    if (!DIFFICULTIES.includes(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return value;
};
exports.difficultyOf = difficultyOf;
var titleOf = function (value) {
    var title = typeof value === 'string' ? value.trim() : '';
    if (title === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.titleRequired);
    if (title.length > TITLE_LIMIT)
        throw new reply_1.Refusal(messages_1.MESSAGES.titleTooLong);
    return title;
};
var descriptionOf = function (value) {
    if (value === null || value === undefined)
        return null;
    if (typeof value !== 'string')
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return value.trim() === '' ? null : value.trim();
};
var criteriaOf = function (value) {
    if (value === undefined)
        return [];
    if (!Array.isArray(value) || value.some(function (line) { return typeof line !== 'string'; }))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return value.map(function (line) { return line.trim(); }).filter(function (line) { return line !== ''; });
};
var helpersOf = function (value) {
    if (!Array.isArray(value) || !value.every(helpers_1.isHelperId))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return (0, helpers_1.onlyHelpers)(value);
};
var parentOf = function (value) {
    var pick = value;
    if ((pick === null || pick === void 0 ? void 0 : pick.kind) === 'none')
        return { kind: 'none' };
    if ((pick === null || pick === void 0 ? void 0 : pick.kind) === 'task')
        return { kind: 'task', id: (0, exports.questIdOf)(pick.id) };
    if ((pick === null || pick === void 0 ? void 0 : pick.kind) === 'new')
        return { kind: 'new', title: titleOf(pick.title) };
    throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
};
exports.parentOf = parentOf;
var newQuestOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    return {
        title: titleOf(v.title),
        priority: (0, exports.priorityOf)(v.priority),
        difficulty: (0, exports.difficultyOf)(v.difficulty),
        parent: (0, exports.parentOf)(v.parent),
        description: descriptionOf(v.description),
        criteria: criteriaOf(v.criteria),
        helpers: v.helpers === undefined ? (0, helpers_1.defaultHelpers)().on : helpersOf(v.helpers),
    };
};
exports.newQuestOf = newQuestOf;
var testProfileOf = function (value) {
    if (value !== null && !(0, test_profile_1.isTestProfileId)(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.badValue);
    return value;
};
// A day such as 2026-12-01, or null to clear it.
var dueOf = function (value) {
    if (value === null)
        return null;
    if (!(0, calendar_1.isDay)(value))
        throw new reply_1.Refusal(messages_1.MESSAGES.dueBad);
    return value;
};
var questEditOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    return __assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (v.title === undefined ? {} : { title: titleOf(v.title) })), (v.description === undefined ? {} : { description: descriptionOf(v.description) })), (v.criteria === undefined ? {} : { criteria: criteriaOf(v.criteria) })), (v.difficulty === undefined ? {} : { difficulty: (0, exports.difficultyOf)(v.difficulty) })), (v.helpers === undefined ? {} : { helpers: helpersOf(v.helpers) })), (v.testProfile === undefined ? {} : { testProfile: testProfileOf(v.testProfile) })), (v.due === undefined ? {} : { due: dueOf(v.due) }));
};
exports.questEditOf = questEditOf;
// The task log's path, or null when none was given. A file, on one line.
var logPathOf = function (value) {
    if (value === null || value === undefined)
        return null;
    var path = typeof value === 'string' ? value.trim() : '';
    if (path === '')
        throw new reply_1.Refusal(messages_1.MESSAGES.logPathRequired);
    if (path.endsWith('/') || /[\r\n\0]/.test(path))
        throw new reply_1.Refusal(messages_1.MESSAGES.logPathBad);
    return path;
};
exports.logPathOf = logPathOf;
// As above, and inside this realm: one realm's log never lands in another.
var logPathIn = function (value, projectPath) {
    var path = (0, exports.logPathOf)(value);
    if (path !== null && (0, task_rules_1.logFileIn)(projectPath, path) === null)
        throw new reply_1.Refusal(messages_1.MESSAGES.logPathOutside);
    return path;
};
exports.logPathIn = logPathIn;
var sealOf = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    if (typeof v.waitFor === 'string' && v.waitFor !== '')
        return { waitFor: v.waitFor };
    if (typeof v.reason === 'string' && v.reason.trim() !== '')
        return { reason: v.reason.trim() };
    throw new reply_1.Refusal(messages_1.MESSAGES.reasonRequired);
};
exports.sealOf = sealOf;
