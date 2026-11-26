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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var definitions_1 = require("./definitions");
var setup_1 = require("./setup");
var root;
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-skills-'))];
        case 1:
            root = _a.sent();
            return [2 /*return*/];
    }
}); }); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
        case 1:
            _a.sent();
            return [2 /*return*/];
    }
}); }); });
(0, vitest_1.describe)('Codex skill setup', function () {
    (0, vitest_1.it)('installs all shared workflows, is idempotent and preserves edited skills', function () { return __awaiter(void 0, void 0, void 0, function () {
        var files, _a, _i, _b, _c, name_1, contents, _d, ours, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, setup_1.installCodexSkills)(root)];
                case 1:
                    files = _f.sent();
                    (0, vitest_1.expect)(files).toHaveLength(12);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, setup_1.installCodexSkills)(root)];
                case 2:
                    _a.apply(void 0, [_f.sent()]).toEqual([]);
                    _i = 0, _b = Object.entries((0, definitions_1.codexSkills)());
                    _f.label = 3;
                case 3:
                    if (!(_i < _b.length)) return [3 /*break*/, 6];
                    _c = _b[_i], name_1 = _c[0], contents = _c[1];
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(root, "queue-tea-".concat(name_1, "/SKILL.md")), 'utf8')];
                case 4:
                    _d.apply(void 0, [_f.sent()]).toBe(contents);
                    _f.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    ours = (0, node_path_1.join)(root, 'queue-tea-brew/SKILL.md');
                    return [4 /*yield*/, (0, promises_1.writeFile)(ours, 'My edited skill')];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, setup_1.installCodexSkills)(root)).rejects.toThrow('Keep the edited skill')];
                case 8:
                    _f.sent();
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(ours, 'utf8')];
                case 9:
                    _e.apply(void 0, [_f.sent()]).toBe('My edited skill');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a symlink rather than overwriting its target', function () { return __awaiter(void 0, void 0, void 0, function () {
        var destination, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    destination = (0, node_path_1.join)(root, 'keep.txt');
                    return [4 /*yield*/, (0, promises_1.writeFile)(destination, 'keep me')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.symlink)(destination, (0, node_path_1.join)(root, 'queue-tea-queue-tea'))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, vitest_1.expect)((0, setup_1.installCodexSkills)(root)).rejects.toThrow('Refusing to replace')];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(destination, 'utf8')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe('keep me');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps shell characters as data in per-session MCP configuration', function () {
        var path = "/tmp/a folder ' $(whoami)";
        var args = (0, setup_1.codexConfigArgs)({ command: '/Applications/Queue-tea.app/Contents/MacOS/Queue-tea', server: "".concat(path, "/server.cjs"), electron: true }, path);
        (0, vitest_1.expect)(args).toContain("mcp_servers.queue-tea.args=".concat(JSON.stringify(["".concat(path, "/server.cjs"), '--cwd', path])));
        (0, vitest_1.expect)(args).toContain('mcp_servers.queue-tea.env.ELECTRON_RUN_AS_NODE="1"');
        (0, vitest_1.expect)(args).toContain('mcp_servers.queue-tea.required=true');
        (0, vitest_1.expect)(args.join(' ')).not.toContain('approval_mode');
    });
    (0, vitest_1.it)('links available companion skills with their resources, reports missing ones and preserves destinations', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plugin, source, installed, result, destination, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    plugin = (0, node_path_1.join)(root, 'plugin');
                    source = (0, node_path_1.join)(plugin, 'skills/git-workflow-and-versioning');
                    installed = (0, node_path_1.join)(root, '.claude/plugins');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(source, 'references'), { recursive: true })];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(installed, { recursive: true })];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(installed, 'installed_plugins.json'), JSON.stringify({ plugins: { 'agent-skills@example': [{ installPath: plugin }] } }))];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(source, 'SKILL.md'), '---\nname: git-workflow-and-versioning\ndescription: Git workflow\n---\nRead references/rules.md.')];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(source, 'references/rules.md'), 'Keep the history intact.')];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, (0, setup_1.linkCompanionSkills)(root, root)];
                case 6:
                    result = _f.sent();
                    (0, vitest_1.expect)(result.linked).toContain('agent-skills:git-workflow-and-versioning');
                    (0, vitest_1.expect)(result.missing).toContain('superpowers:verification-before-completion');
                    destination = (0, node_path_1.join)(root, 'queue-tea-companion-agent-skills-git-workflow-and-versioning');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readlink)(destination)];
                case 7:
                    _a.apply(void 0, [_f.sent()]).toBe(source);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(destination, 'references/rules.md'), 'utf8')];
                case 8:
                    _b.apply(void 0, [_f.sent()]).toBe('Keep the history intact.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, setup_1.linkCompanionSkills)(root, root)];
                case 9:
                    _c.apply(void 0, [(_f.sent()).linked]).toEqual([]);
                    return [4 /*yield*/, (0, promises_1.rm)(destination)];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(destination)];
                case 11:
                    _f.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(destination, 'SKILL.md'), 'user-owned')];
                case 12:
                    _f.sent();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, setup_1.linkCompanionSkills)(root, root)];
                case 13:
                    _d.apply(void 0, [(_f.sent()).missing]).toContain('agent-skills:git-workflow-and-versioning (existing destination preserved)');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(destination, 'SKILL.md'), 'utf8')];
                case 14:
                    _e.apply(void 0, [_f.sent()]).toBe('user-owned');
                    return [2 /*return*/];
            }
        });
    }); });
});
