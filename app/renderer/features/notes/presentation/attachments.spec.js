"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var test_support_1 = require("../../../test_support");
var attachment_input_1 = require("../../../core/widgets/attachment_input");
var read_view_1 = require("./widgets/read_view");
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.it)('still opens a note whose title contains a dot', function () {
    var engine = (0, test_support_1.fakeEngine)().engine;
    var open = vitest_1.vi.fn();
    (0, preact_1.render)(<read_view_1.ReadView quests={new Map()} onOpenQuest={function () { }} engine={engine} realm="demo-abc123" body="[[Release 1.2#Changes|Release 1.2]]" notes={[(0, test_support_1.note)({ id: 'release', title: 'Release 1.2' })]} isLive onToggle={function () { }} onOpenNote={open} onOpenLink={function () { }}/>);
    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Release 1.2' }));
    (0, vitest_1.expect)(open).toHaveBeenCalledWith('release');
    (0, vitest_1.expect)(engine.readNoteFile).not.toHaveBeenCalled();
});
(0, vitest_1.it)('shows local images, previews PDFs on request, and downloads other files without opening an external URL', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, external, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                external = vitest_1.vi.fn();
                (0, preact_1.render)(<read_view_1.ReadView quests={new Map()} onOpenQuest={function () { }} engine={engine} realm="demo-abc123" body={'![Diagram](attachments/photo.png)\n\n[Report](attachments/report.pdf)\n\n[[table.csv]]\n\n![[attachments/photo.png|Wiki picture]]\n\n`![[ignored.png]]`'} notes={[]} isLive onToggle={function () { }} onOpenNote={function () { }} onOpenLink={external}/>);
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByAltText('Diagram')];
            case 1:
                _a.apply(void 0, [(_g.sent()).getAttribute('src')]).toContain('note-file://realm/demo-abc123/attachments/photo.png');
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByAltText('Wiki picture')];
            case 2:
                _b.apply(void 0, [_g.sent()]).toBeTruthy();
                (0, vitest_1.expect)(engine.readNoteFile).not.toHaveBeenCalledWith(vitest_1.expect.anything(), 'ignored.png');
                _d = (_c = preact_1.fireEvent).click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Preview PDF: Report' })];
            case 3:
                _d.apply(_c, [_g.sent()]);
                (0, vitest_1.expect)(preact_1.screen.getByTitle('PDF preview: Report').getAttribute('src')).toContain('attachments/report.pdf');
                _f = (_e = preact_1.fireEvent).click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Download table.csv' })];
            case 4:
                _f.apply(_e, [_g.sent()]);
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.downloadNoteFile).toHaveBeenCalledWith('demo-abc123', 'table.csv'); })];
            case 5:
                _g.sent();
                (0, vitest_1.expect)(external).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('names a missing file and offers a retry that can recover', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                vitest_1.vi.mocked(engine.readNoteFile).mockResolvedValueOnce({ ok: false, error: { message: 'File is missing. Put it back and try again.' } });
                (0, preact_1.render)(<read_view_1.ReadView quests={new Map()} onOpenQuest={function () { }} engine={engine} realm="demo-abc123" body="![Diagram](attachments/photo.png)" notes={[]} isLive onToggle={function () { }} onOpenNote={function () { }} onOpenLink={function () { }}/>);
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 1:
                _a.apply(void 0, [(_c.sent()).textContent]).toContain('File is missing');
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Try again' }));
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByAltText('Diagram')];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('rejects an invalid drop before importing, then imports a pasted image and inserts its Markdown', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, insert, container, zone, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); });
                container = (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea aria-label="Body"/></attachment_input_1.AttachmentInput>).container;
                zone = container.querySelector('.nt-dropzone');
                preact_1.fireEvent.drop(zone, { dataTransfer: { files: [new File(['text'], 'bad.txt', { type: 'text/plain' })] } });
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 1:
                _a.apply(void 0, [(_b.sent()).textContent]).toContain('Only image or PDF files are accepted.');
                (0, vitest_1.expect)(engine.attachNoteFile).not.toHaveBeenCalled();
                preact_1.fireEvent.paste(preact_1.screen.getByLabelText('Body'), { clipboardData: { files: [new File(['image'], 'paste.png', { type: 'image/png' })] } });
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledWith('![paste.png](<attachments/photo.png>)'); })];
            case 2:
                _b.sent();
                (0, vitest_1.expect)(engine.attachNoteFile).toHaveBeenCalledWith('demo-abc123', 'n-1', vitest_1.expect.objectContaining({ name: 'paste.png', bytes: vitest_1.expect.any(Uint8Array) }));
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('queues another drop while a file is being attached', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, finish, saving, insert, container, zone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                finish = function () { };
                saving = new Promise(function (resolve) { finish = resolve; });
                insert = vitest_1.vi.fn().mockImplementationOnce(function () { return saving; }).mockResolvedValue(undefined);
                container = (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea /></attachment_input_1.AttachmentInput>).container;
                zone = container.querySelector('.nt-dropzone');
                preact_1.fireEvent.drop(zone, { dataTransfer: { files: [new File(['one'], 'first.png', { type: 'image/png' })] } });
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledTimes(1); })];
            case 1:
                _a.sent();
                preact_1.fireEvent.drop(zone, { dataTransfer: { files: [new File(['two'], 'second.png', { type: 'image/png' })] } });
                finish();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledTimes(2); })];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(insert.mock.calls[1][0]).toContain('second.png');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('retries a partial batch from the failed file without inserting the first link twice', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, insert, container, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                vitest_1.vi.mocked(engine.attachNoteFile)
                    .mockResolvedValueOnce({ ok: true, data: { path: 'attachments/first.png', kind: 'image' } })
                    .mockResolvedValueOnce({ ok: false, error: { message: 'Could not write the second file. Try again.' } })
                    .mockResolvedValueOnce({ ok: true, data: { path: 'attachments/second.png', kind: 'image' } });
                insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); });
                container = (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea /></attachment_input_1.AttachmentInput>).container;
                preact_1.fireEvent.drop(container.querySelector('.nt-dropzone'), { dataTransfer: { files: [new File(['one'], 'first.png', { type: 'image/png' }), new File(['two'], 'second.png', { type: 'image/png' })] } });
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 1:
                _a.apply(void 0, [(_b.sent()).textContent]).toContain('Could not write the second file');
                (0, vitest_1.expect)(insert).toHaveBeenCalledTimes(1);
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Try again' }));
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledTimes(2); })];
            case 2:
                _b.sent();
                (0, vitest_1.expect)(insert.mock.calls.map(function (call) { return call[0]; })).toEqual(['![first.png](<attachments/first.png>)', '![second.png](<attachments/second.png>)']);
                return [2 /*return*/];
        }
    });
}); });
var clipboard = function (text, files) {
    if (files === void 0) { files = []; }
    return ({ clipboardData: { files: files, getData: function (type) { return (type === 'text/plain' ? text : ''); } } });
};
(0, vitest_1.it)('a link pasted in Read goes in as a bookmark, trimmed, and nothing else is pasted', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, insert, isUntouched;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); });
                (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><article aria-label="Read">Text</article></attachment_input_1.AttachmentInput>);
                isUntouched = preact_1.fireEvent.paste(preact_1.screen.getByLabelText('Read'), clipboard('  https://example.com/post\n'));
                (0, vitest_1.expect)(isUntouched).toBe(false);
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledWith('https://example.com/post'); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(engine.attachNoteFile).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('text that is not a single web link, pasted in Read, is left alone', function () {
    var engine = (0, test_support_1.fakeEngine)().engine;
    var insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><article aria-label="Read">Text</article></attachment_input_1.AttachmentInput>);
    for (var _i = 0, _a = ['', 'plain words', 'see https://example.com', 'file:///etc/passwd', 'https://a.com https://b.com']; _i < _a.length; _i++) {
        var text = _a[_i];
        (0, vitest_1.expect)(preact_1.fireEvent.paste(preact_1.screen.getByLabelText('Read'), clipboard(text)), text).toBe(true);
    }
    (0, vitest_1.expect)(insert).not.toHaveBeenCalled();
});
(0, vitest_1.it)('a link pasted in Write is left to the text box', function () {
    var engine = (0, test_support_1.fakeEngine)().engine;
    var insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); });
    (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><textarea aria-label="Body"/></attachment_input_1.AttachmentInput>);
    (0, vitest_1.expect)(preact_1.fireEvent.paste(preact_1.screen.getByLabelText('Body'), clipboard('https://example.com/post'))).toBe(true);
    (0, vitest_1.expect)(insert).not.toHaveBeenCalled();
});
(0, vitest_1.it)('a pasted file still attaches when the clipboard also holds a link', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, insert;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)().engine;
                insert = vitest_1.vi.fn(function (_markdown) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/];
                }); }); });
                (0, preact_1.render)(<attachment_input_1.AttachmentInput engine={engine} realm="demo-abc123" id="n-1" onInsert={insert}><article aria-label="Read">Text</article></attachment_input_1.AttachmentInput>);
                preact_1.fireEvent.paste(preact_1.screen.getByLabelText('Read'), clipboard('https://example.com/photo.png', [new File(['image'], 'photo.png', { type: 'image/png' })]));
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(insert).toHaveBeenCalledWith('![photo.png](<attachments/photo.png>)'); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(insert).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(engine.attachNoteFile).toHaveBeenCalledWith('demo-abc123', 'n-1', vitest_1.expect.objectContaining({ name: 'photo.png' }));
                return [2 /*return*/];
        }
    });
}); });
