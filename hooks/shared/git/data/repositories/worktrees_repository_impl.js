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
exports.worktreesRepositoryImpl = void 0;
var worktreesRepositoryImpl = function (host, root) {
    var git = function (args) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, host.run(__spreadArray(['git'], args, true), root)];
                case 1:
                    result = _a.sent();
                    if (result.exitCode !== 0)
                        throw new Error("git ".concat(args[0], " failed: ").concat(result.stderr));
                    return [2 /*return*/, result.stdout.trim()];
            }
        });
    }); };
    return {
        list: function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _i, _a, part;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = [];
                        _i = 0;
                        return [4 /*yield*/, git(['worktree', 'list', '--porcelain', '-z'])];
                    case 1:
                        _a = (_b.sent()).split('\0');
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        part = _a[_i];
                        if (part.startsWith('worktree '))
                            result.push({ path: part.slice(9), branch: null });
                        else if (part.startsWith('branch refs/heads/') && result.length > 0)
                            result[result.length - 1].branch = part.slice(18);
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, result];
                }
            });
        }); },
        base: function () { return __awaiter(void 0, void 0, void 0, function () {
            var branch, _i, _a, candidate, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        branch = null;
                        _i = 0, _a = ['main', 'master'];
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        candidate = _a[_i];
                        return [4 /*yield*/, host.run(['git', 'show-ref', '--verify', '--quiet', "refs/heads/".concat(candidate)], root)];
                    case 2:
                        if ((_d.sent()).exitCode === 0) {
                            branch = candidate;
                            return [3 /*break*/, 4];
                        }
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (!(branch !== null && branch !== void 0)) return [3 /*break*/, 5];
                        _b = branch;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, git(['symbolic-ref', '--short', 'HEAD'])];
                    case 6:
                        _b = (branch = _d.sent());
                        _d.label = 7;
                    case 7:
                        _b;
                        _c = { branch: branch };
                        return [4 /*yield*/, git(['rev-parse', '--verify', "refs/heads/".concat(branch, "^{commit}")])];
                    case 8: return [2 /*return*/, (_c.commit = _d.sent(), _c)];
                }
            });
        }); },
        create: function (path, branch, base, isNew) { return __awaiter(void 0, void 0, void 0, function () {
            var made;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, host.makeDirs(path.slice(0, path.lastIndexOf('/')))];
                    case 1:
                        made = _a.sent();
                        if (made.exitCode !== 0)
                            throw new Error("making the worktree folder failed: ".concat(made.stderr));
                        return [4 /*yield*/, git(isNew ? ['worktree', 'add', '-b', branch, path, base] : ['worktree', 'add', path, branch])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    };
};
exports.worktreesRepositoryImpl = worktreesRepositoryImpl;
