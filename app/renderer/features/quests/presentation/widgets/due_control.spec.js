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
var hooks_1 = require("preact/hooks");
var vitest_1 = require("vitest");
var en_1 = require("../../../../l10n/en");
var due_control_1 = require("./due_control");
var TODAY = '2026-11-25';
var field = function () { return preact_1.screen.getByLabelText(en_1.t.detail.due); };
// The control as a pane holds it: the due date comes back from the engine.
var Holder = function (_a) {
    var start = _a.start, onChange = _a.onChange;
    var _b = (0, hooks_1.useState)(start), due = _b[0], setDue = _b[1];
    return (<due_control_1.DueControl due={due} today={TODAY} onChange={function (next) { return __awaiter(void 0, void 0, void 0, function () {
            var answer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, onChange(next)];
                    case 1:
                        answer = _a.sent();
                        if (answer.ok)
                            setDue(next);
                        return [2 /*return*/, answer];
                }
            });
        }); }}/>);
};
var open = function (start, answer) {
    if (answer === void 0) { answer = { ok: true, data: null }; }
    var onChange = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, answer];
    }); }); });
    (0, preact_1.render)(<Holder start={start} onChange={onChange}/>);
    return onChange;
};
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.describe)('the due date', function () {
    (0, vitest_1.it)('says there is none, and saves a day only once the field is left', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onChange = open(null);
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.detail.dueNone)).toBeTruthy();
                    preact_1.fireEvent.input(field(), { target: { value: '2026-12-01' } });
                    (0, vitest_1.expect)(onChange).not.toHaveBeenCalled();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field())];
                        }); }); })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('2026-12-01');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.detail.dueOn('2026-12-01', 6))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('saves on Return, and not again when nothing changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange = open('2026-12-01');
                    preact_1.fireEvent.input(field(), { target: { value: '2026-11-26' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.keyDown(field(), { key: 'Enter' })];
                        }); }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(onChange).toHaveBeenCalledWith('2026-11-26'); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field())];
                        }); }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(onChange).toHaveBeenCalledTimes(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when a quest is overdue', function () {
        open('2026-11-20');
        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.detail.dueOverdue('2026-11-20', -5))).toBeTruthy();
    });
    (0, vitest_1.it)('clears it with the button, or by emptying the field', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange, _a, again;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onChange = open('2026-12-01');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.detail.dueClear }))];
                        }); }); })];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(onChange).toHaveBeenLastCalledWith(null);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.detail.dueNone)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('button', { name: en_1.t.detail.dueClear })).toBeNull();
                    (0, preact_1.cleanup)();
                    again = open('2026-12-01');
                    preact_1.fireEvent.input(field(), { target: { value: '' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field())];
                        }); }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(again).toHaveBeenCalledWith(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("says why, and keeps the day, when the engine won't take it", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    open('2026-12-01', { ok: false, message: 'Pick a due date from the calendar, or clear it.' });
                    preact_1.fireEvent.input(field(), { target: { value: '2026-12-09' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field())];
                        }); }); })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText('Pick a due date from the calendar, or clear it.')];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(field().value).toBe('2026-12-09');
                    (0, vitest_1.expect)(field().getAttribute('aria-invalid')).toBe('true');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("sends nothing for a day that isn't real", function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChange = open(null);
                    // A date field won't hold 30 February; it reads as empty.
                    preact_1.fireEvent.input(field(), { target: { value: '2026-02-30' } });
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void preact_1.fireEvent.blur(field())];
                        }); }); })];
                case 1:
                    _a.sent();
                    (0, vitest_1.expect)(onChange).not.toHaveBeenCalled();
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.detail.dueNone)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
