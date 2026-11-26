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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("./logger");
var node_host_1 = require("./node_host");
var log = (0, logger_1.createLogger)('prod', function () { });
var host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
}); }); });
var dir;
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-host-'))];
            case 1:
                dir = _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(dir, { recursive: true, force: true }); });
(0, vitest_1.describe)('the rule on git', function () {
    vitest_1.it.each([
        [['git', 'commit', '-m', 'x']],
        [['git', 'push']],
        [['git', 'merge', 'main']],
        [['git', 'pull']],
        [['git', '-C', '/p', 'commit']],
        [['git', '-c', 'a=b', 'push']],
        [['git', '--no-pager', 'pull']],
    ])('refuses %j', function (argv) {
        (0, vitest_1.expect)((0, node_host_1.isForbiddenGit)(argv)).toBe(true);
    });
    vitest_1.it.each([[['git', 'status']], [['git', 'switch', '-c', 'task/commit']], [['git', 'log', '--grep', 'push']], [['ls', 'commit']]])('lets %j through', function (argv) {
        (0, vitest_1.expect)((0, node_host_1.isForbiddenGit)(argv)).toBe(false);
    });
    (0, vitest_1.it)('never starts a refused command', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ran;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, host.run(['git', 'commit', '-m', 'x'], dir)];
                case 1:
                    ran = _a.sent();
                    (0, vitest_1.expect)(ran.exitCode).toBe(1);
                    (0, vitest_1.expect)(ran.stderr).toContain('yours to make');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the record, on real files', function () {
    (0, vitest_1.it)('two writers at once lose neither change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, add, read, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = "".concat(dir, "/projects/p-000000.json");
                    add = function (id) {
                        return (0, record_source_1.updateRecord)(host, file, function (r) { return (__assign(__assign({}, r), { requests: __spreadArray(__spreadArray([], r.requests, true), [{ id: id, kind: 'begin', taskId: 't', at: 'x' }], false) })); }, 'p', '/p');
                    };
                    return [4 /*yield*/, Promise.all(['a', 'b', 'c', 'd', 'e', 'f'].map(add))];
                case 1:
                    _c.sent();
                    _a = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 2:
                    read = _a.apply(void 0, [_c.sent()]);
                    if (read === 'unreadable')
                        throw new Error('should read');
                    (0, vitest_1.expect)(read.requests.map(function (q) { return q.id; }).sort()).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, host.exists("".concat(file, ".lock"))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the last good copy beside the record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var file, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    file = "".concat(dir, "/p.json");
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify((0, record_source_1.emptyRecord)('p', '/p')))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, record_source_1.updateRecord)(host, file, function (r) { return (__assign(__assign({}, r), { playNext: 'x' })); }, 'p', '/p')];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)("".concat(file, ".bak"), 'utf8')];
                case 3:
                    _a.apply(void 0, [_c.apply(_b, [_d.sent()]).playNext]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the file calls', function () {
    (0, vitest_1.it)('a lock folder can be taken once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var lock, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    lock = (0, node_path_1.join)(dir, 'x.lock');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, host.makeDir(lock)];
                case 1:
                    _a.apply(void 0, [(_d.sent()).exitCode]).toBe(0);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, host.makeDir(lock)];
                case 2:
                    _b.apply(void 0, [(_d.sent()).exitCode]).not.toBe(0);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, host.removeDir(lock)];
                case 3:
                    _c.apply(void 0, [(_d.sent()).exitCode]).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a missing folder lists as empty and a missing file has no time', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, host.list((0, node_path_1.join)(dir, 'none'))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual([]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, host.modifiedAt((0, node_path_1.join)(dir, 'none'))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a command that fails says so rather than throwing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var ran;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, host.run(['no-such-command-here'])];
                case 1:
                    ran = _a.sent();
                    (0, vitest_1.expect)(ran.exitCode).not.toBe(0);
                    (0, vitest_1.expect)(ran.stderr).not.toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    // A branch's diff carries graphify's graph files, about 21 MB.
    (0, vitest_1.it)('a command that prints more than 16 MB comes back whole', function () { return __awaiter(void 0, void 0, void 0, function () {
        var size, ran;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    size = 20 * 1024 * 1024;
                    return [4 /*yield*/, host.run([process.execPath, '-e', "process.stdout.write('x'.repeat(".concat(size, "))")], dir)];
                case 1:
                    ran = _a.sent();
                    (0, vitest_1.expect)(ran.stderr).toBe('');
                    (0, vitest_1.expect)(ran.exitCode).toBe(0);
                    (0, vitest_1.expect)(ran.stdout.length).toBe(size);
                    return [2 /*return*/];
            }
        });
    }); });
});
