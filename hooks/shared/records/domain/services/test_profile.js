"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTestProfile = exports.checkTestPick = exports.isTestProfileId = exports.TEST_PROFILE_LIMITS = exports.TEST_PROFILE_IDS = void 0;
// Lightest first: each profile runs everything the ones before it run.
exports.TEST_PROFILE_IDS = ['quick', 'standard', 'deep', 'critical', 'release'];
exports.TEST_PROFILE_LIMITS = { reason: 160 };
var isTestProfileId = function (value) {
    return exports.TEST_PROFILE_IDS.includes(value);
};
exports.isTestProfileId = isTestProfileId;
// Tea-DD's pick as the tool received it: a known profile and a reason Rohan can read.
var checkTestPick = function (input) {
    var v = (input !== null && input !== void 0 ? input : {});
    if (!(0, exports.isTestProfileId)(v.profile))
        return 'profile';
    var reason = typeof v.reason === 'string' ? v.reason.trim() : '';
    if (reason === '' || reason.length > exports.TEST_PROFILE_LIMITS.reason)
        return 'reason';
    return { id: v.profile, reason: reason };
};
exports.checkTestPick = checkTestPick;
// Reads a hand-edited field: anything malformed is no profile, never an unreadable realm.
var readTestProfile = function (value) {
    var v = (value !== null && value !== void 0 ? value : {});
    if (!(0, exports.isTestProfileId)(v.id))
        return undefined;
    if (v.by === 'rohan')
        return { id: v.id, by: 'rohan' };
    var reason = typeof v.reason === 'string' ? v.reason.trim().slice(0, exports.TEST_PROFILE_LIMITS.reason) : '';
    return v.by === 'tea-dd' && reason !== '' ? { id: v.id, by: 'tea-dd', reason: reason } : undefined;
};
exports.readTestProfile = readTestProfile;
