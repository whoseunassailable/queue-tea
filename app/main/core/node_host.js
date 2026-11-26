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
exports.nodeHost = exports.isForbiddenGit = void 0;
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var constants_1 = require("./constants");
var failed = function (err) { return ({ exitCode: 1, stdout: '', stderr: err instanceof Error ? err.message : String(err) }); };
var attempt = function (work) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, work()];
            case 1:
                _a.sent();
                return [2 /*return*/, { exitCode: 0, stdout: '', stderr: '' }];
            case 2:
                err_1 = _a.sent();
                return [2 /*return*/, failed(err_1)];
            case 3: return [2 /*return*/];
        }
    });
}); };
// The word after git's own options, so `-C path` can't hide it.
var isForbiddenGit = function (argv) {
    var _a;
    if (argv[0] !== 'git')
        return false;
    var i = 1;
    while (i < argv.length) {
        var word = argv[i];
        if (word === '-C' || word === '-c')
            i += 2;
        else if (word.startsWith('-'))
            i += 1;
        else
            break;
    }
    return constants_1.FORBIDDEN_GIT.includes((_a = argv[i]) !== null && _a !== void 0 ? _a : '');
};
exports.isForbiddenGit = isForbiddenGit;
// The app's Host: the same shape as the mod's, on Node's own calls. It is the
// one place the app runs a process, so the rule on git lives here.
var nodeHost = function (log, openUrl) { return ({
    exists: function (path) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.access)(path)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, true];
                case 2:
                    _a = _b.sent();
                    // Not reachable is what the question asks.
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    read: function (path) { return (0, promises_1.readFile)(path, 'utf8'); },
    write: function (path, text) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.dirname)(path), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(path, text, 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    run: function (argv, cwd) {
        return new Promise(function (done) {
            if ((0, exports.isForbiddenGit)(argv)) {
                log.error("refused to run: ".concat(argv.join(' ')));
                done({ exitCode: 1, stdout: '', stderr: 'Commits, pushes, merges and pulls are yours to make.' });
                return;
            }
            log.debug("run: ".concat(argv.join(' ')));
            (0, node_child_process_1.execFile)(argv[0], argv.slice(1), { cwd: cwd, maxBuffer: constants_1.RUN_OUTPUT_LIMIT }, function (err, stdout, stderr) {
                var code = err === null ? 0 : typeof err.code === 'number' ? err.code : 1;
                done({ exitCode: code, stdout: stdout, stderr: err !== null && stderr === '' ? err.message : stderr });
            });
        });
    },
    list: function (dir) { return __awaiter(void 0, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.readdir)(dir, { withFileTypes: true })];
                case 1: return [2 /*return*/, (_a.sent()).filter(function (e) { return e.isFile(); }).map(function (e) { return e.name; })];
                case 2:
                    err_2 = _a.sent();
                    // A folder that isn't there yet holds nothing; anything else is a fault.
                    if (err_2.code === 'ENOENT')
                        return [2 /*return*/, []];
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); },
    sleep: function (ms) { return new Promise(function (done) { return setTimeout(done, ms); }); },
    move: function (from, to) { return attempt(function () { return (0, promises_1.rename)(from, to); }); },
    makeDir: function (path) { return attempt(function () { return (0, promises_1.mkdir)(path); }); },
    makeDirs: function (path) { return attempt(function () { return (0, promises_1.mkdir)(path, { recursive: true }); }); },
    removeDir: function (path) { return attempt(function () { return (0, promises_1.rmdir)(path); }); },
    remove: function (path) { return attempt(function () { return (0, promises_1.rm)(path, { force: true }); }); },
    modifiedAt: function (path) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, promises_1.stat)(path)];
                case 1: return [2 /*return*/, (_b.sent()).mtimeMs];
                case 2:
                    _a = _b.sent();
                    // A file that isn't there has no time, and that is the answer asked for.
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    open: openUrl,
}); };
exports.nodeHost = nodeHost;
