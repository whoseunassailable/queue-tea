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
var records_providers_1 = require("../../../../hooks/shared/records/records_providers");
var helpers_1 = require("../../../helpers");
var HOME = '/Users/r';
var OFFSET = { 'date +%z': { stdout: '-0530\n' } };
// A session's folder picks its queue, so where each command ran matters.
var placeOf = function (mem, cwd) { return __awaiter(void 0, void 0, void 0, function () {
    var folders, run;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                folders = [];
                run = mem.host.run;
                mem.host.run = function (argv, at) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (argv[0] === 'git' || argv[0] === 'date')
                            folders.push(at);
                        return [2 /*return*/, run(argv, at)];
                    });
                }); };
                _a = {};
                return [4 /*yield*/, (0, records_providers_1.projectRepositoryOf)((0, helpers_1.fakePorts)(mem).ports).locate(cwd, HOME)];
            case 1: return [2 /*return*/, (_a.place = _b.sent(), _a.folders = folders, _a)];
        }
    });
}); };
(0, testing_1.test)('inside a repository the project is its top folder, found from where the session works', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, place, folders;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ git: __assign({ 'git rev-parse --show-toplevel': { stdout: '/work/tea\n' } }, OFFSET) });
                return [4 /*yield*/, placeOf(mem, '/work/tea/hooks/app')];
            case 1:
                _a = _b.sent(), place = _a.place, folders = _a.folders;
                (0, testing_1.expect)(place.projectPath).toBe('/work/tea');
                (0, testing_1.expect)(place.file).toMatch(/^\/Users\/r\/\.queue-tea\/projects\/tea-[0-9a-f]{6}\.json$/);
                (0, testing_1.expect)(place.offsetMinutes).toBe(-330);
                (0, testing_1.expect)(folders).toEqual(['/work/tea/hooks/app', '/work/tea/hooks/app', '/work/tea/hooks/app']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('outside a repository the project is the working directory', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, place;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ git: OFFSET });
                return [4 /*yield*/, placeOf(mem, '/work/notes')];
            case 1:
                place = (_a.sent()).place;
                (0, testing_1.expect)(place.projectPath).toBe('/work/notes');
                (0, testing_1.expect)(place.file).toMatch(/^\/Users\/r\/\.queue-tea\/projects\/notes-[0-9a-f]{6}\.json$/);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('old records that can’t be carried over are logged, and the project still loads', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, done, place;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ git: __assign({ 'git rev-parse --show-toplevel': { stdout: '/work/tea\n' } }, OFFSET) });
                mem.dirs.add("".concat(HOME, "/.queue-tie/projects"));
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, done = _a.done;
                return [4 /*yield*/, (0, records_providers_1.projectRepositoryOf)(ports).locate('/work/tea', HOME)];
            case 1:
                place = _b.sent();
                (0, testing_1.expect)(place.projectPath).toBe('/work/tea');
                (0, testing_1.expect)(done.logs.some(function (line) { return line.startsWith('carrying over the Queue-tie records failed'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
