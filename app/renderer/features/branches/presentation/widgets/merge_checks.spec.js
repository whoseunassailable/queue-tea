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
var test_fixtures_1 = require("../../test_fixtures");
var merge_checks_1 = require("./merge_checks");
(0, vitest_1.afterEach)(function () { (0, preact_1.cleanup)(); vitest_1.vi.useRealTimers(); });
(0, vitest_1.it)('replaces old failures with the latest attempt and bounds the number of rendered logs', function () { return __awaiter(void 0, void 0, void 0, function () {
    var workspace, run, page, checks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                workspace = (0, test_fixtures_1.mergeWorkspace)({ availableChecks: [{ id: 'test', name: 'test', folder: '.', command: 'npm test' }] });
                run = { id: 'old', checkId: 'test', name: 'test', command: 'npm test', tree: workspace.operation.tree, at: 1000, finished: 2000, owner: 1, status: 'failed', output: 'OLD FAILURE', exitCode: 1, truncated: false };
                workspace.checks = Array.from({ length: 100 }, function (_, n) { return (__assign(__assign({}, run), { id: "old-".concat(n) })); });
                workspace.checks.push(__assign(__assign({}, run), { id: 'retry', status: 'running', finished: null, exitCode: null, output: 'new live output' }));
                page = (0, preact_1.render)(<merge_checks_1.MergeChecks workspace={workspace} busy onRun={function () { }} onCancel={function () { }}/>);
                (0, vitest_1.expect)(preact_1.screen.queryByText('OLD FAILURE')).toBeNull();
                (0, vitest_1.expect)(preact_1.screen.getAllByRole('log')).toHaveLength(1);
                (0, vitest_1.expect)(preact_1.screen.getByRole('log').textContent).toBe('new live output');
                checks = __spreadArray(__spreadArray([], workspace.checks.slice(0, -1), true), [__assign(__assign({}, run), { id: 'retry', status: 'succeeded', output: 'new passed output', exitCode: 0 })], false);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, page.rerender(<merge_checks_1.MergeChecks workspace={__assign(__assign({}, workspace), { checks: checks, checksCurrent: true })} busy={false} onRun={function () { }} onCancel={function () { }}/>)];
                    }); }); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Passed')).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.queryByText('Failed')).toBeNull();
                (0, vitest_1.expect)(preact_1.screen.getByRole('log').textContent).toBe('new passed output');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('ticks elapsed time during a check and freezes its duration after completion', function () { return __awaiter(void 0, void 0, void 0, function () {
    var workspace, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.useFakeTimers();
                vitest_1.vi.setSystemTime(10000);
                workspace = (0, test_fixtures_1.mergeWorkspace)({ availableChecks: [{ id: 'build', name: 'build', folder: '.', command: 'npm run build' }], checks: [{ id: 'run', checkId: 'build', name: 'build', command: 'npm run build', tree: 'tree', at: 8000, finished: null, owner: 1, status: 'running', output: '', exitCode: null, truncated: false }] });
                page = (0, preact_1.render)(<merge_checks_1.MergeChecks workspace={workspace} busy onRun={function () { }} onCancel={function () { }}/>);
                (0, vitest_1.expect)(preact_1.screen.getByText(/Elapsed 0:02/)).toBeTruthy();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        vitest_1.vi.advanceTimersByTime(3000);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText(/Elapsed 0:05/)).toBeTruthy();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, page.rerender(<merge_checks_1.MergeChecks workspace={__assign(__assign({}, workspace), { checks: [__assign(__assign({}, workspace.checks[0]), { status: 'failed', finished: 13000 })] })} busy={false} onRun={function () { }} onCancel={function () { }}/>)];
                    }); }); })];
            case 2:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Duration 0:05')).toBeTruthy();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        vitest_1.vi.advanceTimersByTime(10000);
                        return [2 /*return*/];
                    }); }); })];
            case 3:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Duration 0:05')).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
