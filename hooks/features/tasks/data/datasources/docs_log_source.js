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
exports.writeDocsLog = exports.addRow = exports.escapeCell = void 0;
var time_1 = require("../../../../shared/time/domain/services/time");
var task_rules_1 = require("../../domain/services/task_rules");
var HEAD = [
    '# Task Log',
    '',
    'Every task finished in this project, newest first. Written by Queue-tea.',
    '',
];
var TABLE = ['| Task | Priority | Difficulty | Time | Branch |', '| --- | --- | --- | --- | --- |'];
var DAY = /^## (\d{4}-\d{2}-\d{2})$/;
var capital = function (word) { return word.charAt(0).toUpperCase() + word.slice(1); };
// A cell that keeps the table whole, and an MDX build (Docusaurus) working.
var escapeCell = function (text) {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/\|/g, '\\|')
        .replace(/</g, '&lt;')
        .replace(/[{}]/g, function (c) { return "\\".concat(c); })
        .replace(/\s*(\r\n|\r|\n)\s*/g, ' ');
};
exports.escapeCell = escapeCell;
var rowLine = function (row) {
    var difficulty = row.expected === row.actual ? capital(row.actual) : "".concat(capital(row.expected), " \u2192 ").concat(capital(row.actual));
    var branch = row.branch === null ? '—' : "`".concat(row.branch, "`");
    return "| ".concat((0, exports.escapeCell)(row.title), " | ").concat(capital(row.priority), " | ").concat(difficulty, " | ").concat((0, time_1.formatMinutes)(row.minutes), " | ").concat(branch, " |");
};
// Puts the row first under its date; a date not there yet gets its own
// section above every older date.
var addRow = function (existing, row, day) {
    var lines = existing === null ? __spreadArray([], HEAD, true) : existing.replace(/\n+$/, '').split('\n').concat('');
    var line = rowLine(row);
    var heading = lines.indexOf("## ".concat(day));
    if (heading >= 0) {
        var sep = lines.indexOf(TABLE[1], heading);
        lines.splice(sep + 1, 0, line);
        return lines.join('\n').replace(/\n*$/, '\n');
    }
    var older = lines.findIndex(function (l) { var _a, _b; return ((_b = (_a = l.match(DAY)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '9999') < day; });
    var at = older >= 0 ? older : lines.length;
    var section = __spreadArray(__spreadArray(["## ".concat(day), ''], TABLE, true), [line, ''], false);
    lines.splice.apply(lines, __spreadArray([at, 0], section, false));
    return lines.join('\n').replace(/\n*$/, '\n');
};
exports.addRow = addRow;
var writeDocsLog = function (host, projectPath, logPath, row, day) { return __awaiter(void 0, void 0, void 0, function () {
    var file, existing, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                file = (0, task_rules_1.logFileIn)(projectPath, logPath);
                if (file === null)
                    throw new Error("the task log path ".concat(logPath, " is outside ").concat(projectPath));
                return [4 /*yield*/, host.exists(file)];
            case 1:
                if (!(_b.sent())) return [3 /*break*/, 3];
                return [4 /*yield*/, host.read(file)];
            case 2:
                _a = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                _a = null;
                _b.label = 4;
            case 4:
                existing = _a;
                return [4 /*yield*/, host.write(file, (0, exports.addRow)(existing, row, day))];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.writeDocsLog = writeDocsLog;
