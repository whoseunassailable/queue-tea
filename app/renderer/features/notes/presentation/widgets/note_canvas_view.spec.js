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
var app_1 = require("../../../../app/app");
var constants_1 = require("../../../../core/constants/constants");
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var workspace_store_1 = require("../../../workspace/state_management/workspace_store");
var KEY = 'a-000001';
var ok = function (data) { return ({ ok: true, data: data }); };
var c = en_1.t.notebook.canvas;
var NOTES = [(0, test_support_1.note)({ id: 'n-a', title: 'Alpha', folder: 'Ideas', body: 'The first idea,\n\nin two lines.' }), (0, test_support_1.note)({ id: 'n-b', title: 'Beta', folder: 'Ideas' })];
var card = function (id, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, type: 'file', file: 'n-a.md', x: 0, y: 0, width: 280, height: 160 }, over));
};
var BOARD = { nodes: [card('a'), card('b', { file: 'n-b.md', x: 400 })], edges: [{ id: 'ab', fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' }] };
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (canvas, over) {
        var engine, workspace;
        if (canvas === void 0) { canvas = BOARD; }
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    window.location.hash = '#/notes';
                    engine = (0, test_support_1.fakeEngine)(__assign({ readNotes: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok({ notes: NOTES, unreadable: [], folder: '/n' })];
                        }); }); }, readProject: function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok((0, test_support_1.projectView)(key, { ready: [{ kind: 'quest', quest: (0, test_support_1.quest)({ id: 't-1', title: 'Write the parser' }) }] }))];
                        }); }); }, readCanvas: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ok({ canvas: canvas, stamp: 'c-1' })];
                        }); }); }) }, over)).engine;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                        return [4 /*yield*/, workspace.start()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Alpha')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.open }))];
                        }); }); })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, engine];
            }
        });
    });
};
var board = function () { return preact_1.screen.findByRole('region', { name: /^Canvas: / }); };
var cardNamed = function (name) { return preact_1.screen.getByRole('group', { name: name }); };
// What the board saved last, once the autosave has run.
var saved = function (engine) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(engine.saveCanvas).toHaveBeenCalled(); }, { timeout: 2000 })];
            case 1:
                _a.sent();
                return [2 /*return*/, vitest_1.vi.mocked(engine.saveCanvas).mock.calls.at(-1)[1]];
        }
    });
}); };
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    vitest_1.vi.restoreAllMocks();
});
(0, vitest_1.describe)('the canvas', function () {
    (0, vitest_1.it)('opens from the list, shows its cards and lines, and a picked note goes back to the editor', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, board()];
                case 2:
                    _a.apply(void 0, [(_c.sent()).getAttribute('aria-label')]).toBe(c.board(2, 1));
                    (0, vitest_1.expect)((0, preact_1.within)(cardNamed(c.noteCard('Alpha'))).getByText('The first idea, in two lines.')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: c.line(c.noteCard('Alpha'), c.noteCard('Beta')) })).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: c.open }).getAttribute('aria-pressed')).toBe('true');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(cardNamed(c.noteCard('Beta'))).getByRole('button', { name: c.openNote('Beta') }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('region', { name: /^Canvas: / })).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says it is reading, then that a failed read went wrong, and reads again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer, readCanvas, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    answer = function () { };
                    readCanvas = vitest_1.vi.fn(function () { return new Promise(function (done) { return (answer = done); }); });
                    return [4 /*yield*/, open(BOARD, { readCanvas: readCanvas })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.reading).closest('[role="status"]')).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answer({ ok: false, error: { message: "Canvas.canvas isn't a canvas Queue-tea can read." } })];
                        }); }); })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain("Canvas.canvas isn't a canvas Queue-tea can read.");
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain }))];
                        }); }); })];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, answer(ok({ canvas: { nodes: [], edges: [] }, stamp: null }))];
                        }); }); })];
                case 5:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(c.empty)];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('adds a note or a quest in play from one list, and the quest card shows its live state', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, dialog, quest, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({ nodes: [], edges: [] })];
                case 1:
                    engine = _b.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.addCard }))];
                        }); }); })];
                case 3:
                    _b.sent();
                    dialog = preact_1.screen.getByRole('dialog', { name: c.addCardTitle });
                    preact_1.fireEvent.input((0, preact_1.within)(dialog).getByLabelText(c.find), { target: { value: 'pars' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(dialog).getByRole('button', { name: en_1.t.notebook.pickQuest('Write the parser', en_1.t.notebook.questStateSaid.waiting) }))];
                        }); }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.addCard }))];
                        }); }); })];
                case 5:
                    _b.sent();
                    preact_1.fireEvent.input((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByLabelText(c.find), { target: { value: 'nothing like it' } });
                    (0, vitest_1.expect)((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByText(c.noMatch('nothing like it'))).toBeTruthy();
                    preact_1.fireEvent.input((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByLabelText(c.find), { target: { value: 'alp' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.submit((0, preact_1.within)(preact_1.screen.getByRole('dialog')).getByLabelText(c.find).closest('form'))];
                        }); }); })];
                case 6:
                    _b.sent();
                    quest = cardNamed(c.questCard('Write the parser'));
                    (0, vitest_1.expect)((0, preact_1.within)(quest).getByText(en_1.t.notebook.questState.waiting)).toBeTruthy();
                    (0, vitest_1.expect)(cardNamed(c.noteCard('Alpha'))).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 7:
                    _a.apply(void 0, [(_b.sent()).nodes.map(function (_a) {
                            var type = _a.type, text = _a.text, file = _a.file;
                            return ({ type: type, text: text, file: file });
                        })]).toEqual([
                        { type: 'text', text: '[[quest:t-1|Write the parser]]', file: undefined },
                        { type: 'file', text: undefined, file: 'n-a.md' },
                    ]);
                    (0, vitest_1.expect)(vitest_1.vi.mocked(engine.saveCanvas).mock.calls.at(-1)[2]).toBe('c-1');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks a web link under its field on blur and on Add, then adds it as a link card', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, dialog, field, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open({ nodes: [], edges: [] })];
                case 1:
                    engine = _c.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.addLink }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    dialog = preact_1.screen.getByRole('dialog', { name: c.addLinkTitle });
                    field = (0, preact_1.within)(dialog).getByLabelText("".concat(c.webLink, " *"));
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(dialog).getByRole('button', { name: c.add }))];
                        }); }); })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(c.linkRequired)).toBeTruthy();
                    preact_1.fireEvent.input(field, { target: { value: 'example.com' } });
                    preact_1.fireEvent.blur(field);
                    (0, vitest_1.expect)((0, preact_1.within)(dialog).getByText(c.linkBad)).toBeTruthy();
                    preact_1.fireEvent.input(field, { target: { value: ' https://example.com/post ' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(dialog).getByRole('button', { name: c.add }))];
                        }); }); })];
                case 5:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(cardNamed(c.linkCard('example.com'))).findByText('Example page')];
                case 6:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 7:
                    _b.apply(void 0, [(_c.sent()).nodes[0]]).toMatchObject({ type: 'link', url: 'https://example.com/post' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves, resizes and removes a card from the keyboard, and its lines go with it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, alpha, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = _c.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _c.sent();
                    alpha = cardNamed(c.noteCard('Alpha'));
                    alpha.focus();
                    preact_1.fireEvent.keyDown(alpha, { key: 'ArrowRight' });
                    preact_1.fireEvent.keyDown(alpha, { key: 'ArrowDown', shiftKey: true });
                    preact_1.fireEvent.keyDown(alpha, { key: 'ArrowRight', altKey: true });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 3:
                    _a.apply(void 0, [(_c.sent()).nodes[0]]).toMatchObject({ x: constants_1.CANVAS_STEP_PX, y: 4 * constants_1.CANVAS_STEP_PX, width: 280 + constants_1.CANVAS_STEP_PX, height: 160 });
                    vitest_1.vi.mocked(engine.saveCanvas).mockClear();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Delete' })];
                        }); }); })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.removed(c.noteCard('Alpha')))).toBeTruthy();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toEqual({ nodes: [BOARD.nodes[1]], edges: [] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('drags a card by the mouse and saves once it is let go', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, beta, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open()];
                case 1:
                    engine = _b.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _b.sent();
                    beta = cardNamed(c.noteCard('Beta'));
                    preact_1.fireEvent.mouseDown((0, preact_1.within)(beta).getByText('Ideas'), { button: 0, clientX: 10, clientY: 10 });
                    preact_1.fireEvent.mouseMove(window, { clientX: 60, clientY: 40 });
                    (0, vitest_1.expect)(beta.style.left).toBe('450px');
                    (0, vitest_1.expect)(engine.saveCanvas).not.toHaveBeenCalled();
                    preact_1.fireEvent.mouseUp(window, { clientX: 60, clientY: 40 });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 3:
                    _a.apply(void 0, [(_b.sent()).nodes[1]]).toMatchObject({ x: 450, y: 30 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('connects two cards with Connect, refuses a second line between them, and a focused line goes with Delete', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, open({ nodes: BOARD.nodes, edges: [] })];
                case 1:
                    engine = _c.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.connectLabel(c.noteCard('Alpha')) }))];
                        }); }); })];
                case 3:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.connecting(c.noteCard('Alpha')))).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Beta')), { key: 'Enter' })];
                        }); }); })];
                case 4:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.connected(c.noteCard('Alpha'), c.noteCard('Beta')))).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 5:
                    _a.apply(void 0, [(_c.sent()).edges]).toEqual([vitest_1.expect.objectContaining({ fromNode: 'a', fromSide: 'right', toNode: 'b', toSide: 'left' })]);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.connectLabel(c.noteCard('Beta')) }))];
                        }); }); })];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Enter' })];
                        }); }); })];
                case 7:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.notConnected)).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.connectLabel(c.noteCard('Beta')) }))];
                        }); }); })];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(preact_1.screen.getByRole('region', { name: /^Canvas: / }), { key: 'Escape' })];
                        }); }); })];
                case 9:
                    _c.sent();
                    (0, vitest_1.expect)(preact_1.screen.queryByText(c.connecting(c.noteCard('Beta')))).toBeNull();
                    vitest_1.vi.mocked(engine.saveCanvas).mockClear();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(preact_1.screen.getByRole('button', { name: c.line(c.noteCard('Alpha'), c.noteCard('Beta')) }), { key: 'Delete' })];
                        }); }); })];
                case 10:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, saved(engine)];
                case 11:
                    _b.apply(void 0, [(_c.sent()).edges]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows quests, files, text, groups and missing notes as they are', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, open({
                        nodes: [
                            card('g', { type: 'group', label: 'Week 1', file: undefined }),
                            card('q', { type: 'text', text: '[[quest:t-0dd|Old quest]]', file: undefined }),
                            card('m', { file: 'n-gone.md' }),
                            card('x', { type: 'text', text: 'Just a thought', file: undefined }),
                            card('i', { file: 'attachments/ab.png' }),
                            card('o', { file: 'Projects/plan.md' }),
                        ],
                        edges: [],
                    })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)((0, preact_1.within)(cardNamed(c.groupCard('Week 1'))).getByText('Week 1')).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(cardNamed(c.questCard('Old quest'))).getByText(en_1.t.notebook.questState.gone)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(cardNamed(c.missingCard)).getByText(c.missingNote)).toBeTruthy();
                    (0, vitest_1.expect)((0, preact_1.within)(cardNamed(c.textCard)).getByText('Just a thought')).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, preact_1.within)(cardNamed(c.fileCard('ab.png'))).findByRole('img', { name: 'ab.png' })];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText(c.otherCard('Projects/plan.md'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('asks which board to keep when the file changed outside, and each choice does what it says', function () { return __awaiter(void 0, void 0, void 0, function () {
        var theirs, saveCanvas, _a, loadTheirs;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    theirs = { canvas: { nodes: [card('z', { file: 'n-b.md' })], edges: [] }, stamp: 'c-theirs' };
                    saveCanvas = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'changed', view: theirs })];
                    }); }); });
                    return [4 /*yield*/, open(BOARD, { saveCanvas: saveCanvas })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'ArrowLeft' })];
                        }); }); })];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert', {}, { timeout: 2000 })];
                case 4:
                    _a.apply(void 0, [(_b.sent()).textContent]).toContain(c.changedTitle);
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.notSavedChanged)).toBeTruthy();
                    saveCanvas.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'saved', stamp: 'c-3' })];
                    }); }); });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.keepMine }))];
                        }); }); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(saveCanvas.mock.calls.at(-1)).toEqual([KEY, vitest_1.expect.objectContaining({ nodes: [vitest_1.expect.objectContaining({ id: 'a', x: -constants_1.CANVAS_STEP_PX }), BOARD.nodes[1]] }), 'c-theirs']);
                    (0, vitest_1.expect)(preact_1.screen.queryByText(c.changedTitle)).toBeNull();
                    saveCanvas.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'changed', view: theirs })];
                    }); }); });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'ArrowLeft' })];
                        }); }); })];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, preact_1.screen.findByRole('button', { name: en_1.t.notebook.loadTheirs }, { timeout: 2000 })];
                case 7:
                    loadTheirs = _b.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(loadTheirs)];
                        }); }); })];
                case 8:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('region', { name: c.board(1, 0) })).toBeTruthy();
                    (0, vitest_1.expect)(cardNamed(c.noteCard('Beta'))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a board that could not be saved when a note is opened, and saves it on coming back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var saveCanvas, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    saveCanvas = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: "Couldn't save the canvas. Your board is still here. Try again." } })];
                    }); }); });
                    return [4 /*yield*/, open(BOARD, { saveCanvas: saveCanvas })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, board()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(cardNamed(c.noteCard('Alpha')), { key: 'Delete' })];
                        }); }); })];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(/Couldn't save the canvas/, {}, { timeout: 2000 })];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click((0, preact_1.within)(preact_1.screen.getByRole('navigation', { name: en_1.t.notebook.title })).getByRole('button', { name: /^Beta/ }))];
                        }); }); })];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, preact_1.screen.findByDisplayValue('Beta')];
                case 6:
                    _c.sent();
                    saveCanvas.mockImplementation(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ok({ kind: 'saved', stamp: 'c-2' })];
                    }); }); });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: c.open }))];
                        }); }); })];
                case 7:
                    _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, board()];
                case 8:
                    _b.apply(void 0, [(_c.sent()).getAttribute('aria-label')]).toBe(c.board(1, 0));
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(saveCanvas.mock.calls.at(-1)).toEqual([KEY, { nodes: [BOARD.nodes[1]], edges: [] }, 'c-1']); }, { timeout: 2000 })];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
