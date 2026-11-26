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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var test_support_1 = require("../../../../test_support");
var free_space_1 = require("./free_space");
var KEY = 'a-000001';
var folder = function (over) { return (__assign({ title: "Quest ".concat(over.taskId), branch: "task/".concat(over.taskId), path: "/quests/".concat(over.taskId), bytes: 5e6, freeable: 2e6, folders: ['node_modules'], held: null, merged: false, changed: [], removable: false }, over)); };
var space = function () {
    var folders = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        folders[_i] = arguments[_i];
    }
    return ({ ok: true, data: { at: 0, folders: folders } });
};
var open = function (over_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([over_1], args_1, true), void 0, function (over, onClose) {
        var engine;
        if (onClose === void 0) { onClose = function () { }; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)(over).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            (0, preact_1.render)(<free_space_1.FreeSpace engine={engine} realm={KEY} onClose={onClose}/>);
                            return [2 /*return*/];
                        }); }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, engine];
            }
        });
    });
};
var click = function (el) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(el); })];
}); }); };
var isDisabled = function (el) { return el.disabled; };
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.it)('says it is measuring until the folders arrive, then shows each with its size', function () { return __awaiter(void 0, void 0, void 0, function () {
    var answer, engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: vitest_1.vi.fn(function () { return new Promise(function (done) { answer = done; }); }) })];
            case 1:
                engine = _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Measuring each quest folder… Large build folders can take a minute.')).toBeTruthy();
                (0, vitest_1.expect)(isDisabled(preact_1.screen.getByRole('button', { name: 'Free space' }))).toBe(true);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer(space(folder({ taskId: 'one' })))];
                    }); }); })];
            case 2:
                _b.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Quest one')];
            case 3:
                _a.apply(void 0, [_b.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('5 MB on disk · clearing frees 2 MB')).toBeTruthy();
                (0, vitest_1.expect)(engine.readFolderSpace).toHaveBeenCalledWith(KEY);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('says what went wrong when measuring fails, and measures again on Try again', function () { return __awaiter(void 0, void 0, void 0, function () {
    var read, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                read = vitest_1.vi.fn()
                    .mockResolvedValueOnce({ ok: false, error: { message: 'The task folders could not be measured. Check that the project folder is available, then try again.' } })
                    .mockResolvedValueOnce(space(folder({ taskId: 'one' })));
                return [4 /*yield*/, open({ readFolderSpace: read })];
            case 1:
                _c.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 2:
                _a.apply(void 0, [(_c.sent()).textContent]).toContain('could not be measured');
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Try again' }))];
            case 3:
                _c.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Quest one')];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                (0, vitest_1.expect)(read).toHaveBeenCalledTimes(2);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('says when there are no quest folders yet, and what makes one', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space()];
                    }); }); } })];
            case 1:
                _b.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('No quest folders yet')];
            case 2:
                _a.apply(void 0, [_b.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('A quest gets its own folder when the app starts it. Its folder shows here.')).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('asks for a folder when Free space is pressed with none chosen, and clears nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, submit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one' }))];
                    }); }); } })];
            case 1:
                engine = _a.sent();
                return [4 /*yield*/, preact_1.screen.findByText('Quest one')];
            case 2:
                _a.sent();
                submit = preact_1.screen.getByRole('button', { name: 'Free space' });
                (0, vitest_1.expect)(isDisabled(submit)).toBe(false);
                return [4 /*yield*/, click(submit)];
            case 3:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('alert').textContent).toBe('Choose at least one folder to clear.');
                (0, vitest_1.expect)(engine.freeFolderSpace).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('frees the chosen folders, naming their total on the button and once done', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, open({
                    readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one', freeable: 2e6 }), folder({ taskId: 'two', freeable: 1e6 }), folder({ taskId: 'three' }))];
                    }); }); },
                    freeFolderSpace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one', folders: [], freeable: 0 }))];
                    }); }); }),
                })];
            case 1:
                engine = _c.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: 'Quest one' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: 'Quest two' }))];
            case 4:
                _c.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Free 3 MB from 2 folders' }))];
            case 5:
                _c.sent();
                (0, vitest_1.expect)(engine.freeFolderSpace).toHaveBeenCalledWith(KEY, ['/quests/one', '/quests/two']);
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Freed 3 MB. Run your install again in a folder when you go back to it.')];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows the clearing line and locks the sheet while folders are cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
    var answer, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one' }))];
                    }); }); }, freeFolderSpace: vitest_1.vi.fn(function () { return new Promise(function (done) { answer = done; }); }) })];
            case 1:
                _b.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: 'Quest one' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 3:
                _b.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))];
            case 4:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Clearing build folders…')).toBeTruthy();
                (0, vitest_1.expect)(isDisabled(preact_1.screen.getByRole('checkbox', { name: 'Quest one' }))).toBe(true);
                (0, vitest_1.expect)(isDisabled(preact_1.screen.getByRole('button', { name: 'Measure again' }))).toBe(true);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, answer(space(folder({ taskId: 'one', folders: [], freeable: 0 })))];
                    }); }); })];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(preact_1.screen.queryByText('Clearing build folders…')).toBeNull(); })];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows the engine\'s refusal and keeps the folders on screen', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, open({
                    readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one' }))];
                    }); }); },
                    freeFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: 'A quest or a session started working in one of these folders. Refresh and choose again.' } })];
                    }); }); },
                })];
            case 1:
                _c.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: 'Quest one' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))];
            case 4:
                _c.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 5:
                _b.apply(void 0, [(_c.sent()).textContent]).toContain('started working in one of these folders');
                (0, vitest_1.expect)(preact_1.screen.getByText('Quest one')).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('says who holds a folder, and neither a held folder nor one with nothing to clear can be chosen', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _i, _b, title;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, space(folder({ taskId: 'one' }), folder({ taskId: 'two', held: 'current' }), folder({ taskId: 'three', held: 'session' }), folder({ taskId: 'four', folders: [], freeable: 0 }))];
                        });
                    }); } })];
            case 1:
                engine = _c.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('The current quest works here, so it is not touched.')];
            case 2:
                _a.apply(void 0, [_c.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('A Claude Code session is working here, so it is not touched.')).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('No build folders to clear.')).toBeTruthy();
                for (_i = 0, _b = ['Quest two', 'Quest three', 'Quest four']; _i < _b.length; _i++) {
                    title = _b[_i];
                    (0, vitest_1.expect)(isDisabled(preact_1.screen.getByRole('checkbox', { name: title }))).toBe(true);
                }
                return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: 'Select every folder that can be cleared' }))];
            case 3:
                _c.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Free 2 MB from 1 folder' }))];
            case 4:
                _c.sent();
                (0, vitest_1.expect)(engine.freeFolderSpace).toHaveBeenCalledWith(KEY, ['/quests/one']);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('removes a folder only after Remove this folder confirms it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space(folder({ taskId: 'one', merged: true, removable: true }))];
                    }); }); }, removeTaskFolder: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, space()];
                    }); }); }) })];
            case 1:
                engine = _c.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Remove folder' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText(/Removing deletes the folder with its ignored files, \.env included\. The branch is kept/)).toBeTruthy();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Keep it' }))];
            case 4:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: 'Remove this folder' })).toBeNull();
                (0, vitest_1.expect)(engine.removeTaskFolder).not.toHaveBeenCalled();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Remove folder' }))];
            case 5:
                _c.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Remove this folder' }))];
            case 6:
                _c.sent();
                (0, vitest_1.expect)(engine.removeTaskFolder).toHaveBeenCalledWith(KEY, 'one');
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Removed the folder of Quest one. Its branch is kept.')];
            case 7:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('offers no removal for a merged folder with changes, and lists them collapsed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var changed, summary;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                changed = Array.from({ length: 102 }, function (_, n) { return ({ status: '??', path: "file-".concat(n, ".txt"), previous: null }); });
                return [4 /*yield*/, open({ readFolderSpace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, space(folder({ taskId: 'one', merged: true, changed: changed }), folder({ taskId: 'two', merged: true, changed: [{ status: ' M', path: 'a.ts', previous: null }] }))];
                        }); }); } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByText('Merged, but 102 uncommitted files keep this folder')];
            case 2:
                summary = _a.sent();
                (0, vitest_1.expect)(summary.closest('details').open).toBe(false);
                (0, vitest_1.expect)(preact_1.screen.getAllByText(/^\?\? file-/)).toHaveLength(100);
                (0, vitest_1.expect)(preact_1.screen.getByText('…and 2 more')).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('Merged, but 1 uncommitted file keeps this folder')).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: 'Remove folder' })).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('measures again only when asked, and closes from the header', function () { return __awaiter(void 0, void 0, void 0, function () {
    var close, engine, again;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                close = vitest_1.vi.fn();
                return [4 /*yield*/, open({ readFolderSpace: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, space(folder({ taskId: 'one' }))];
                        }); }); }) }, close)];
            case 1:
                engine = _a.sent();
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Measure again' })];
            case 2:
                again = _a.sent();
                (0, vitest_1.expect)(engine.readFolderSpace).toHaveBeenCalledTimes(1);
                return [4 /*yield*/, click(again)];
            case 3:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByText('Quest one')];
            case 4:
                _a.sent();
                (0, vitest_1.expect)(engine.readFolderSpace).toHaveBeenCalledTimes(2);
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Close' }))];
            case 5:
                _a.sent();
                (0, vitest_1.expect)(close).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
        }
    });
}); });
