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
var vitest_1 = require("vitest");
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var workspace_store_1 = require("../../../workspace/state_management/workspace_store");
var note_flows_1 = require("./note_flows");
var KEY = 'a-000001';
(0, vitest_1.describe)('jotting from another screen', function () {
    (0, vitest_1.it)('shows progress until the note is saved, then replaces it with Open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var finish, engine, workspace, onOpen, saving, toasts;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)({ createNote: vitest_1.vi.fn(function () { return new Promise(function (resolve) { finish = resolve; }); }) }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    onOpen = vitest_1.vi.fn();
                    saving = (0, note_flows_1.jotIdea)(engine, workspace, KEY, ' Buy [milk] ', onOpen);
                    (0, vitest_1.expect)(workspace.getState().toasts.map(function (toast) { return toast.text; })).toEqual(['Jotting your idea into Inbox…']);
                    finish({ ok: true, data: { view: test_support_1.NOTES, id: 'made' } });
                    return [4 /*yield*/, saving];
                case 1:
                    _d.sent();
                    (0, vitest_1.expect)(engine.createNote).toHaveBeenCalledWith(KEY, { title: 'Buy milk', folder: 'Inbox', body: 'Buy [milk]' });
                    toasts = workspace.getState().toasts;
                    (0, vitest_1.expect)(toasts).toHaveLength(1);
                    (0, vitest_1.expect)((_a = toasts[0]) === null || _a === void 0 ? void 0 : _a.tone).toBe('success');
                    (_c = (_b = toasts[0]) === null || _b === void 0 ? void 0 : _b.action) === null || _c === void 0 ? void 0 : _c.run();
                    (0, vitest_1.expect)(onOpen).toHaveBeenCalledWith('made');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('logs a rejected call and lets Try again save the same idea in the same realm', function () { return __awaiter(void 0, void 0, void 0, function () {
        var createNote, engine, workspace, failed;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    createNote = vitest_1.vi.fn().mockRejectedValueOnce(new Error('private failure')).mockResolvedValueOnce({ ok: true, data: { view: test_support_1.NOTES, id: 'made' } });
                    engine = (0, test_support_1.fakeEngine)({ createNote: createNote }).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, note_flows_1.jotIdea)(engine, workspace, KEY, 'Buy milk', vitest_1.vi.fn())];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(engine.log).toHaveBeenCalledWith('error', vitest_1.expect.stringContaining('private failure'));
                    failed = workspace.getState().toasts.at(-1);
                    (0, vitest_1.expect)(failed.text).toContain(en_1.t.failed.noAnswer);
                    (0, vitest_1.expect)(failed.text).not.toContain('private failure');
                    (0, vitest_1.expect)((_a = failed.action) === null || _a === void 0 ? void 0 : _a.label).toBe(en_1.t.failed.tryAgain);
                    (_b = failed.action) === null || _b === void 0 ? void 0 : _b.run();
                    return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(createNote).toHaveBeenCalledTimes(2); })];
                case 2:
                    _c.sent();
                    (0, vitest_1.expect)(createNote.mock.calls[1]).toEqual([KEY, { title: 'Buy milk', folder: 'Inbox', body: '' }]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does nothing with an empty idea', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, workspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)().engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, note_flows_1.jotIdea)(engine, workspace, KEY, '  ', vitest_1.vi.fn())];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(engine.createNote).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(workspace.getState().toasts).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
