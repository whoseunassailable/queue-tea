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
var testing_1 = require("claude-code/testing");
var task_rules_1 = require("../../../hooks/features/tasks/domain/services/task_rules");
var docs_log_source_1 = require("../../../hooks/features/tasks/data/datasources/docs_log_source");
var helpers_1 = require("../../helpers");
var ROW = {
    title: 'Retry button on the scan page',
    priority: 'high',
    expected: 'light',
    actual: 'medium',
    minutes: 84,
    branch: 'task/retry-button-scan-page',
};
var HEAD = [
    '# Task Log',
    '',
    'Every task finished in this project, newest first. Written by Queue-tea.',
    '',
].join('\n');
var TABLE = ['| Task | Priority | Difficulty | Time | Branch |', '| --- | --- | --- | --- | --- |'];
(0, testing_1.test)('a new log gets the heading, intro, date and row', function () {
    (0, testing_1.expect)((0, docs_log_source_1.addRow)(null, ROW, '2026-10-21')).toBe(__spreadArray(__spreadArray([
        HEAD,
        '## 2026-10-21',
        ''
    ], TABLE, true), [
        '| Retry button on the scan page | High | Light → Medium | 1h 24m | `task/retry-button-scan-page` |',
        '',
    ], false).join('\n'));
});
(0, testing_1.test)('a second task the same day goes first under that date', function () {
    var once = (0, docs_log_source_1.addRow)(null, ROW, '2026-10-21');
    var twice = (0, docs_log_source_1.addRow)(once, __assign(__assign({}, ROW), { title: 'Second', minutes: 10 }), '2026-10-21');
    var lines = twice.split('\n');
    var sep = lines.indexOf(TABLE[1]);
    (0, testing_1.expect)(lines[sep + 1]).toContain('| Second |');
    (0, testing_1.expect)(lines[sep + 2]).toContain('| Retry button on the scan page |');
    (0, testing_1.expect)(lines.filter(function (l) { return l === '## 2026-10-21'; })).toHaveLength(1);
});
(0, testing_1.test)('a new day goes above the older day', function () {
    var older = (0, docs_log_source_1.addRow)(null, ROW, '2026-10-21');
    var newer = (0, docs_log_source_1.addRow)(older, __assign(__assign({}, ROW), { title: 'Next day' }), '2026-10-22');
    (0, testing_1.expect)(newer.indexOf('## 2026-10-22') < newer.indexOf('## 2026-10-21')).toBe(true);
    (0, testing_1.expect)(newer.startsWith(HEAD)).toBe(true);
});
(0, testing_1.test)('pipes and newlines in a title do not break the table', function () {
    (0, testing_1.expect)((0, docs_log_source_1.escapeCell)('a | b\nc')).toBe('a \\| b c');
    var text = (0, docs_log_source_1.addRow)(null, __assign(__assign({}, ROW), { title: 'a | b\nc' }), '2026-10-21');
    var row = text.split('\n').find(function (l) { return l.startsWith('| a'); });
    (0, testing_1.expect)(row.split(/(?<!\\)\|/).length).toBe(7);
});
(0, testing_1.test)('same expected and actual difficulty shows once, no branch shows a dash', function () {
    var text = (0, docs_log_source_1.addRow)(null, __assign(__assign({}, ROW), { actual: 'light', branch: null }), '2026-10-21');
    (0, testing_1.expect)(text).toContain('| High | Light | 1h 24m | — |');
});
(0, testing_1.test)('writeDocsLog writes the log under the project', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)();
                return [4 /*yield*/, (0, docs_log_source_1.writeDocsLog)(mem.host, '/p', 'docs/task_log.md', ROW, '2026-10-21')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, docs_log_source_1.writeDocsLog)(mem.host, '/p', 'docs/task_log.md', __assign(__assign({}, ROW), { title: 'Two' }), '2026-10-21')];
            case 2:
                _a.sent();
                (0, testing_1.expect)(mem.files.get('/p/docs/task_log.md')).toContain('| Two |');
                (0, testing_1.expect)(mem.files.get('/p/docs/task_log.md')).toContain('| Retry button on the scan page |');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a log stays in its project, however its path is written', function () {
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', 'docs/task_log.md')).toBe('/p/mine/docs/task_log.md');
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine/', 'docs/../log.md')).toBe('/p/mine/log.md');
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '/p/mine/docs/log.md')).toBe('/p/mine/docs/log.md');
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '../other/docs/task_log.md')).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', 'docs/../../other/log.md')).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '/p/other/log.md')).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '/p/mine-too/log.md')).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '../../../../../../etc/log.md')).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.logFileIn)('/p/mine', '.')).toBeNull();
});
(0, testing_1.test)('a log path that leaves the project writes nothing, anywhere', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)();
                return [4 /*yield*/, (0, testing_1.expect)((0, docs_log_source_1.writeDocsLog)(mem.host, '/p/mine', '../other/task_log.md', ROW, '2026-10-21')).rejects.toThrow('outside')];
            case 1:
                _a.sent();
                (0, testing_1.expect)(__spreadArray([], mem.files.keys(), true)).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
