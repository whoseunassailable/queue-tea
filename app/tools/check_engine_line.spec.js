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
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var APP = (0, node_path_1.join)(__dirname, '..');
// Type checks one extra file with the app's own settings.
var check = function (source) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)(APP, '.line-check-'))];
            case 1:
                dir = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, , 9, 11]);
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'probe.ts'), source)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'tsconfig.json'), JSON.stringify({ extends: '../tsconfig.json', include: ['probe.ts'] }))];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                return [4 /*yield*/, run('npx', ['tsc', '-p', dir], { cwd: APP })];
            case 6:
                _a.sent();
                return [2 /*return*/, ''];
            case 7:
                err_1 = _a.sent();
                return [2 /*return*/, err_1.stdout];
            case 8: return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, (0, promises_1.rm)(dir, { recursive: true, force: true })];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11: return [2 /*return*/];
        }
    });
}); };
(0, vitest_1.describe)('the line between the app and Claude Code', function () {
    (0, vitest_1.it)('the type check fails on a file that imports claude-code through the mod', function () { return __awaiter(void 0, void 0, void 0, function () {
        var output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, check("import { hostOf } from '../../hooks/core/host/claude_host'\nexport const h = hostOf\n")];
                case 1:
                    output = _a.sent();
                    (0, vitest_1.expect)(output).toContain('claude-code');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the type check passes on the engine code the app uses', function () { return __awaiter(void 0, void 0, void 0, function () {
        var output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, check("import { parseRecord } from '../../hooks/shared/records/data/datasources/record_source'\nexport const p = parseRecord\n")];
                case 1:
                    output = _a.sent();
                    (0, vitest_1.expect)(output).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
});
