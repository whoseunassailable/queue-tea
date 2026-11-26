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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var test_1 = require("@playwright/test");
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'files-abc123';
var PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');
var pdf = function () {
    var objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>', '<< /Length 45 >>\nstream\nBT /F1 18 Tf 30 250 Td (Notes attachment) Tj ET\nendstream', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
    var text = '%PDF-1.4\n';
    var offsets = [0];
    for (var _i = 0, _a = objects.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], i = _b[0], object = _b[1];
        offsets.push(Buffer.byteLength(text));
        text += "".concat(i + 1, " 0 obj\n").concat(object, "\nendobj\n");
    }
    var xref = Buffer.byteLength(text);
    text += "xref\n0 6\n0000000000 65535 f \n".concat(offsets.slice(1).map(function (offset) { return String(offset).padStart(10, '0') + ' 00000 n \n'; }).join(''), "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n").concat(xref, "\n%%EOF\n");
    return Buffer.from(text);
};
var home;
var app;
var page;
var errors = [];
var vault = function () { return (0, node_path_1.join)(home, '.queue-tea/notes', KEY); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-attachments-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'project'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(vault(), { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'File notes', path: (0, node_path_1.join)(home, 'project') }, tasks: [], requests: [] }))];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), 'Files.md'), '---\ntitle: Files\n---\nBefore\n\n[Table](table.csv)')];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), 'table.csv'), 'a,b\n1,2')];
            case 7:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 8:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 9:
                page = _a.sent();
                page.on('pageerror', function (error) { return errors.push(String(error)); });
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^File notes/ }).click()];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 12:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Files')];
            case 13:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test_1.test.afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Close the renderer and its PDF guest before detaching Playwright's main
            // debugger session. Otherwise Electron can wait on the guest at app.quit.
            return [4 /*yield*/, (page === null || page === void 0 ? void 0 : page.close())];
            case 1:
                // Close the renderer and its PDF guest before detaching Playwright's main
                // debugger session. Otherwise Electron can wait on the guest at app.quit.
                _a.sent();
                return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('picking, dropping and pasting persist portable links and Read renders image and PDF previews', function (_a, testInfo_1) { return __awaiter(void 0, [_a, testInfo_1], void 0, function (_b, testInfo) {
    var body, text, _c, viewer, downloaded, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, body.click()];
            case 1:
                _f.sent();
                return [4 /*yield*/, body.press('Meta+End')];
            case 2:
                _f.sent();
                return [4 /*yield*/, page.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'picked.png', mimeType: 'image/png', buffer: PNG })];
            case 3:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue(/!\[picked.png\]\(<attachments\/.+\.png>\)/)];
            case 4:
                _f.sent();
                return [4 /*yield*/, page.evaluate(function (_a) {
                        var image = _a.image;
                        var transfer = new DataTransfer();
                        transfer.items.add(new File([Uint8Array.from(atob(image), function (c) { return c.charCodeAt(0); })], 'Pasted image', { type: 'image/png' }));
                        document.querySelector('textarea#nt-body').dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer, bubbles: true, cancelable: true }));
                    }, { image: PNG.toString('base64') })];
            case 5:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue(/Pasted image/)];
            case 6:
                _f.sent();
                return [4 /*yield*/, page.evaluate(function (_a) {
                        var report = _a.report;
                        var transfer = new DataTransfer();
                        transfer.items.add(new File([Uint8Array.from(atob(report), function (c) { return c.charCodeAt(0); })], 'report.pdf', { type: 'application/pdf' }));
                        document.querySelector('.nt-dropzone').dispatchEvent(new DragEvent('drop', { dataTransfer: transfer, bubbles: true, cancelable: true }));
                    }, { report: pdf().toString('base64') })];
            case 7:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue(/\[report.pdf\]\(<attachments\/.+\.pdf>\)/)];
            case 8:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()];
            case 9:
                _f.sent();
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(vault(), 'Files.md'), 'utf8')];
            case 10:
                text = _f.sent();
                (0, test_1.expect)(text).toContain('picked.png');
                (0, test_1.expect)(text).toContain('Pasted image');
                (0, test_1.expect)(text).toContain('report.pdf');
                (0, test_1.expect)(text).not.toContain('note-file:');
                _c = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(vault(), 'attachments'))];
            case 11:
                _c.apply(void 0, [_f.sent()]).toHaveLength(2);
                return [4 /*yield*/, page.getByRole('button', { name: 'Read', exact: true }).click()];
            case 12:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByAltText('picked.png')).toBeVisible()];
            case 13:
                _f.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return page.getByAltText('picked.png').evaluate(function (image) { return image.naturalWidth; }); }).toBe(1)];
            case 14:
                _f.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Preview PDF: report.pdf' }).click()];
            case 15:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByTitle('PDF preview: report.pdf')).toBeVisible()
                    // Chromium's built-in PDF viewer must actually load; an iframe alone is
                    // not evidence that Electron accepted the document.
                ];
            case 16:
                _f.sent();
                // Chromium's built-in PDF viewer must actually load; an iframe alone is
                // not evidence that Electron accepted the document.
                return [4 /*yield*/, test_1.expect.poll(function () { return page.frames().map(function (frame) { return frame.url(); }).some(function (url) { return url.startsWith('chrome-extension://') && url.includes('/index.html'); }); }).toBe(true)];
            case 17:
                // Chromium's built-in PDF viewer must actually load; an iframe alone is
                // not evidence that Electron accepted the document.
                _f.sent();
                viewer = page.frames().find(function (frame) { return frame.url().startsWith('chrome-extension://') && frame.url().includes('/index.html'); });
                return [4 /*yield*/, test_1.expect.poll(function () { return viewer.evaluate(function () {
                        var _a;
                        var pdf = document.querySelector('pdf-viewer');
                        return (_a = pdf === null || pdf === void 0 ? void 0 : pdf.docLength_) !== null && _a !== void 0 ? _a : 0;
                    }); }, { timeout: 15000 }).toBe(1)];
            case 18:
                _f.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('attachments.png'), fullPage: true })];
            case 19:
                _f.sent();
                downloaded = (0, node_path_1.join)(home, 'downloaded.csv');
                return [4 /*yield*/, app.evaluate(function (_a, filePath) {
                        var dialog = _a.dialog;
                        dialog.showSaveDialog = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ canceled: false, filePath: filePath })];
                        }); }); };
                    }, downloaded)];
            case 20:
                _f.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Download Table' }).click()];
            case 21:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('File downloaded.')).toBeVisible()];
            case 22:
                _f.sent();
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(downloaded, 'utf8')];
            case 23:
                _d.apply(void 0, [_f.sent()]).toBe('a,b\n1,2');
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 24:
                _f.sent();
                _e = test_1.expect;
                return [4 /*yield*/, page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; })];
            case 25:
                _e.apply(void 0, [_f.sent()]).toBe(true);
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('invalid files show inline errors and cannot be imported through IPC', function () { return __awaiter(void 0, void 0, void 0, function () {
    var filesBefore, answer, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(vault(), 'attachments')).catch(function () { return []; })];
            case 1:
                filesBefore = _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Write', exact: true }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('bad') })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('alert').filter({ hasText: 'Only image or PDF files are accepted.' })).toBeVisible()];
            case 4:
                _b.sent();
                return [4 /*yield*/, page.evaluate(function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, window.engine.attachNoteFile(key, 'Files', { name: 'forged.png', type: 'image/png', bytes: new Uint8Array([1, 2, 3]) })];
                    }); }); }, KEY)];
            case 5:
                answer = _b.sent();
                (0, test_1.expect)(answer.ok).toBe(false);
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(vault(), 'attachments')).catch(function () { return []; })];
            case 6:
                _a.apply(void 0, [_b.sent()]).toEqual(filesBefore);
                return [2 /*return*/];
        }
    });
}); });
