"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var note_attachments_1 = require("../../../../shared/note_attachments");
var notes_1 = require("../../../../shared/notes");
(0, vitest_1.describe)('note attachments', function () {
    (0, vitest_1.it)('accepts an image or PDF below 10 MB, including files whose picker omits the type', function () {
        (0, vitest_1.expect)((0, note_attachments_1.attachmentError)({ name: 'photo.png', type: 'image/png', size: 100 })).toBeUndefined();
        (0, vitest_1.expect)((0, note_attachments_1.attachmentError)({ name: 'report.pdf', type: '', size: 100 })).toBeUndefined();
        (0, vitest_1.expect)((0, note_attachments_1.attachmentError)({ name: 'Pasted image', type: 'image/png', size: 100 })).toBeUndefined();
        (0, vitest_1.expect)((0, note_attachments_1.attachmentError)({ name: 'a.txt', type: 'text/plain', size: 100 })).toBe('type');
        (0, vitest_1.expect)((0, note_attachments_1.attachmentError)({ name: 'photo.png', type: 'image/png', size: 10 * 1024 * 1024 })).toBe('size');
    });
    (0, vitest_1.it)('reads only relative files in the vault root or its attachments folder', function () {
        (0, vitest_1.expect)((0, note_attachments_1.noteFilePath)('attachments/report%20one.pdf#page=2')).toBe('attachments/report one.pdf');
        (0, vitest_1.expect)((0, note_attachments_1.noteFilePath)('data.csv')).toBe('data.csv');
        for (var _i = 0, _a = ['../secret.pdf', 'attachments/../../secret.pdf', '/tmp/a.png', 'file:///tmp/a.png', 'https://a/b.png', 'attachments/%2e%2e/a.png', 'attachments/a%2fb.png', '.secret.pdf', 'attachments/.secret.pdf', 'note.md', 'a\\b.png']; _i < _a.length; _i++) {
            var value = _a[_i];
            (0, vitest_1.expect)((0, note_attachments_1.noteFilePath)(value)).toBeNull();
        }
    });
    (0, vitest_1.it)('writes portable Markdown and escapes the file label', function () {
        (0, vitest_1.expect)((0, note_attachments_1.attachmentMarkdown)({ path: 'attachments/a.png', kind: 'image' }, 'a [draft].png')).toBe('![a \\[draft\\].png](<attachments/a.png>)');
        (0, vitest_1.expect)((0, note_attachments_1.attachmentMarkdown)({ path: 'attachments/a.pdf', kind: 'pdf' }, 'report.pdf')).toBe('[report.pdf](<attachments/a.pdf>)');
        (0, vitest_1.expect)((0, note_attachments_1.noteFileUrl)('demo-abc123', 'attachments/a b.png')).toBe('note-file://realm/demo-abc123/attachments/a%20b.png');
    });
    (0, vitest_1.it)('keeps dotted note titles linkable while leaving attachment embeds out of renames', function () {
        (0, vitest_1.expect)((0, notes_1.linksOf)('[[Release 1.2]] ![[photo.png]] [[attachments/report.pdf]]')).toEqual(['Release 1.2']);
        (0, vitest_1.expect)((0, notes_1.renameLinks)('[[Release 1.2]]', 'Release 1.2', 'Release 1.3')).toBe('[[Release 1.3]]');
        (0, vitest_1.expect)((0, notes_1.renameLinks)('![[photo.png]]', 'photo.png', 'Other')).toBe('![[photo.png]]');
    });
});
