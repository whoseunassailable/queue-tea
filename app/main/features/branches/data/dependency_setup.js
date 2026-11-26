"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.inspectDependencies = exports.CheckStopped = exports.DependencySetupRequired = void 0;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var reply_1 = require("../../../core/reply");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var DependencySetupRequired = /** @class */ (function (_super) {
    __extends(DependencySetupRequired, _super);
    function DependencySetupRequired() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DependencySetupRequired;
}(reply_1.Refusal));
exports.DependencySetupRequired = DependencySetupRequired;
var CheckStopped = /** @class */ (function (_super) {
    __extends(CheckStopped, _super);
    function CheckStopped(status) {
        var _this = _super.call(this, status === 'cancelled' ? constants_1.BRANCH_TEXT.checkCancelled : constants_1.BRANCH_TEXT.checkTimeout) || this;
        _this.status = status;
        return _this;
    }
    return CheckStopped;
}(Error));
exports.CheckStopped = CheckStopped;
var inside = function (root, path) { return path === root || path.startsWith(root + node_path_1.sep); };
var quote = function (text) { return "'" + text.replaceAll("'", "'\\''") + "'"; };
var dependencyKinds = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
var sameDependencies = function (a, b) { return dependencyKinds.every(function (kind) {
    var _a, _b;
    var left = Object.entries((_a = a[kind]) !== null && _a !== void 0 ? _a : {}).sort();
    var right = Object.entries((_b = b[kind]) !== null && _b !== void 0 ? _b : {}).sort();
    return JSON.stringify(left) === JSON.stringify(right);
}); };
// Only dependencies prepared inside this operation can be used. A link to a
// task's node_modules lets build tools write their caches into that task.
var inspectDependencies = function (d, folder, subfolder, active) { return __awaiter(void 0, void 0, void 0, function () {
    var root, work, install, setup, read, exists, _a, _b, _c, manifest_1, ancestor, modules_1, _d, needsInstallation, _e, lock, name_1, selected, locked, _i, _f, _g, path, expected, packagePath, _h, _j, _k, modules, _l, _m, _o, installed, _loop_1, _p, _q, _r, path, actual, _s, _t, _u, path, expected, bins, _v, bins_1, bin, _w, _x, _y, _z, name_2, _0, _1, err_1;
    var _2, _3, _4, _5;
    return __generator(this, function (_6) {
        switch (_6.label) {
            case 0:
                root = (0, node_path_1.resolve)(folder);
                work = (0, node_path_1.join)(folder, subfolder);
                install = work;
                setup = function (reason) {
                    var blockedReasons = [constants_1.BRANCH_TEXT.dependencyUnsafe, constants_1.BRANCH_TEXT.dependencyLockMissing, constants_1.BRANCH_TEXT.dependencyLockUnsupported];
                    var blocked = blockedReasons.includes(reason);
                    throw new DependencySetupRequired(constants_1.BRANCH_TEXT.dependencySetup(reason, work, blocked ? null : "cd ".concat(quote(install), " && npm ci --offline")));
                };
                read = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, _b, value, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                active();
                                _a = inside;
                                _b = [root];
                                return [4 /*yield*/, (0, promises_1.realpath)(path)];
                            case 1:
                                if (!_a.apply(void 0, _b.concat([_e.sent()])))
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                active();
                                _d = (_c = JSON).parse;
                                return [4 /*yield*/, d.host.read(path)];
                            case 2:
                                value = _d.apply(_c, [_e.sent()]);
                                active();
                                return [2 /*return*/, value];
                        }
                    });
                }); };
                exists = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    var err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                active();
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, promises_1.lstat)(path)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, true];
                            case 3:
                                err_2 = _a.sent();
                                if (err_2.code === 'ENOENT')
                                    return [2 /*return*/, false];
                                throw err_2;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                _6.label = 1;
            case 1:
                _6.trys.push([1, 42, , 43]);
                active();
                return [4 /*yield*/, (0, promises_1.realpath)(folder)];
            case 2:
                root = _6.sent();
                work = (0, node_path_1.resolve)(root, subfolder);
                install = work;
                _a = !inside(root, work);
                if (_a) return [3 /*break*/, 4];
                _b = inside;
                _c = [root];
                return [4 /*yield*/, (0, promises_1.realpath)(work)];
            case 3:
                _a = !_b.apply(void 0, _c.concat([_6.sent()]));
                _6.label = 4;
            case 4:
                if (_a)
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                return [4 /*yield*/, read((0, node_path_1.join)(work, 'package.json'))];
            case 5:
                manifest_1 = _6.sent();
                ancestor = work;
                _6.label = 6;
            case 6:
                if (!true) return [3 /*break*/, 10];
                modules_1 = (0, node_path_1.join)(ancestor, 'node_modules');
                return [4 /*yield*/, exists(modules_1)];
            case 7:
                _d = (_6.sent());
                if (!_d) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, promises_1.lstat)(modules_1)];
            case 8:
                _d = !(_6.sent()).isDirectory();
                _6.label = 9;
            case 9:
                if (_d)
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                if (ancestor === root)
                    return [3 /*break*/, 10];
                ancestor = (0, node_path_1.dirname)(ancestor);
                return [3 /*break*/, 6];
            case 10:
                _e = dependencyKinds.some(function (kind) { var _a; return Object.keys((_a = manifest_1[kind]) !== null && _a !== void 0 ? _a : {}).length; });
                if (_e) return [3 /*break*/, 12];
                return [4 /*yield*/, exists((0, node_path_1.join)(work, 'node_modules'))
                    // npm workspaces use the nearest ancestor lock; independent nested
                    // packages (such as docs/) keep their own installation and lock.
                ];
            case 11:
                _e = (_6.sent());
                _6.label = 12;
            case 12:
                needsInstallation = _e;
                lock = void 0;
                _6.label = 13;
            case 13:
                if (!true) return [3 /*break*/, 18];
                return [4 /*yield*/, exists((0, node_path_1.join)(install, 'npm-shrinkwrap.json'))];
            case 14:
                name_1 = (_6.sent()) ? 'npm-shrinkwrap.json' : 'package-lock.json';
                return [4 /*yield*/, exists((0, node_path_1.join)(install, name_1))];
            case 15:
                if (!_6.sent()) return [3 /*break*/, 17];
                return [4 /*yield*/, read((0, node_path_1.join)(install, name_1))];
            case 16:
                lock = _6.sent();
                return [3 /*break*/, 18];
            case 17:
                if (install === root)
                    return [3 /*break*/, 18];
                install = (0, node_path_1.dirname)(install);
                return [3 /*break*/, 13];
            case 18:
                selected = (0, node_path_1.relative)(install, work).split(node_path_1.sep).join('/');
                // A dependency-free workspace can still use its root's tools. Independent
                // Node scripts need no installation, even beside an unrelated parent lock.
                if (!needsInstallation && (install === work || !((_2 = lock === null || lock === void 0 ? void 0 : lock.packages) === null || _2 === void 0 ? void 0 : _2[selected])))
                    return [2 /*return*/];
                if (!lock)
                    return [2 /*return*/, setup(constants_1.BRANCH_TEXT.dependencyLockMissing)];
                if (!lock.packages || ![2, 3].includes((_3 = lock.lockfileVersion) !== null && _3 !== void 0 ? _3 : 0))
                    setup(constants_1.BRANCH_TEXT.dependencyLockUnsupported);
                locked = lock.packages;
                if (!locked[selected]) {
                    install = work;
                    setup(constants_1.BRANCH_TEXT.dependencyLockMissing);
                }
                if (!sameDependencies(manifest_1, locked[selected]))
                    setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                _i = 0, _f = Object.entries(locked);
                _6.label = 19;
            case 19:
                if (!(_i < _f.length)) return [3 /*break*/, 23];
                _g = _f[_i], path = _g[0], expected = _g[1];
                active();
                if (path.split('/').includes('node_modules'))
                    return [3 /*break*/, 22];
                if (path && !(0, git_rules_1.isFile)(path))
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                packagePath = (0, node_path_1.resolve)(install, path);
                _h = inside;
                _j = [root];
                return [4 /*yield*/, (0, promises_1.realpath)(packagePath)];
            case 20:
                if (!_h.apply(void 0, _j.concat([_6.sent()])))
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                _k = sameDependencies;
                return [4 /*yield*/, read((0, node_path_1.join)(packagePath, 'package.json'))];
            case 21:
                if (!_k.apply(void 0, [_6.sent(), expected]))
                    setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                _6.label = 22;
            case 22:
                _i++;
                return [3 /*break*/, 19];
            case 23:
                modules = (0, node_path_1.join)(install, 'node_modules');
                return [4 /*yield*/, exists(modules)];
            case 24:
                if (!(_6.sent()))
                    setup(constants_1.BRANCH_TEXT.dependencyMissing);
                return [4 /*yield*/, (0, promises_1.lstat)(modules)];
            case 25:
                _l = !(_6.sent()).isDirectory();
                if (_l) return [3 /*break*/, 27];
                _m = inside;
                _o = [root];
                return [4 /*yield*/, (0, promises_1.realpath)(modules)];
            case 26:
                _l = !_m.apply(void 0, _o.concat([_6.sent()]));
                _6.label = 27;
            case 27:
                if (_l)
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                return [4 /*yield*/, read((0, node_path_1.join)(modules, '.package-lock.json'))];
            case 28:
                installed = _6.sent();
                if (!installed.packages || ![2, 3].includes((_4 = installed.lockfileVersion) !== null && _4 !== void 0 ? _4 : 0))
                    setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                _loop_1 = function (path, actual) {
                    var expected, packagePath, _7, _8, bin, _9, _10, _11, name_3, target, _12, _13, _14, executable, _15, _16;
                    return __generator(this, function (_17) {
                        switch (_17.label) {
                            case 0:
                                active();
                                if (!(0, git_rules_1.isFile)(path))
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                expected = locked[path];
                                if (!expected || ['version', 'resolved', 'integrity', 'link'].some(function (key) { return actual[key] !== expected[key]; }))
                                    setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                                packagePath = (0, node_path_1.resolve)(install, path);
                                _7 = inside;
                                _8 = [root];
                                return [4 /*yield*/, (0, promises_1.realpath)(packagePath)];
                            case 1:
                                if (!_7.apply(void 0, _8.concat([_17.sent()])))
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                if (!expected.link) return [3 /*break*/, 2];
                                if (!expected.resolved || !inside(root, (0, node_path_1.resolve)(install, expected.resolved)))
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, read((0, node_path_1.join)(packagePath, 'package.json'))];
                            case 3:
                                if ((_17.sent()).version !== expected.version)
                                    setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                                _17.label = 4;
                            case 4:
                                if (!path.includes('node_modules/')) return [3 /*break*/, 11];
                                bin = (0, node_path_1.join)(install, path.slice(0, path.lastIndexOf('node_modules/') + 'node_modules'.length), '.bin');
                                _9 = 0, _10 = Object.entries((_5 = expected.bin) !== null && _5 !== void 0 ? _5 : {});
                                _17.label = 5;
                            case 5:
                                if (!(_9 < _10.length)) return [3 /*break*/, 11];
                                _11 = _10[_9], name_3 = _11[0], target = _11[1];
                                active();
                                _12 = !(0, git_rules_1.isFile)(name_3) || name_3.includes('/') || typeof target !== 'string';
                                if (_12) return [3 /*break*/, 7];
                                _13 = inside;
                                _14 = [root];
                                return [4 /*yield*/, (0, promises_1.realpath)((0, node_path_1.resolve)(packagePath, target))];
                            case 6:
                                _12 = !_13.apply(void 0, _14.concat([_17.sent()]));
                                _17.label = 7;
                            case 7:
                                if (_12)
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                executable = (0, node_path_1.join)(bin, process.platform === 'win32' ? name_3 + '.cmd' : name_3);
                                return [4 /*yield*/, exists(executable)];
                            case 8:
                                if (!(_17.sent()))
                                    setup(constants_1.BRANCH_TEXT.dependencyMissing);
                                _15 = inside;
                                _16 = [root];
                                return [4 /*yield*/, (0, promises_1.realpath)(executable)];
                            case 9:
                                if (!_15.apply(void 0, _16.concat([_17.sent()])))
                                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                                _17.label = 10;
                            case 10:
                                _9++;
                                return [3 /*break*/, 5];
                            case 11: return [2 /*return*/];
                        }
                    });
                };
                _p = 0, _q = Object.entries(installed.packages);
                _6.label = 29;
            case 29:
                if (!(_p < _q.length)) return [3 /*break*/, 32];
                _r = _q[_p], path = _r[0], actual = _r[1];
                return [5 /*yield**/, _loop_1(path, actual)];
            case 30:
                _6.sent();
                _6.label = 31;
            case 31:
                _p++;
                return [3 /*break*/, 29];
            case 32:
                for (_s = 0, _t = Object.entries(locked); _s < _t.length; _s++) {
                    _u = _t[_s], path = _u[0], expected = _u[1];
                    active();
                    if (path.split('/').includes('node_modules') && !expected.optional && !installed.packages[path])
                        setup(constants_1.BRANCH_TEXT.dependencyMismatch);
                }
                bins = new Set(__spreadArray([(0, node_path_1.join)(modules, '.bin')], Object.keys(installed.packages).filter(function (path) { return path.includes('node_modules/'); }).map(function (path) { return (0, node_path_1.join)(install, path.slice(0, path.lastIndexOf('node_modules/') + 'node_modules'.length), '.bin'); }), true));
                _v = 0, bins_1 = bins;
                _6.label = 33;
            case 33:
                if (!(_v < bins_1.length)) return [3 /*break*/, 41];
                bin = bins_1[_v];
                return [4 /*yield*/, exists(bin)];
            case 34:
                if (!(_6.sent()))
                    return [3 /*break*/, 40];
                _w = inside;
                _x = [root];
                return [4 /*yield*/, (0, promises_1.realpath)(bin)];
            case 35:
                if (!_w.apply(void 0, _x.concat([_6.sent()])))
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                _y = 0;
                return [4 /*yield*/, (0, promises_1.readdir)(bin)];
            case 36:
                _z = _6.sent();
                _6.label = 37;
            case 37:
                if (!(_y < _z.length)) return [3 /*break*/, 40];
                name_2 = _z[_y];
                active();
                _0 = inside;
                _1 = [root];
                return [4 /*yield*/, (0, promises_1.realpath)((0, node_path_1.join)(bin, name_2))];
            case 38:
                if (!_0.apply(void 0, _1.concat([_6.sent()])))
                    setup(constants_1.BRANCH_TEXT.dependencyUnsafe);
                _6.label = 39;
            case 39:
                _y++;
                return [3 /*break*/, 37];
            case 40:
                _v++;
                return [3 /*break*/, 33];
            case 41:
                active();
                return [3 /*break*/, 43];
            case 42:
                err_1 = _6.sent();
                active();
                if (err_1 instanceof DependencySetupRequired || err_1 instanceof CheckStopped)
                    throw err_1;
                d.log.error('Inspecting merge-check dependencies failed', err_1);
                setup(constants_1.BRANCH_TEXT.dependencyUnreadable);
                return [3 /*break*/, 43];
            case 43: return [2 /*return*/];
        }
    });
}); };
exports.inspectDependencies = inspectDependencies;
