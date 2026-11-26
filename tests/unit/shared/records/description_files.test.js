"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var description_files_1 = require("../../../../hooks/shared/records/domain/services/description_files");
var IMAGE = "attachments/".concat('a1'.repeat(32), ".png");
var PDF = "attachments/".concat('b2'.repeat(32), ".pdf");
var FOLDER = '/h/.queue-tea/notes/app-1a2b3c';
(0, testing_1.test)('a description finds the images and PDFs Queue-tea saved, in order, with or without angle brackets', function () {
    var text = "See the mock:\n![mock.png](<".concat(IMAGE, ">)\nand the spec [spec.pdf](").concat(PDF, "), then ![again](").concat(IMAGE, ")");
    (0, testing_1.expect)((0, description_files_1.descriptionFiles)(text)).toEqual([
        { name: 'mock.png', path: IMAGE, isImage: true },
        { name: 'spec.pdf', path: PDF, isImage: false },
        { name: 'again', path: IMAGE, isImage: true },
    ]);
});
(0, testing_1.test)('an escaped bracket or backslash in a file name reads as itself', function () {
    (0, testing_1.expect)((0, description_files_1.descriptionFiles)("![Plan \\[v2\\] a\\\\b.png](<".concat(IMAGE, ">)"))).toEqual([{ name: 'Plan [v2] a\\b.png', path: IMAGE, isImage: true }]);
});
(0, testing_1.test)('web links, hand-typed paths, other folders and names that are not a hash are not files', function () {
    var hash = 'c3'.repeat(32);
    var text = [
        "[site](https://example.com/attachments/".concat(hash, ".png)"),
        "[up](../attachments/".concat(hash, ".png)"),
        "[abs](</Users/r/attachments/".concat(hash, ".png>)"),
        "[other](images/".concat(hash, ".png)"),
        "[nested](notes/attachments/".concat(hash, ".png)"),
        '[named](attachments/photo.png)',
        "[short](attachments/".concat(hash.slice(1), ".png)"),
        "[upper](attachments/".concat(hash.toUpperCase(), ".png)"),
        "[bare](attachments/".concat(hash, ")"),
        '[[a wiki link]]',
    ].join('\n');
    (0, testing_1.expect)((0, description_files_1.descriptionFiles)(text)).toEqual([]);
});
(0, testing_1.test)('a quest with no description, or an empty one, links no files', function () {
    (0, testing_1.expect)((0, description_files_1.descriptionFiles)(null)).toEqual([]);
    (0, testing_1.expect)((0, description_files_1.descriptionFiles)('')).toEqual([]);
});
(0, testing_1.test)('withFilePaths points each saved file at the notes folder and leaves every other link as it was', function () {
    var text = "![mock](<".concat(IMAGE, ">) and [spec](").concat(PDF, ")\n[site](https://example.com) [named](attachments/photo.png) [up](../attachments/").concat('c3'.repeat(32), ".png)");
    (0, testing_1.expect)((0, description_files_1.withFilePaths)(text, FOLDER)).toBe("![mock](<".concat(FOLDER, "/").concat(IMAGE, ">) and [spec](<").concat(FOLDER, "/").concat(PDF, ">)\n[site](https://example.com) [named](attachments/photo.png) [up](../attachments/").concat('c3'.repeat(32), ".png)"));
});
(0, testing_1.test)('withFilePaths keeps an escaped name escaped, so the link still reads as one', function () {
    (0, testing_1.expect)((0, description_files_1.withFilePaths)("![Plan \\[v2\\]](".concat(IMAGE, ")"), FOLDER)).toBe("![Plan \\[v2\\]](<".concat(FOLDER, "/").concat(IMAGE, ">)"));
});
(0, testing_1.test)("the realm's notes folder is named by its record file", function () {
    (0, testing_1.expect)((0, description_files_1.notesFolderOf)({ home: '/h', file: '/h/.queue-tea/projects/app-1a2b3c.json' })).toBe('/h/.queue-tea/notes/app-1a2b3c');
});
