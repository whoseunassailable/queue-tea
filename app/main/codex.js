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
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
var logger_1 = require("./core/logger");
var node_host_1 = require("./core/node_host");
var context_1 = require("./features/codex/data/context");
var server_1 = require("./features/codex/data/server");
var setup_1 = require("./features/codex/data/setup");
var log = (0, logger_1.createLogger)('prod', function (line) { return process.stderr.write(line); });
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var args, setup, values, allowed, i, name_1, value, home, root, files, companions, host, context, server;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                args = process.argv.slice(2);
                setup = args[0] === 'setup';
                if (setup)
                    args.shift();
                values = new Map();
                allowed = setup ? ['--skills-dir', '--home'] : ['--cwd', '--home'];
                for (i = 0; i < args.length; i += 2) {
                    name_1 = args[i];
                    value = args[i + 1];
                    if (!allowed.includes(name_1) || value === undefined || !(0, node_path_1.isAbsolute)(value) || values.has(name_1))
                        throw new Error('Use setup [--skills-dir /absolute/path], or --cwd /absolute/project [--home /absolute/home].');
                    values.set(name_1, value);
                }
                if (!setup) return [3 /*break*/, 3];
                home = (_a = values.get('--home')) !== null && _a !== void 0 ? _a : (0, node_os_1.homedir)();
                root = (_b = values.get('--skills-dir')) !== null && _b !== void 0 ? _b : (0, node_path_1.join)(home, '.agents', 'skills');
                return [4 /*yield*/, (0, setup_1.installCodexSkills)(root)];
            case 1:
                files = _e.sent();
                return [4 /*yield*/, (0, setup_1.linkCompanionSkills)(root, home)];
            case 2:
                companions = _e.sent();
                process.stdout.write("Queue-tea skills ready (".concat(files.length, " written). Configure the queue-tea MCP server, then restart Codex.\n"));
                process.stdout.write("Companion skills linked: ".concat(companions.linked.length, ". Missing: ").concat(companions.missing.join(', ') || 'none', ".\n"));
                return [2 /*return*/];
            case 3:
                host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 1, stdout: '', stderr: 'Opening URLs is not a Queue-tea MCP operation.' })];
                }); }); });
                return [4 /*yield*/, (0, context_1.loadCodexContext)(host, log, (0, node_path_1.resolve)((_c = values.get('--cwd')) !== null && _c !== void 0 ? _c : process.cwd()), (_d = values.get('--home')) !== null && _d !== void 0 ? _d : (0, node_os_1.homedir)())];
            case 4:
                context = _e.sent();
                server = (0, server_1.createCodexServer)(context, log);
                return [4 /*yield*/, server.connect(new stdio_js_1.StdioServerTransport())];
            case 5:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); };
main().catch(function (err) {
    log.error('Queue-tea Codex startup failed', err);
    process.exitCode = 1;
});
