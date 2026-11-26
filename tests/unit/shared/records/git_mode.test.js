"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var record_source_1 = require("../../../../hooks/shared/records/data/datasources/record_source");
var git_mode_1 = require("../../../../hooks/shared/records/domain/services/git_mode");
(0, testing_1.test)('the Git modes are Manual and Assisted', function () {
    (0, testing_1.expect)(git_mode_1.GIT_MODES).toEqual(['manual', 'assisted']);
});
(0, testing_1.test)('only manual and assisted are Git modes', function () {
    (0, testing_1.expect)((0, git_mode_1.isGitMode)('manual')).toBe(true);
    (0, testing_1.expect)((0, git_mode_1.isGitMode)('assisted')).toBe(true);
    for (var _i = 0, _a = ['Manual', 'ASSISTED', 'auto', '', ' manual', null, undefined, 1, {}, ['manual']]; _i < _a.length; _i++) {
        var value = _a[_i];
        (0, testing_1.expect)([value, (0, git_mode_1.isGitMode)(value)]).toEqual([value, false]);
    }
});
(0, testing_1.test)('a record made before Git modes works as Assisted', function () {
    (0, testing_1.expect)((0, git_mode_1.gitModeOf)((0, record_source_1.emptyRecord)('p', '/p'))).toBe('assisted');
});
(0, testing_1.test)('a record keeps the mode it was given', function () {
    (0, testing_1.expect)((0, git_mode_1.gitModeOf)({ gitMode: 'manual' })).toBe('manual');
    (0, testing_1.expect)((0, git_mode_1.gitModeOf)({ gitMode: 'assisted' })).toBe('assisted');
});
