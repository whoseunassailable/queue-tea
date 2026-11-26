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
exports.checksPassed = exports.latestChecks = exports.readChecks = exports.saveChecks = exports.discoverChecks = exports.checksFile = void 0;
var constants_1 = require("../domain/constants");
var branch_source_1 = require("./branch_source");
var operation_store_1 = require("./operation_store");
var checksFile = function (d, op) { return "".concat((0, operation_store_1.operationPath)(d, op.key, op.id), "/checks.json"); };
exports.checksFile = checksFile;
var discoverChecks = function (d, folder, tree) { return __awaiter(void 0, void 0, void 0, function () {
    var git, files, choices, _i, files_1, manifest, text, parsed, _a, _b, _c, script, definition, folderName;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                git = (0, branch_source_1.gitIn)(d, folder);
                return [4 /*yield*/, git(['ls-tree', '-r', '--name-only', tree])];
            case 1:
                files = (_e.sent()).split('\n').filter(function (f) { return /(^|\/)package\.json$/.test(f) && f.split('/').length <= 4 && !f.includes('node_modules/'); }).slice(0, constants_1.BRANCH_LIMITS.checkChoices);
                choices = [];
                _i = 0, files_1 = files;
                _e.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 5];
                manifest = files_1[_i];
                return [4 /*yield*/, git(['show', "".concat(tree, ":").concat(manifest)])];
            case 3:
                text = _e.sent();
                parsed = void 0;
                try {
                    parsed = JSON.parse(text);
                }
                catch (err) {
                    d.log.warn("Check manifest is unreadable: ".concat(manifest, ": ").concat(String(err)));
                    return [3 /*break*/, 4];
                }
                for (_a = 0, _b = Object.entries((_d = parsed.scripts) !== null && _d !== void 0 ? _d : {}); _a < _b.length; _a++) {
                    _c = _b[_a], script = _c[0], definition = _c[1];
                    if (!/^(test|check|typecheck|lint|validate|build)(:|$)/.test(script) || typeof definition !== 'string')
                        continue;
                    folderName = manifest.includes('/') ? manifest.slice(0, manifest.lastIndexOf('/')) : '.';
                    choices.push({ id: (0, branch_source_1.digest)(manifest + '\0' + script + '\0' + text), name: folderName === '.' ? script : "".concat(folderName, ": ").concat(script), folder: folderName, manifest: manifest, script: script, definition: definition, command: "npm run ".concat(script, " \u2014 ").concat(definition) });
                }
                _e.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, choices.slice(0, constants_1.BRANCH_LIMITS.checkChoices)];
        }
    });
}); };
exports.discoverChecks = discoverChecks;
var saveChecks = function (d, op, runs) { return __awaiter(void 0, void 0, void 0, function () {
    var file, moved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = (0, exports.checksFile)(d, op);
                return [4 /*yield*/, d.host.write(file + '.tmp', JSON.stringify(runs))];
            case 1:
                _a.sent();
                return [4 /*yield*/, d.host.move(file + '.tmp', file)];
            case 2:
                moved = _a.sent();
                if (moved.exitCode)
                    throw new Error("Saving check results failed: ".concat(moved.stderr));
                return [2 /*return*/];
        }
    });
}); };
exports.saveChecks = saveChecks;
var readChecks = function (d, op) { return __awaiter(void 0, void 0, void 0, function () {
    var file, runs, _a, _b, _i, runs_1, run;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                file = (0, exports.checksFile)(d, op);
                return [4 /*yield*/, d.host.exists(file)];
            case 1:
                if (!(_c.sent()))
                    return [2 /*return*/, []];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, d.host.read(file)];
            case 2:
                runs = _b.apply(_a, [_c.sent()]);
                if (!Array.isArray(runs))
                    throw new Error('Check results have the wrong shape');
                for (_i = 0, runs_1 = runs; _i < runs_1.length; _i++) {
                    run = runs_1[_i];
                    if (run.status !== 'running' || run.owner === process.pid)
                        continue;
                    try {
                        process.kill(run.owner, 0);
                    }
                    catch (err) {
                        if (err.code === 'ESRCH') {
                            run.status = 'interrupted';
                            run.finished = d.now();
                        }
                        else
                            d.log.warn("Check owner could not be inspected: ".concat(String(err)));
                    }
                }
                return [2 /*return*/, runs];
        }
    });
}); };
exports.readChecks = readChecks;
// The latest run of each check, in the order they were first run.
var latestChecks = function (runs) { return __spreadArray([], new Map(runs.map(function (run) { return [run.checkId, run]; })).values(), true); };
exports.latestChecks = latestChecks;
var checksPassed = function (runs, tree, choices) {
    var latest = new Map();
    var _loop_1 = function (run) {
        if (run.tree === tree && choices.some(function (c) { return c.id === run.checkId; }))
            latest.set(run.checkId, run);
    };
    for (var _i = 0, runs_2 = runs; _i < runs_2.length; _i++) {
        var run = runs_2[_i];
        _loop_1(run);
    }
    return choices.length === 0 || latest.size > 0 && __spreadArray([], latest.values(), true).every(function (r) { return r.status === 'succeeded'; });
};
exports.checksPassed = checksPassed;
