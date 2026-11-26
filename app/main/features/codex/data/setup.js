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
exports.codexConfigArgs = exports.linkCompanionSkills = exports.installCodexSkills = void 0;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var constants_1 = require("../domain/constants");
var definitions_1 = require("./definitions");
var digest = function (text) { return (0, node_crypto_1.createHash)('sha256').update(text).digest('hex'); };
var info = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promises_1.lstat)(path)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                err_1 = _a.sent();
                if (err_1.code === 'ENOENT')
                    return [2 /*return*/, null];
                throw err_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Own folders only. Never overwrite an unrelated skill, a symlink, or a skill
// the user edited after generation. The host handles and logs any failure.
var installCodexSkills = function (root) { return __awaiter(void 0, void 0, void 0, function () {
    var rootInfo, written, _i, _a, _b, name_1, contents, folder, file, owner, folderInfo, fileInfo, ownerInfo, old, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, info(root)];
            case 1:
                rootInfo = _e.sent();
                if (rootInfo !== null && (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()))
                    throw new Error('The Codex skill folder must be a real directory.');
                return [4 /*yield*/, (0, promises_1.mkdir)(root, { recursive: true })];
            case 2:
                _e.sent();
                written = [];
                _i = 0, _a = Object.entries((0, definitions_1.codexSkills)());
                _e.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 16];
                _b = _a[_i], name_1 = _b[0], contents = _b[1];
                folder = (0, node_path_1.join)(root, "queue-tea-".concat(name_1));
                file = (0, node_path_1.join)(folder, 'SKILL.md');
                owner = (0, node_path_1.join)(folder, '.queue-tea.sha256');
                return [4 /*yield*/, info(folder)];
            case 4:
                folderInfo = _e.sent();
                if (!(folderInfo === null)) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, promises_1.mkdir)(folder)];
            case 5:
                _e.sent();
                return [3 /*break*/, 12];
            case 6:
                if (!folderInfo.isDirectory() || folderInfo.isSymbolicLink())
                    throw new Error("Refusing to replace ".concat(folder));
                return [4 /*yield*/, info(file)];
            case 7:
                fileInfo = _e.sent();
                return [4 /*yield*/, info(owner)];
            case 8:
                ownerInfo = _e.sent();
                if (!(fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.isFile()) || fileInfo.isSymbolicLink() || !(ownerInfo === null || ownerInfo === void 0 ? void 0 : ownerInfo.isFile()) || ownerInfo.isSymbolicLink())
                    throw new Error("Existing skill is not owned by Queue-tea: ".concat(folder));
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 9:
                old = _e.sent();
                _c = !old.includes(constants_1.CODEX_TEXT.skillMarker);
                if (_c) return [3 /*break*/, 11];
                _d = digest(old);
                return [4 /*yield*/, (0, promises_1.readFile)(owner, 'utf8')];
            case 10:
                _c = _d !== (_e.sent()).trim();
                _e.label = 11;
            case 11:
                if (_c)
                    throw new Error("Keep the edited skill and move it out of ".concat(folder, " before retrying setup."));
                if (old === contents)
                    return [3 /*break*/, 15];
                _e.label = 12;
            case 12: return [4 /*yield*/, (0, promises_1.writeFile)(file, contents, 'utf8')];
            case 13:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(owner, digest(contents), 'utf8')];
            case 14:
                _e.sent();
                written.push(file);
                _e.label = 15;
            case 15:
                _i++;
                return [3 /*break*/, 3];
            case 16: return [2 /*return*/, written];
        }
    });
}); };
exports.installCodexSkills = installCodexSkills;
// Codex follows skill-folder symlinks. Keep third-party skills and all their
// references in their installed source folders, with no network or copying.
// Existing destinations are left alone, including links to an older install.
var linkCompanionSkills = function (root, home) { return __awaiter(void 0, void 0, void 0, function () {
    var manifest, plugins, parsed, _a, _b, linked, missing, _loop_1, _i, _c, name_2;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                manifest = (0, node_path_1.join)(home, '.claude/plugins/installed_plugins.json');
                plugins = {};
                return [4 /*yield*/, info(manifest)];
            case 1:
                if (!_e.sent()) return [3 /*break*/, 3];
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(manifest, 'utf8')];
            case 2:
                parsed = _b.apply(_a, [_e.sent()]);
                if (typeof parsed === 'object' && parsed !== null && 'plugins' in parsed && typeof parsed.plugins === 'object' && parsed.plugins !== null)
                    plugins = parsed.plugins;
                _e.label = 3;
            case 3:
                linked = [];
                missing = [];
                _loop_1 = function (name_2) {
                    var _f, plugin, skill, candidates, source, _g, candidates_1, candidate, destination, existing, _h;
                    return __generator(this, function (_j) {
                        switch (_j.label) {
                            case 0:
                                _f = name_2.split(':'), plugin = _f[0], skill = _f[1];
                                candidates = Object.entries(plugins).filter(function (_a) {
                                    var id = _a[0];
                                    return id.split('@')[0] === plugin;
                                }).flatMap(function (_a) {
                                    var entries = _a[1];
                                    return Array.isArray(entries) ? entries : [];
                                }).flatMap(function (entry) { return typeof (entry === null || entry === void 0 ? void 0 : entry.installPath) === 'string' && (0, node_path_1.isAbsolute)(entry.installPath) ? [(0, node_path_1.join)(entry.installPath, 'skills', skill)] : []; });
                                candidates.push((0, node_path_1.join)(home, '.claude/skills', skill));
                                source = null;
                                _g = 0, candidates_1 = candidates;
                                _j.label = 1;
                            case 1:
                                if (!(_g < candidates_1.length)) return [3 /*break*/, 4];
                                candidate = candidates_1[_g];
                                return [4 /*yield*/, info((0, node_path_1.join)(candidate, 'SKILL.md'))];
                            case 2:
                                if ((_d = (_j.sent())) === null || _d === void 0 ? void 0 : _d.isFile()) {
                                    source = candidate;
                                    return [3 /*break*/, 4];
                                }
                                _j.label = 3;
                            case 3:
                                _g++;
                                return [3 /*break*/, 1];
                            case 4:
                                destination = (0, node_path_1.join)(root, "queue-tea-companion-".concat(plugin, "-").concat(skill));
                                return [4 /*yield*/, info(destination)];
                            case 5:
                                existing = _j.sent();
                                if (source === null) {
                                    missing.push(name_2);
                                    return [2 /*return*/, "continue"];
                                }
                                if (!(existing !== null)) return [3 /*break*/, 8];
                                _h = !existing.isSymbolicLink();
                                if (_h) return [3 /*break*/, 7];
                                return [4 /*yield*/, (0, promises_1.readlink)(destination)];
                            case 6:
                                _h = (_j.sent()) !== source;
                                _j.label = 7;
                            case 7:
                                if (_h)
                                    missing.push("".concat(name_2, " (existing destination preserved)"));
                                return [2 /*return*/, "continue"];
                            case 8: return [4 /*yield*/, (0, promises_1.symlink)(source, destination)];
                            case 9:
                                _j.sent();
                                linked.push(name_2);
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _c = (0, definitions_1.companionSkills)();
                _e.label = 4;
            case 4:
                if (!(_i < _c.length)) return [3 /*break*/, 7];
                name_2 = _c[_i];
                return [5 /*yield**/, _loop_1(name_2)];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/, { linked: linked, missing: missing }];
        }
    });
}); };
exports.linkCompanionSkills = linkCompanionSkills;
// JSON strings are valid TOML basic strings here. The caller separately quotes
// each whole argument for the shell; no config or prompt text is executable.
var codexConfigArgs = function (runtime, cwd) {
    var entries = {
        command: runtime.command,
        args: [runtime.server, '--cwd', cwd],
        cwd: cwd,
        enabled: true,
        required: true,
    };
    return __spreadArray(__spreadArray([], Object.entries(entries).flatMap(function (_a) {
        var key = _a[0], value = _a[1];
        return ['-c', "mcp_servers.queue-tea.".concat(key, "=").concat(JSON.stringify(value))];
    }), true), (runtime.electron === true ? ['-c', 'mcp_servers.queue-tea.env.ELECTRON_RUN_AS_NODE="1"'] : []), true);
};
exports.codexConfigArgs = codexConfigArgs;
