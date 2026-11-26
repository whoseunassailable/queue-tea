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
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var note_history_1 = require("./note_history");
(0, vitest_1.afterEach)(preact_1.cleanup);
var versions = [{ id: 'new', savedAt: '2026-11-07T10:00:00Z' }, { id: 'old', savedAt: '2026-11-06T10:00:00Z' }];
(0, vitest_1.it)('keeps a restore conflict visible when a different snapshot is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: versions })];
                    }); }); }, readNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_support_1.note)({ stamp: 'older' }) })];
                    }); }); }, restoreNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: { kind: 'changed', note: (0, test_support_1.note)({ stamp: 'outside' }) } })];
                    }); }); } }).engine;
                (0, preact_1.render)(<note_history_1.NoteHistory engine={engine} realm="demo" note={(0, test_support_1.note)()} onClose={function () { }} onRestored={function () { }} onRefresh={function () { }}/>);
                return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.notebook.history.preview)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.restore }))];
                    }); }); })];
            case 2:
                _b.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 3:
                _a.apply(void 0, [(_b.sent()).textContent]).toContain(en_1.t.notebook.history.changed);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('list')).getAllByRole('button')[1])];
                    }); }); })];
            case 4:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toContain(en_1.t.notebook.history.changed);
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.restore }).disabled).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps keyboard focus in the sheet when restoring disables the focused button', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, preview, restore;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: versions })];
                    }); }); }, readNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_support_1.note)({ stamp: 'older' }) })];
                    }); }); }, restoreNoteVersion: function () { return new Promise(function () { }); } }).engine;
                (0, preact_1.render)(<note_history_1.NoteHistory engine={engine} realm="demo" note={(0, test_support_1.note)()} onClose={function () { }} onRestored={function () { }} onRefresh={function () { }}/>);
                return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.notebook.history.preview)];
            case 1:
                preview = _a.sent();
                restore = preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.restore });
                restore.focus();
                preact_1.fireEvent.click(restore);
                return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.history.restoring)];
            case 2:
                _a.sent();
                preact_1.fireEvent.keyDown(window, { key: 'Tab' });
                (0, vitest_1.expect)(document.activeElement).toBe(preview);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('selecting the current version again keeps its preview and cannot restore it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, engine, selected;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                current = (0, test_support_1.note)({ body: 'Current text' });
                engine = (0, test_support_1.fakeEngine)({ readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: versions })];
                    }); }); }, readNoteVersion: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: current })];
                    }); }); } }).engine;
                (0, preact_1.render)(<note_history_1.NoteHistory engine={engine} realm="demo" note={current} onClose={function () { }} onRestored={function () { }} onRefresh={function () { }}/>);
                return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.notebook.history.preview)];
            case 1:
                _a.sent();
                selected = (0, preact_1.within)(preact_1.screen.getByRole('list')).getAllByRole('button')[0];
                preact_1.fireEvent.click(selected);
                (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.history.preview).textContent).toBe('Current text');
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.restore }).disabled).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a slow preview cannot replace a different version selected afterward', function () { return __awaiter(void 0, void 0, void 0, function () {
    var finishNew, readNoteVersion, engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                readNoteVersion = vitest_1.vi.fn(function (_realm, _id, version) { return version === 'new' ? new Promise(function (resolve) { finishNew = resolve; }) : Promise.resolve({ ok: true, data: (0, test_support_1.note)({ body: 'Older text' }) }); });
                engine = (0, test_support_1.fakeEngine)({ readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: versions })];
                    }); }); }, readNoteVersion: readNoteVersion }).engine;
                (0, preact_1.render)(<note_history_1.NoteHistory engine={engine} realm="demo" note={(0, test_support_1.note)()} onClose={function () { }} onRestored={function () { }} onRefresh={function () { }}/>);
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readNoteVersion).toHaveBeenCalledWith('demo', (0, test_support_1.note)().id, 'new'); })];
            case 1:
                _b.sent();
                preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('list')).getAllByRole('button')[1]);
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.notebook.history.preview)];
            case 2:
                _a.apply(void 0, [(_b.sent()).textContent]).toBe('Older text');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, finishNew({ ok: true, data: (0, test_support_1.note)({ body: 'Newer text' }) })];
                    }); }); })];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByLabelText(en_1.t.notebook.history.preview).textContent).toBe('Older text');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('Tab wraps inside the sheet and a failed preview cannot trigger restore with ⌘Enter', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, buttons, close;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readNoteHistory: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: versions })];
                    }); }); } }).engine;
                (0, preact_1.render)(<note_history_1.NoteHistory engine={engine} realm="demo" note={(0, test_support_1.note)()} onClose={function () { }} onRestored={function () { }} onRefresh={function () { }}/>);
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 1:
                _a.sent();
                buttons = (0, preact_1.within)(preact_1.screen.getByRole('list')).getAllByRole('button');
                close = preact_1.screen.getByRole('button', { name: en_1.t.notebook.history.close });
                close.focus();
                preact_1.fireEvent.keyDown(window, { key: 'Tab' });
                (0, vitest_1.expect)(document.activeElement).toBe(buttons[0]);
                preact_1.fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
                (0, vitest_1.expect)(document.activeElement).toBe(close);
                preact_1.fireEvent.keyDown(window, { key: 'Enter', metaKey: true });
                (0, vitest_1.expect)(engine.restoreNoteVersion).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
