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
var vitest_1 = require("vitest");
var fixtures_1 = require("../../tasks/api/fixtures");
var space_rules_1 = require("./space_rules");
(0, vitest_1.describe)('the build folders in an ignored listing', function () {
    (0, vitest_1.it)('keeps listed build folders, outermost first, wherever they sit', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('node_modules/\0packages/app/node_modules/\0dist/\0.dart_tool/\0ios/Pods/\0')).toEqual(['.dart_tool', 'dist', 'ios/Pods', 'node_modules', 'packages/app/node_modules']);
    });
    (0, vitest_1.it)('skips entries git lists without a slash: files and symlinks named like a build folder', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('node_modules\0apps/web/node_modules\0build\0.env\0')).toEqual([]);
    });
    (0, vitest_1.it)('skips ignored folders that are not build output', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('logs/\0secrets/\0node_modules_old/\0my-build/\0.venv/\0')).toEqual([]);
    });
    (0, vitest_1.it)('drops a build folder inside one already kept, but not a sibling sharing its prefix', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('build/\0build/cache/node_modules/\0build-tools/node_modules/\0')).toEqual(['build', 'build-tools/node_modules']);
    });
    (0, vitest_1.it)('keeps names with spaces, unicode and newlines exactly as git wrote them', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('apps/my app/node_modules/\0приложение/dist/\0odd\nname/target/\0')).toEqual(['apps/my app/node_modules', 'odd\nname/target', 'приложение/dist']);
    });
    (0, vitest_1.it)('refuses paths that leave the folder or reach into .git', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('../node_modules/\0/abs/node_modules/\0a/../dist/\0x/.git/node_modules/\0')).toEqual([]);
    });
    (0, vitest_1.it)('finds nothing in an empty listing', function () {
        (0, vitest_1.expect)((0, space_rules_1.buildFoldersIn)('')).toEqual([]);
    });
});
(0, vitest_1.describe)('who holds a quest folder', function () {
    var PROJECT = '/realm';
    var FOLDER = '/quests/one';
    var own = (0, fixtures_1.makeTask)({ id: 'one', state: 'done', worktreePath: FOLDER });
    (0, vitest_1.it)('its own quest, when that quest is current', function () {
        var task = __assign(__assign({}, own), { state: 'current' });
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([task], task, FOLDER, PROJECT, true)).toBe('current');
    });
    (0, vitest_1.it)('another current quest working in the same folder', function () {
        var other = (0, fixtures_1.makeTask)({ id: 'two', state: 'current', worktreePath: FOLDER });
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([own, other], own, FOLDER, PROJECT, false)).toBe('current');
    });
    (0, vitest_1.it)('a current quest in the project folder does not hold a quest folder', function () {
        var other = (0, fixtures_1.makeTask)({ id: 'two', state: 'current', worktreePath: null });
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([own, other], own, FOLDER, PROJECT, false)).toBeNull();
    });
    (0, vitest_1.it)('a queued or done quest naming the folder does not hold it', function () {
        var queued = (0, fixtures_1.makeTask)({ id: 'two', state: 'queued', worktreePath: FOLDER });
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([own, queued], own, FOLDER, PROJECT, false)).toBeNull();
    });
    (0, vitest_1.it)('a live session in the folder, when no quest is current there', function () {
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([own], own, FOLDER, PROJECT, true)).toBe('session');
    });
    (0, vitest_1.it)('nobody, when no quest is current there and no session is open', function () {
        (0, vitest_1.expect)((0, space_rules_1.holdOf)([own], own, FOLDER, PROJECT, false)).toBeNull();
    });
});
