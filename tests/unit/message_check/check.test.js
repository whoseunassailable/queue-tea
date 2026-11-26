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
var testing_1 = require("claude-code/testing");
var check_repository_impl_1 = require("../../../hooks/features/message_check/data/repositories/check_repository_impl");
var check_prompt_1 = require("../../../hooks/features/message_check/domain/services/check_prompt");
var helpers_1 = require("../../helpers");
var usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 };
var answered = function (text) { return ({ isAnswered: true, text: text, usage: usage }); };
// An Ask whose fork answers after `forkMs`, on a clock the test moves.
var fakeAsk = function (fork, forkMs) {
    if (forkMs === void 0) { forkMs = 0; }
    var now = 0;
    var waits = [];
    var logs = [];
    var sleep = function (ms) { return new Promise(function (done) { return waits.push({ at: now + ms, done: done }); }); };
    var advance = function (ms) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, w;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    now += ms;
                    for (_i = 0, _a = waits.filter(function (w) { return w.at <= now; }); _i < _a.length; _i++) {
                        w = _a[_i];
                        w.done();
                    }
                    return [4 /*yield*/, Promise.resolve()];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var ask = {
        fork: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(forkMs > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, sleep(forkMs)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, fork()];
                }
            });
        }); },
        complete: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, answered('{"kind":"quick","intent":"understanding"}')];
        }); }); },
        sleep: sleep,
        log: function (text) { return logs.push(text); },
    };
    return { ask: ask, advance: advance, logs: logs };
};
(0, testing_1.test)('parses a clean answer', function () {
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"same","intent":"improving"}')).toEqual({ kind: 'same', intent: 'improving' });
});
(0, testing_1.test)('parses an answer inside prose and a code fence', function () {
    var reply = 'Sure! Here it is:\n```json\n{"kind":"new","intent":"improving","title":"Retry button","difficulty":"light"}\n```\nHope that helps.';
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)(reply)).toEqual({ kind: 'new', intent: 'improving', title: 'Retry button', difficulty: 'light' });
});
(0, testing_1.test)('new without a title is null; new without difficulty is medium', function () {
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"new","intent":"improving"}')).toBeNull();
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"new","intent":"improving","title":"X"}')).toEqual({
        kind: 'new',
        intent: 'improving',
        title: 'X',
        difficulty: 'medium',
    });
});
(0, testing_1.test)('an unknown kind, a bad intent, or no object is null', function () {
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"maybe","intent":"improving"}')).toBeNull();
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{"kind":"same","intent":"vibes"}')).toBeNull();
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('no json here')).toBeNull();
    (0, testing_1.expect)((0, check_prompt_1.parseCheckAnswer)('{broken')).toBeNull();
});
(0, testing_1.test)('a long title is cut to 60 characters', function () {
    var _a;
    var answer = (0, check_prompt_1.parseCheckAnswer)("{\"kind\":\"new\",\"intent\":\"improving\",\"title\":\"".concat('x'.repeat(80), "\"}"));
    (0, testing_1.expect)((_a = answer === null || answer === void 0 ? void 0 : answer.title) === null || _a === void 0 ? void 0 : _a.length).toBe(60);
});
(0, testing_1.test)('a fork that answers in time gives the answer', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ask, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ask = fakeAsk(function () { return answered('{"kind":"same","intent":"understanding"}'); }).ask;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_repository_impl_1.checkMessage)(ask, 'p', 10000)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'same', intent: 'understanding' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a fork slower than the time limit gives null', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ask, advance, logs, result, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = fakeAsk(function () { return answered('{"kind":"same","intent":"understanding"}'); }, 11000), ask = _a.ask, advance = _a.advance, logs = _a.logs;
                result = (0, check_repository_impl_1.checkMessage)(ask, 'p', 10000);
                return [4 /*yield*/, advance(10000)];
            case 1:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, result];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBeNull();
                (0, testing_1.expect)(logs.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('nothing-to-fork falls back to a completion', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ask, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ask = fakeAsk(function () { return ({ isAnswered: false, reason: 'nothing-to-fork' }); }).ask;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_repository_impl_1.checkMessage)(ask, 'p', 10000)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual({ kind: 'quick', intent: 'understanding' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unanswered fork gives null and is logged', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ask, logs, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = fakeAsk(function () { return ({ isAnswered: false, reason: 'api-error', status: 500, error: 'x', usage: usage }); }), ask = _a.ask, logs = _a.logs;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, check_repository_impl_1.checkMessage)(ask, 'p', 10000)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBeNull();
                (0, testing_1.expect)(logs.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the prompt names the current task and the queue', function () {
    var prompt = (0, check_prompt_1.checkPrompt)((0, helpers_1.makeTask)({ title: 'Retry button', state: 'current' }), [(0, helpers_1.makeTask)({ title: 'Dark mode' }), (0, helpers_1.makeTask)({ title: 'Export CSV' })], 'also make it blue');
    (0, testing_1.expect)(prompt).toContain('Retry button');
    (0, testing_1.expect)(prompt).toContain('Dark mode');
    (0, testing_1.expect)(prompt).toContain('Export CSV');
    (0, testing_1.expect)(prompt).toContain('also make it blue');
    (0, testing_1.expect)(prompt).toContain('"kind"');
});
(0, testing_1.test)('with no current task, the prompt says work is new', function () {
    (0, testing_1.expect)((0, check_prompt_1.checkPrompt)(null, [], 'add dark mode')).toContain('No task is current');
});
