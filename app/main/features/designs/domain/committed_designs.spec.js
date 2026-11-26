"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var designs_1 = require("../../../../shared/designs");
var design_files_1 = require("./design_files");
// This repository's own docs/designs/, read the way the Designs tab reads it,
// so a committed file that doesn't read fails here instead of only in the app.
var DESIGNS = (0, node_path_1.resolve)(__dirname, '../../../../..', designs_1.DESIGNS_FOLDER);
var DESIGN = '.design.json';
var read = function (folder, file) { return (0, node_fs_1.readFileSync)((0, node_path_1.join)(DESIGNS, folder, file), 'utf8'); };
var value = function (parsed) {
    if (!parsed.ok)
        throw new Error("should read: ".concat(parsed.detail));
    return parsed.value;
};
// The tab skips any folder whose name doesn't fit the pattern, so these do too.
var folders = (0, node_fs_1.readdirSync)(DESIGNS, { withFileTypes: true })
    .filter(function (entry) { return entry.isDirectory() && (0, designs_1.isFolderName)(entry.name); })
    .map(function (entry) { return entry.name; })
    .sort();
(0, vitest_1.describe)('the designs committed in this repository', function () {
    (0, vitest_1.it)('has at least one version folder to check', function () {
        (0, vitest_1.expect)(folders.length).toBeGreaterThan(0);
    });
    var _loop_1 = function (folder) {
        var files = (0, node_fs_1.readdirSync)((0, node_path_1.join)(DESIGNS, folder)).sort();
        var designFiles = files.filter(function (name) { return name.endsWith(DESIGN); });
        (0, vitest_1.describe)("docs/designs/".concat(folder), function () {
            (0, vitest_1.it)('has a version.json that reads and whose label names this folder', function () {
                var version = value((0, design_files_1.parseVersion)(read(folder, 'version.json')));
                (0, vitest_1.expect)((0, designs_1.folderOf)(version.label)).toBe(folder);
            });
            (0, vitest_1.it)('has a file for every design its version.json lists', function () {
                var version = value((0, design_files_1.parseVersion)(read(folder, 'version.json')));
                (0, vitest_1.expect)(version.designs.filter(function (id) { return !files.includes("".concat(id).concat(DESIGN)); })).toEqual([]);
            });
            var _loop_2 = function (file) {
                (0, vitest_1.it)("has ".concat(file, " named with a design id, small enough and reading as a design"), function () {
                    var text = read(folder, file);
                    (0, vitest_1.expect)((0, designs_1.isDesignId)(file.slice(0, -DESIGN.length))).toBe(true);
                    (0, vitest_1.expect)(text.length).toBeLessThanOrEqual(designs_1.LIMITS.bytes);
                    (0, vitest_1.expect)((0, design_files_1.parseScene)(text)).toMatchObject({ ok: true });
                });
            };
            // parseScene already refuses a layer id used twice anywhere in the file.
            for (var _i = 0, designFiles_1 = designFiles; _i < designFiles_1.length; _i++) {
                var file = designFiles_1[_i];
                _loop_2(file);
            }
            if (files.includes('comments.json')) {
                (0, vitest_1.it)('has a comments.json that reads', function () {
                    (0, vitest_1.expect)((0, design_files_1.parseComments)(read(folder, 'comments.json'))).toMatchObject({ ok: true });
                });
            }
        });
    };
    for (var _i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
        var folder = folders_1[_i];
        _loop_1(folder);
    }
});
// Notes section task: the Notes designs drawn in Pen and exported as version "1".
// Fails until that export is committed to docs/designs/1/.
(0, vitest_1.describe)('Notes section task: the Pen export in docs/designs/1', function () {
    (0, vitest_1.it)('has a version.json labelled "1", drafted by Claude from no earlier version, listing at least one design', function () {
        var path = (0, node_path_1.join)(DESIGNS, '1', 'version.json');
        (0, vitest_1.expect)((0, node_fs_1.existsSync)(path), "".concat(path, " is not there yet")).toBe(true);
        var version = value((0, design_files_1.parseVersion)((0, node_fs_1.readFileSync)(path, 'utf8')));
        (0, vitest_1.expect)(version).toMatchObject({ label: '1', by: 'claude', from: null });
        (0, vitest_1.expect)(version.designs.length).toBeGreaterThan(0);
    });
});
