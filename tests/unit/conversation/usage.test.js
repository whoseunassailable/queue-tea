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
var testing_1 = require("claude-code/testing");
var conversation_turn_controller_1 = require("../../../hooks/features/conversation/presentation/state_management/conversation_turn_controller");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var allowance_1 = require("../../../hooks/features/conversation/domain/services/allowance");
var checkpoints_text_1 = require("../../../hooks/shared/checkpoints/domain/constants/checkpoints_text");
var helpers_1 = require("../../helpers");
var RESET = '2026-10-21T14:40:00Z';
var current = function () { return (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', messages: ['add a retry button'] }); };
var setup = function (reply) {
    var _a;
    var task = current();
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] });
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(record), _a) });
    var fake = (0, helpers_1.fakePorts)(mem, { reply: reply, view: { record: record } });
    return __assign(__assign({}, fake), { mem: mem, task: task });
};
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
(0, testing_1.test)('readAllowance picks the five-hour window', function () {
    (0, testing_1.expect)((0, allowance_1.readAllowance)([
        { kind: 'seven_day', percentUsed: 12 },
        { kind: 'five_hour', percentUsed: 62.5, resetsAt: RESET },
    ])).toEqual({ percent: 62.5, resetsAt: RESET });
    (0, testing_1.expect)((0, allowance_1.readAllowance)([])).toBeNull();
});
(0, testing_1.test)('formatAllowance with and without a reset time', function () {
    (0, testing_1.expect)((0, allowance_1.formatAllowance)({ percent: 62.4, resetsAt: RESET }, 120)).toBe('5h: 62% · resets 16:40');
    (0, testing_1.expect)((0, allowance_1.formatAllowance)({ percent: 7, resetsAt: null }, 120)).toBe('5h: 7%');
});
(0, testing_1.test)('shouldFresh only past the size', function () {
    (0, testing_1.expect)((0, allowance_1.shouldFresh)(100001, 100000)).toBe(true);
    (0, testing_1.expect)((0, allowance_1.shouldFresh)(100000, 100000)).toBe(false);
    (0, testing_1.expect)((0, allowance_1.shouldFresh)(undefined, 100000)).toBe(false);
});
(0, testing_1.test)('shouldHandoff once per reset window', function () {
    (0, testing_1.expect)((0, allowance_1.shouldHandoff)(90, 90, null, RESET)).toBe(true);
    (0, testing_1.expect)((0, allowance_1.shouldHandoff)(95, 90, RESET, RESET)).toBe(false);
    (0, testing_1.expect)((0, allowance_1.shouldHandoff)(89.9, 90, null, RESET)).toBe(false);
    (0, testing_1.expect)((0, allowance_1.shouldHandoff)(91, 90, RESET, '2026-10-21T19:40:00Z')).toBe(true);
});
(0, testing_1.test)('over 100,000 tokens: handoff, then clear and the first message from the note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, done, settle, mem, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup('Button done; colour left.'), ports = _a.ports, done = _a.done, settle = _a.settle, mem = _a.mem, task = _a.task;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 120000, allowance: null }, null)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks[0].handoff).toEqual({ text: 'Button done; colour left.', written: '2026-10-21T09:12:00+02:00' });
                (0, testing_1.expect)(done.clears).toBe(1);
                (0, testing_1.expect)(done.submits[0]).toStartWith("Task: ".concat(task.title, "\n\nadd a retry button\n\nHandoff note (2026-10-21T09:12:00+02:00):\nButton done; colour left.\n\nChecked by Queue-tea just now:"));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("the fresh conversation opens the description's saved files from the realm's notes folder", function () { return __awaiter(void 0, void 0, void 0, function () {
    var image, task, record, mem, _a, ports, done, settle;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                image = "attachments/".concat('a1'.repeat(32), ".png");
                task = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', messages: ['add a retry button'], description: "Like this:\n![mock.png](<".concat(image, ">)") });
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] });
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = JSON.stringify(record), _b) });
                _a = (0, helpers_1.fakePorts)(mem, { reply: 'Button done.', view: { record: record } }), ports = _a.ports, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 120000, allowance: null }, null)];
            case 1:
                _c.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(done.submits[0]).toContain("Description: Like this:\n![mock.png](</h/.queue-tea/notes/p-000000/".concat(image, ">)\n\n").concat(checkpoints_text_1.FIRST_MESSAGE_LABELS.files));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a failed handoff note does not clear', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, done, settle, mem;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup(undefined), ports = _a.ports, done = _a.done, settle = _a.settle, mem = _a.mem;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 120000, allowance: null }, null)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(done.clears).toBe(0);
                (0, testing_1.expect)(stored(mem).tasks[0].handoff).toBeNull();
                (0, testing_1.expect)(done.statuses).toContain("Queue-tea: couldn't write the checkpoint; trying again after the next reply");
                (0, testing_1.expect)(done.logs.length > 0).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('90% writes one handoff note per reset window, without clearing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, done, settle, mem, first, second;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup('Halfway.'), ports = _a.ports, done = _a.done, settle = _a.settle, mem = _a.mem;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 10000, allowance: { percent: 91, resetsAt: RESET } }, null)];
            case 1:
                first = _c.sent();
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 10000, allowance: { percent: 93, resetsAt: RESET } }, first)];
            case 2:
                second = _c.sent();
                return [4 /*yield*/, settle()];
            case 3:
                _c.sent();
                (0, testing_1.expect)(first).toBe(RESET);
                (0, testing_1.expect)(second).toBe(RESET);
                (0, testing_1.expect)((_b = stored(mem).tasks[0].handoff) === null || _b === void 0 ? void 0 : _b.text).toBe('Halfway.');
                (0, testing_1.expect)(done.clears).toBe(0);
                (0, testing_1.expect)(done.logs.filter(function (l) { return l.includes('handoff'); }).length).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('under the size and the mark, nothing happens', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, done, settle, mem, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup('note'), ports = _a.ports, done = _a.done, settle = _a.settle, mem = _a.mem;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 50000, allowance: { percent: 40, resetsAt: RESET } }, null)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBeNull();
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(done.clears).toBe(0);
                (0, testing_1.expect)(stored(mem).tasks[0].handoff).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no current task, nothing happens', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, done, settle;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = JSON.stringify((0, record_source_1.emptyRecord)('p', '/p')), _b) });
                _a = (0, helpers_1.fakePorts)(mem, { reply: 'note', view: { record: (0, record_source_1.emptyRecord)('p', '/p') } }), ports = _a.ports, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 500000, allowance: { percent: 99, resetsAt: RESET } }, null)];
            case 1:
                _c.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(done.clears).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no reset time, the 90% note is written once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, settle, writes, fork, first;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup('Halfway.'), ports = _a.ports, settle = _a.settle;
                writes = [];
                fork = ports.ask.fork;
                ports.ask.fork = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        writes.push(prompt);
                        return [2 /*return*/, fork(prompt)];
                    });
                }); };
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { allowance: { percent: 95, resetsAt: null } }, null)];
            case 1:
                first = _b.sent();
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { allowance: { percent: 96, resetsAt: null } }, first)];
            case 2:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(writes).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
