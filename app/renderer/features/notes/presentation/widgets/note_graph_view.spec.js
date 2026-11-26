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
var notes_1 = require("../../../../../shared/notes");
var test_support_1 = require("../../../../test_support");
var note_graph_1 = require("../../domain/note_graph");
var note_graph_draw_1 = require("./note_graph_draw");
var note_graph_view_1 = require("./note_graph_view");
// Drawing is recorded, not done: a test reads the pan and zoom from the last frame.
vitest_1.vi.mock('./note_graph_draw', function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = [{}];
            return [4 /*yield*/, vitest_1.vi.importActual('./note_graph_draw')];
        case 1: return [2 /*return*/, (__assign.apply(void 0, [__assign.apply(void 0, _a.concat([(_b.sent())])), { drawGraph: vitest_1.vi.fn() }]))];
    }
}); }); });
// jsdom's canvas has no 2D context, so the view skips drawing. Every element
// measures 800 × 600, so a fitted view puts the middle of the points at (400, 300).
(0, vitest_1.beforeEach)(function () {
    vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    vitest_1.vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, x: 0, y: 0, width: 800, height: 600, right: 800, bottom: 600, toJSON: function () { } });
});
(0, vitest_1.afterEach)(function () {
    (0, preact_1.cleanup)();
    vitest_1.vi.useRealTimers();
    vitest_1.vi.restoreAllMocks();
});
var A = 'n-00000001';
var B = 'n-00000002';
var C = 'n-00000003';
var D = 'n-00000004';
// A layout the test finishes or fails itself, or that finishes at once with
// place's points when place is given.
var fakeRun = function (place) {
    var runs = [];
    var run = vitest_1.vi.fn(function (input, onProgress) {
        var finish;
        var fail;
        var done = new Promise(function (resolve, reject) {
            finish = resolve;
            fail = reject;
        });
        var cancel = vitest_1.vi.fn();
        runs.push({ input: input, onProgress: onProgress, finish: finish, fail: fail, cancel: cancel });
        if (place !== undefined)
            finish(place(input));
        return { done: done, cancel: cancel };
    });
    return { run: run, runs: runs };
};
// Lets every promise callback waiting on a settled run go first.
var settle = function () { return (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
        case 1: return [2 /*return*/, void (_a.sent())];
    }
}); }); }); };
// Puts target at (0, 0) and up to four others at the compass points around it,
// so with two or four others the fitted view shows target at (400, 300).
var aimedAt = function (target, ids) {
    var spots = [{ x: 100, y: 0 }, { x: -100, y: 0 }, { x: 0, y: 100 }, { x: 0, y: -100 }];
    return new Map(__spreadArray([[target, { x: 0, y: 0 }]], ids.filter(function (id) { return id !== target; }).map(function (id, i) { return [id, spots[i]]; }), true));
};
var line = function (title, state) { return ({ title: title, state: state, priority: 'mid', difficulty: 'medium' }); };
var propsOf = function (over) { return (__assign({ engine: (0, test_support_1.fakeEngine)().engine, quests: new Map(), settings: note_graph_view_1.GRAPH_START, onSettings: vitest_1.vi.fn(), kept: { current: (0, note_graph_view_1.keptStart)() }, run: fakeRun().run, onOpenNote: vitest_1.vi.fn(), onOpenQuest: vitest_1.vi.fn(), onLeave: vitest_1.vi.fn() }, over)); };
var realm = __assign(__assign({}, note_graph_view_1.GRAPH_START), { scope: 'realm' });
var graphArea = function () { return preact_1.screen.getByRole('group', { name: /^Graph (around|of the whole realm)/ }); };
var statusLines = function () { return preact_1.screen.queryAllByRole('status').map(function (status) { return status.textContent; }); };
var press = function (x, y, upX, upY) {
    if (upX === void 0) { upX = x; }
    if (upY === void 0) { upY = y; }
    var area = graphArea();
    preact_1.fireEvent.mouseDown(area, { clientX: x, clientY: y, button: 0 });
    if (upX !== x || upY !== y)
        preact_1.fireEvent.mouseMove(area, { clientX: upX, clientY: upY, buttons: 1 });
    preact_1.fireEvent.mouseUp(area, { clientX: upX, clientY: upY, button: 0 });
};
(0, vitest_1.it)('shows the spinner and progress while laying out, after 150 ms', function () {
    vitest_1.vi.useFakeTimers();
    var _a = fakeRun(), run = _a.run, runs = _a.runs;
    var open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' });
    var container = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), run: run })}/>).container;
    (0, preact_1.act)(function () { return void vitest_1.vi.advanceTimersByTime(100); });
    (0, vitest_1.expect)(preact_1.screen.queryByText(/Laying out/)).toBeNull();
    (0, vitest_1.expect)(container.querySelector('.spinner')).toBeNull();
    (0, preact_1.act)(function () { return void vitest_1.vi.advanceTimersByTime(50); });
    (0, vitest_1.expect)(preact_1.screen.getByText('Laying out 3 notes…')).toBeTruthy();
    (0, vitest_1.expect)(container.querySelector('.spinner')).not.toBeNull();
    (0, preact_1.act)(function () { return runs[0].onProgress(0.5); });
    (0, vitest_1.expect)(preact_1.screen.getByText('50% done')).toBeTruthy();
});
(0, vitest_1.it)('says a note with no links stands alone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Lonely idea' });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Elsewhere' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Nothing links to or from this note yet.')).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('Type [[ in Write to link a note or a quest.')).toBeTruthy();
                (0, vitest_1.expect)(graphArea().getAttribute('aria-label')).toBe('Graph around Lonely idea: 0 notes and 0 quests within 2 steps');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('whole realm with no links shows every note and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, _a, run, runs;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Alpha' });
                _a = fakeRun(function (input) { return aimedAt(A, input.ids); }), run = _a.run, runs = _a.runs;
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' }), (0, test_support_1.note)({ id: C, title: 'Cello' })], open: open, settings: realm, run: run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                (0, vitest_1.expect)(__spreadArray([], runs[0].input.ids, true).sort()).toEqual([A, B, C]);
                (0, vitest_1.expect)(graphArea().getAttribute('aria-label')).toBe('Graph of the whole realm: 3 notes and 0 quests');
                (0, vitest_1.expect)(preact_1.screen.getByText('No notes in this realm link to each other yet.')).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('offers Show everything when the filters hide everything', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, settings, props;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' });
                settings = __assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: { hiddenTypes: new Set(__spreadArray(__spreadArray([], notes_1.NOTE_TYPES, true), ['none'], false)), quests: false, doneQuests: true } });
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta', type: 'idea' })], open: open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), settings: settings, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Nothing matches these filters.')).toBeTruthy();
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Show everything' }));
                (0, vitest_1.expect)(props.onSettings).toHaveBeenCalledWith(__assign(__assign({}, settings), { filter: note_graph_1.SHOW_ALL }));
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows the failure and lays out again on Try again', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, _a, run, runs, props, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                error = new Error('boom');
                runs[0].fail(error);
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText("Couldn't draw the graph. Something went wrong while placing the notes. Try again, or switch to Around this note.")).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.queryByText(/boom/)).toBeNull();
                (0, vitest_1.expect)(props.engine.log).toHaveBeenCalledWith('error', vitest_1.expect.stringContaining(error.stack));
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Try again' }));
                (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('clicking opens notes and quests in play, and nothing else', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, quests, pressOn, onNote, onActive, _i, _a, target, props, dragged;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] [[quest:t-1a2b|Parser]] [[quest:t-3c4d|Ship]] [[quest:t-5e6f|Old]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                quests = new Map([['t-1a2b', line('Write the parser', 'active')], ['t-3c4d', line('Ship it', 'done')]]);
                pressOn = function (target_1) {
                    var args_1 = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args_1[_i - 1] = arguments[_i];
                    }
                    return __awaiter(void 0, __spreadArray([target_1], args_1, true), void 0, function (target, upX) {
                        var props;
                        if (upX === void 0) { upX = 400; }
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, preact_1.cleanup)();
                                    props = propsOf({ notes: notes, open: open, quests: quests, run: fakeRun(function (input) { return aimedAt(target, input.ids); }).run });
                                    (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                                    return [4 /*yield*/, settle()];
                                case 1:
                                    _a.sent();
                                    press(400, 300, upX, 300);
                                    return [2 /*return*/, props];
                            }
                        });
                    });
                };
                return [4 /*yield*/, pressOn(B)];
            case 1:
                onNote = _b.sent();
                (0, vitest_1.expect)(onNote.onOpenNote).toHaveBeenCalledWith(B);
                (0, vitest_1.expect)(onNote.onOpenQuest).not.toHaveBeenCalled();
                return [4 /*yield*/, pressOn((0, note_graph_1.questNodeId)('t-1a2b'))];
            case 2:
                onActive = _b.sent();
                (0, vitest_1.expect)(onActive.onOpenQuest).toHaveBeenCalledWith('t-1a2b');
                (0, vitest_1.expect)(onActive.onOpenNote).not.toHaveBeenCalled();
                _i = 0, _a = [(0, note_graph_1.questNodeId)('t-3c4d'), (0, note_graph_1.questNodeId)('t-5e6f')];
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                target = _a[_i];
                return [4 /*yield*/, pressOn(target)];
            case 4:
                props = _b.sent();
                (0, vitest_1.expect)(props.onOpenNote).not.toHaveBeenCalled();
                (0, vitest_1.expect)(props.onOpenQuest).not.toHaveBeenCalled();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, pressOn(B, 404)];
            case 7:
                dragged = _b.sent();
                (0, vitest_1.expect)(dragged.onOpenNote).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a drag pans the graph, and Fit puts it back', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, points, props;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' });
                points = new Map([[B, { x: 0, y: 0 }], [A, { x: -100, y: -100 }], [C, { x: 100, y: 100 }]]);
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' }), (0, test_support_1.note)({ id: C, title: 'Cello' })], open: open, run: fakeRun(function () { return points; }).run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                return [4 /*yield*/, settle()
                    // (600, 100) is background, far from the line the three points sit on.
                ];
            case 1:
                _a.sent();
                // (600, 100) is background, far from the line the three points sit on.
                press(600, 100, 650, 100);
                press(400, 300);
                (0, vitest_1.expect)(props.onOpenNote).not.toHaveBeenCalled();
                press(450, 300);
                (0, vitest_1.expect)(props.onOpenNote).toHaveBeenCalledWith(B);
                vitest_1.vi.mocked(props.onOpenNote).mockClear();
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Fit' }));
                press(400, 300);
                (0, vitest_1.expect)(props.onOpenNote).toHaveBeenCalledWith(B);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('arrow keys move between nodes, Enter opens, Esc leaves', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, points, props, area;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' });
                points = new Map([[A, { x: 0, y: 0 }], [B, { x: 100, y: 0 }], [C, { x: -100, y: 0 }]]);
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' }), (0, test_support_1.note)({ id: C, title: 'Cello' })], open: open, run: fakeRun(function () { return points; }).run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                area = graphArea();
                (0, preact_1.act)(function () { return area.focus(); });
                (0, vitest_1.expect)(statusLines()).toContain('Gait sensor, note, 2 links');
                preact_1.fireEvent.keyDown(area, { key: 'ArrowRight' });
                (0, vitest_1.expect)(statusLines()).toContain('Beta, note, 1 link');
                preact_1.fireEvent.keyDown(area, { key: 'Enter' });
                (0, vitest_1.expect)(props.onOpenNote).toHaveBeenCalledWith(B);
                preact_1.fireEvent.keyDown(area, { key: 'ArrowLeft' });
                (0, vitest_1.expect)(statusLines()).toContain('Gait sensor, note, 2 links');
                preact_1.fireEvent.keyDown(area, { key: 'Escape' });
                (0, vitest_1.expect)(props.onLeave).toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('the summary names the scope and its counts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, props, rerender;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] and [[quest:t-1a2b|Parser]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta', body: '[[Cello]]' }), (0, test_support_1.note)({ id: C, title: 'Cello', type: 'bug', body: '[[Delta]]' }), (0, test_support_1.note)({ id: D, title: 'Delta' })];
                props = propsOf({ notes: notes, open: open, quests: new Map([['t-1a2b', line('Write the parser', 'active')]]), run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(graphArea().getAttribute('aria-label')).toBe('Graph around Gait sensor: 2 notes and 1 quest within 2 steps');
                rerender(<note_graph_view_1.NoteGraphView {...props} settings={__assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: __assign(__assign({}, note_graph_1.SHOW_ALL), { hiddenTypes: new Set(['bug']) }) })}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(graphArea().getAttribute('aria-label')).toBe('Graph around Gait sensor: 1 note and 1 quest within 2 steps');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('the map says it is busy while the layout runs, and not once it is done', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, _a, run, runs;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: run })}/>);
                (0, vitest_1.expect)(graphArea().getAttribute('aria-busy')).toBe('true');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, runs[0].finish(aimedAt(A, runs[0].input.ids))];
                    }); }); })];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, vitest_1.expect)(graphArea().getAttribute('aria-busy')).toBe('false');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('the scope, steps and filter controls hand the parent the whole next settings', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, props, rerender, pressed, filter, _i, _a, name_1, pick;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                pressed = function (name) { return preact_1.screen.getByRole('button', { name: name }).getAttribute('aria-pressed'); };
                (0, vitest_1.expect)([pressed('Around this note'), pressed('Whole realm'), pressed('1 step'), pressed('2 steps')]).toEqual(['true', 'false', 'false', 'true']);
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Whole realm' }));
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith({ scope: 'realm', steps: 2, filter: note_graph_1.SHOW_ALL });
                preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: '1 step' }));
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith({ scope: 'around', steps: 1, filter: note_graph_1.SHOW_ALL });
                filter = preact_1.screen.getByRole('button', { name: 'Filter' });
                (0, vitest_1.expect)([filter.getAttribute('aria-haspopup'), filter.getAttribute('aria-expanded')]).toEqual(['menu', 'false']);
                preact_1.fireEvent.click(filter);
                (0, vitest_1.expect)(filter.getAttribute('aria-expanded')).toBe('true');
                (0, vitest_1.expect)(preact_1.screen.getByRole('menu')).toBeTruthy();
                for (_i = 0, _a = ['Idea', 'Feature', 'Bug', 'Meeting', 'Research', 'Decision', 'Daily', 'No type', 'Quests', 'Done quests']; _i < _a.length; _i++) {
                    name_1 = _a[_i];
                    (0, vitest_1.expect)(preact_1.screen.getByRole('menuitemcheckbox', { name: name_1 }).getAttribute('aria-checked')).toBe('true');
                }
                pick = function (name) {
                    if (preact_1.screen.queryByRole('menu') === null)
                        preact_1.fireEvent.click(filter);
                    preact_1.fireEvent.click(preact_1.screen.getByRole('menuitemcheckbox', { name: name }));
                };
                pick('Meeting');
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith(__assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: __assign(__assign({}, note_graph_1.SHOW_ALL), { hiddenTypes: new Set(['meeting']) }) }));
                pick('No type');
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith(__assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: __assign(__assign({}, note_graph_1.SHOW_ALL), { hiddenTypes: new Set(['none']) }) }));
                pick('Quests');
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith(__assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: __assign(__assign({}, note_graph_1.SHOW_ALL), { quests: false }) }));
                pick('Done quests');
                (0, vitest_1.expect)(props.onSettings).toHaveBeenLastCalledWith(__assign(__assign({}, note_graph_view_1.GRAPH_START), { filter: __assign(__assign({}, note_graph_1.SHOW_ALL), { doneQuests: false }) }));
                rerender(<note_graph_view_1.NoteGraphView {...props} settings={realm}/>);
                (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: '1 step' })).toBeNull();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: '2 steps' })).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("keeps the whole realm's points, and lays out again from them when notes change", function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, _a, run, runs, props, rerender, points;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                _a = fakeRun(), run = _a.run, runs = _a.runs;
                props = propsOf({ notes: notes, open: open, settings: realm, run: run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                (0, vitest_1.expect)(runs[0].input.centre).toBeNull();
                (0, vitest_1.expect)(runs[0].input.start).toEqual(new Map());
                points = new Map([[A, { x: -30, y: 0 }], [B, { x: 30, y: 0 }]]);
                runs[0].finish(points);
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                (0, vitest_1.expect)(props.kept.current.points).toEqual(points);
                (0, vitest_1.expect)(props.kept.current.input).toBe(runs[0].input);
                rerender(<note_graph_view_1.NoteGraphView {...props} notes={__spreadArray(__spreadArray([], notes, true), [(0, test_support_1.note)({ id: C, title: 'Cello' })], false)}/>);
                (0, vitest_1.expect)(run).toHaveBeenCalledTimes(2);
                (0, vitest_1.expect)(runs[1].input.centre).toBeNull();
                (0, vitest_1.expect)(runs[1].input.ids).toContain(C);
                (0, vitest_1.expect)(runs[1].input.start).toEqual(points);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("opening another note on the whole realm doesn't lay out again", function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, run, props, rerender;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                run = fakeRun(function (input) { return aimedAt(A, input.ids); }).run;
                props = propsOf({ notes: notes, open: open, settings: realm, run: run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                rerender(<note_graph_view_1.NoteGraphView {...props} open={notes[1]}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(run).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("the open note's unsaved links count", function () {
    var saved = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '' });
    var _a = fakeRun(), run = _a.run, runs = _a.runs;
    (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [saved, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: __assign(__assign({}, saved), { body: 'See [[Beta]]' }), run: run })}/>);
    (0, vitest_1.expect)(runs[0].input.edges).toEqual([{ a: A, b: B }]);
    (0, vitest_1.expect)(runs[0].input.centre).toBe(A);
    (0, vitest_1.expect)(runs[0].input.start.size).toBe(0);
});
// jsdom has no canvas context, so a fake one lets the (mocked) drawing run and record its frames.
var lastView = function () { return vitest_1.vi.mocked(note_graph_draw_1.drawGraph).mock.calls.at(-1)[1].view; };
(0, vitest_1.it)("opening another note on the whole realm in a new mount keeps the map, its pan and zoom, and doesn't lay out again", function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, kept, first, fitted, panned, second;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                kept = { current: (0, note_graph_view_1.keptStart)() };
                first = fakeRun(function (input) { return aimedAt(A, input.ids); });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: open, settings: realm, kept: kept, run: first.run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                fitted = lastView();
                // (600, 100) is background, so this drag pans the map.
                press(600, 100, 650, 100);
                panned = lastView();
                (0, vitest_1.expect)(panned).toEqual(__assign(__assign({}, fitted), { x: fitted.x + 50 }));
                (0, preact_1.cleanup)();
                second = fakeRun(function (input) { return aimedAt(A, input.ids); });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: notes[1], settings: realm, kept: kept, run: second.run })}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(second.run).not.toHaveBeenCalled();
                (0, vitest_1.expect)(lastView()).toEqual(panned);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a note opened from the map takes the focus on the next mount, and one picked from the list does not', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, kept, mount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                kept = { current: (0, note_graph_view_1.keptStart)() };
                mount = function (shown) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: shown, settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                                return [4 /*yield*/, settle()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, mount(open)];
            case 1:
                _a.sent();
                (0, preact_1.act)(function () { return graphArea().focus(); });
                preact_1.fireEvent.keyDown(graphArea(), { key: 'ArrowRight' });
                preact_1.fireEvent.keyDown(graphArea(), { key: 'Enter' });
                (0, vitest_1.expect)(kept.current.isFocused).toBe(true);
                (0, preact_1.cleanup)();
                (0, vitest_1.expect)(document.activeElement).toBe(document.body);
                return [4 /*yield*/, mount(notes[1])];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(document.activeElement).toBe(graphArea());
                (0, vitest_1.expect)(kept.current.isFocused).toBe(false);
                // A pick from the list leaves isFocused false, so the next mount keeps the focus where it was.
                (0, preact_1.cleanup)();
                return [4 /*yield*/, mount(open)];
            case 3:
                _a.sent();
                (0, vitest_1.expect)(document.activeElement).not.toBe(graphArea());
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("a whole realm mount that was still laying out leaves nothing fitted behind, so the next mount fits the map", function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, fitted, kept;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                // What a first mount with nothing kept draws once its layout finishes.
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: open, settings: realm, kept: { current: (0, note_graph_view_1.keptStart)() }, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                fitted = lastView();
                (0, preact_1.cleanup)();
                kept = { current: (0, note_graph_view_1.keptStart)() };
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: open, settings: realm, kept: kept, run: fakeRun().run })}/>);
                (0, preact_1.cleanup)();
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: notes[1], settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(fitted).not.toEqual({ zoom: 1, x: 0, y: 0 });
                (0, vitest_1.expect)(lastView()).toEqual(fitted);
                return [2 /*return*/];
        }
    });
}); });
// The drawn frames, read after the fact.
var lastFrame = function () { return vitest_1.vi.mocked(note_graph_draw_1.drawGraph).mock.calls.at(-1)[1]; };
(0, vitest_1.it)('a press on the background leaves no node lit and the status line empty', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                press(600, 100);
                (0, vitest_1.expect)(document.activeElement).toBe(graphArea());
                (0, vitest_1.expect)(lastFrame().hot).toBeNull();
                (0, vitest_1.expect)(statusLines().every(function (text) { return text === ''; })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a note opened by a click on the map remounts with no node lit', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, kept, props;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]] [[Cello]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' }), (0, test_support_1.note)({ id: C, title: 'Cello' })];
                kept = { current: (0, note_graph_view_1.keptStart)() };
                props = propsOf({ notes: notes, open: open, settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(B, input.ids); }).run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                press(400, 300);
                (0, vitest_1.expect)(props.onOpenNote).toHaveBeenCalledWith(B);
                (0, preact_1.cleanup)();
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: notes[1], settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(B, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(document.activeElement).toBe(graphArea());
                (0, vitest_1.expect)(lastFrame().hot).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('tabbing into the map lights the open note, and so does the remount after Enter opened a note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, notes, kept, mount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                notes = [open, (0, test_support_1.note)({ id: B, title: 'Beta' })];
                kept = { current: (0, note_graph_view_1.keptStart)() };
                mount = function (shown) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: notes, open: shown, settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                                return [4 /*yield*/, settle()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, mount(open)];
            case 1:
                _a.sent();
                (0, preact_1.act)(function () { return graphArea().focus(); });
                (0, vitest_1.expect)(lastFrame().hot).toBe(A);
                preact_1.fireEvent.keyDown(graphArea(), { key: 'ArrowRight' });
                preact_1.fireEvent.keyDown(graphArea(), { key: 'Enter' });
                (0, preact_1.cleanup)();
                return [4 /*yield*/, mount(notes[1])];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(lastFrame().hot).toBe(B);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('tabbing back into the map after pressing it twice lights the open note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()
                    // (600, 100) is background; the second press comes while the map already has the focus.
                ];
            case 1:
                _a.sent();
                // (600, 100) is background; the second press comes while the map already has the focus.
                press(600, 100);
                press(600, 100);
                (0, preact_1.act)(function () { return graphArea().blur(); });
                (0, preact_1.act)(function () { return graphArea().focus(); });
                (0, vitest_1.expect)(lastFrame().hot).toBe(A);
                (0, vitest_1.expect)(statusLines()).toContain('Gait sensor, note, 1 link');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a layout that throws while starting shows the failure instead of throwing', function () {
    var open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
    var props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: vitest_1.vi.fn(function () { throw new Error('no worker'); }) });
    (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
});
(0, vitest_1.it)('the same note with equal content keeps the same graph', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, props, rerender, before;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                before = lastFrame().graph;
                rerender(<note_graph_view_1.NoteGraphView {...props} open={__assign({}, open)}/>);
                (0, vitest_1.expect)(lastFrame().graph).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("the same realm's notes in another order don't lay it out again", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, a, b, c, run, props, rerender;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = [(0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' }), (0, test_support_1.note)({ id: B, title: 'Beta', body: '[[Cello]]' }), (0, test_support_1.note)({ id: C, title: 'Cello' })], a = _a[0], b = _a[1], c = _a[2];
                run = fakeRun(function (input) { return aimedAt(A, input.ids); }).run;
                props = propsOf({ notes: [a, b, c], open: a, settings: realm, run: run });
                rerender = (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>).rerender;
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                rerender(<note_graph_view_1.NoteGraphView {...props} notes={[c, b, a]}/>);
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, vitest_1.expect)(run).toHaveBeenCalledTimes(1);
                return [2 /*return*/];
        }
    });
}); });
var hoverOn = function (target, questId, quests) { return __awaiter(void 0, void 0, void 0, function () {
    var open;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, preact_1.cleanup)();
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: "[[Beta]] [[quest:".concat(questId, "|Q]]") });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, quests: quests, run: fakeRun(function (input) { return aimedAt(target, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                preact_1.fireEvent.mouseMove(graphArea(), { clientX: 400, clientY: 300 });
                return [2 /*return*/, graphArea().classList.contains('is-over-node')];
        }
    });
}); };
(0, vitest_1.it)("the pointer cursor shows over a note a click opens, and not over done quests, missing quests or the open note", function () { return __awaiter(void 0, void 0, void 0, function () {
    var quests, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                quests = new Map([['t-3c4d', line('Ship it', 'done')]]);
                _a = vitest_1.expect;
                return [4 /*yield*/, hoverOn(B, 't-3c4d', quests)];
            case 1:
                _a.apply(void 0, [_e.sent()]).toBe(true);
                _b = vitest_1.expect;
                return [4 /*yield*/, hoverOn((0, note_graph_1.questNodeId)('t-3c4d'), 't-3c4d', quests)];
            case 2:
                _b.apply(void 0, [_e.sent()]).toBe(false);
                _c = vitest_1.expect;
                return [4 /*yield*/, hoverOn((0, note_graph_1.questNodeId)('t-5e6f'), 't-5e6f', quests)];
            case 3:
                _c.apply(void 0, [_e.sent()]).toBe(false);
                _d = vitest_1.expect;
                return [4 /*yield*/, hoverOn(A, 't-3c4d', quests)];
            case 4:
                _d.apply(void 0, [_e.sent()]).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('Esc on the map leaves without reaching listeners further up', function () { return __awaiter(void 0, void 0, void 0, function () {
    var open, props, heard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                props = propsOf({ notes: [open, (0, test_support_1.note)({ id: B, title: 'Beta' })], open: open, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...props}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _a.sent();
                heard = vitest_1.vi.fn();
                window.addEventListener('keydown', heard);
                preact_1.fireEvent.keyDown(graphArea(), { key: 'Escape' });
                window.removeEventListener('keydown', heard);
                (0, vitest_1.expect)(props.onLeave).toHaveBeenCalled();
                (0, vitest_1.expect)(heard).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('a whole realm remount after a line changed lays out from the kept points, shows them meanwhile, and keeps the pan and zoom', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, b, c, open, kept, panned, keptPoints, second, moved;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vitest_1.vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({});
                _a = [(0, test_support_1.note)({ id: B, title: 'Beta' }), (0, test_support_1.note)({ id: C, title: 'Cello' })], b = _a[0], c = _a[1];
                open = (0, test_support_1.note)({ id: A, title: 'Gait sensor', body: '[[Beta]]' });
                kept = { current: (0, note_graph_view_1.keptStart)() };
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [open, b, c], open: open, settings: realm, kept: kept, run: fakeRun(function (input) { return aimedAt(A, input.ids); }).run })}/>);
                return [4 /*yield*/, settle()];
            case 1:
                _b.sent();
                press(600, 100, 650, 100);
                panned = lastView();
                keptPoints = kept.current.points;
                (0, preact_1.cleanup)();
                second = fakeRun();
                moved = __assign(__assign({}, open), { body: '[[Cello]]' });
                (0, preact_1.render)(<note_graph_view_1.NoteGraphView {...propsOf({ notes: [moved, b, c], open: moved, settings: realm, kept: kept, run: second.run })}/>);
                (0, vitest_1.expect)(second.runs).toHaveLength(1);
                (0, vitest_1.expect)(second.runs[0].input.start).toEqual(keptPoints);
                (0, vitest_1.expect)(lastFrame().points).toBe(keptPoints);
                (0, vitest_1.expect)(lastView()).toEqual(panned);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, second.runs[0].finish(aimedAt(A, second.runs[0].input.ids))];
                    }); }); })];
            case 2:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(lastView()).toEqual(panned);
                return [2 /*return*/];
        }
    });
}); });
