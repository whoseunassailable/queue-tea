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
exports.createCodexServer = void 0;
var mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
var zod_1 = require("zod");
var commands_1 = require("../../../../../hooks/core/session/commands");
var helpers_1 = require("../../../../../hooks/shared/records/domain/services/helpers");
var test_profile_1 = require("../../../../../hooks/shared/records/domain/services/test_profile");
var constants_1 = require("../domain/constants");
var operations_1 = require("../domain/operations");
var definitions_1 = require("./definitions");
var createCodexServer = function (context, log) {
    var server = new mcp_js_1.McpServer({ name: 'queue-tea', version: '1.0.0' }, { instructions: constants_1.CODEX_TEXT.instructions });
    var ops = (0, operations_1.codexOperations)(context);
    var run = function (work) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, err_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    _c = {};
                    _d = { type: 'text' };
                    _b = (_a = JSON).stringify;
                    return [4 /*yield*/, work()];
                case 1: return [2 /*return*/, (_c.content = [(_d.text = _b.apply(_a, [_e.sent()]), _d)], _c)];
                case 2:
                    err_1 = _e.sent();
                    log.error('Queue-tea Codex tool failed', err_1);
                    return [2 /*return*/, { isError: true, content: [{ type: 'text', text: err_1 instanceof operations_1.CodexRefusal ? err_1.message : constants_1.CODEX_TEXT.failure }] }];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var description = function (name) { return commands_1.QUEUE_TEA_COMMANDS.find(function (c) { return c.name === name; }).description; };
    var annotations = function (readOnlyHint) { return ({ readOnlyHint: readOnlyHint, destructiveHint: false, openWorldHint: false }); };
    var message = zod_1.z.string().trim().min(1).max(constants_1.CODEX_LIMITS.message);
    var taskId = zod_1.z.string().trim().min(1).max(200);
    var helper = zod_1.z.enum(helpers_1.HELPER_IDS);
    var reviewInput = zod_1.z.object({ taskId: taskId, checked: zod_1.z.string().trim().max(constants_1.CODEX_LIMITS.checked).default('') }).strict();
    server.registerTool('queue_tea', { description: 'Read Queue-tea’s current task, feature and priority queue in this folder. Use the desktop app for the interactive menu.', inputSchema: zod_1.z.object({}).strict(), annotations: annotations(true) }, function () { return run(ops.queue); });
    var _loop_1 = function (name_1) {
        server.registerTool(name_1, { description: description(name_1), inputSchema: zod_1.z.object({ request: message }).strict(), annotations: annotations(true) }, function (_a) {
            var request = _a.request;
            return run(function () { return ops.errand(name_1 === 'tea' ? 'tea' : 'brew', request); });
        });
    };
    for (var _i = 0, _a = ['brew', 'instant', 'tea']; _i < _a.length; _i++) {
        var name_1 = _a[_i];
        _loop_1(name_1);
    }
    server.registerTool('steep', { description: description('steep'), inputSchema: zod_1.z.object({ message: message, title: zod_1.z.string().trim().min(1).max(constants_1.CODEX_LIMITS.title).optional(), parentId: taskId.optional() }).strict(), annotations: annotations(false) }, function (input) { return run(function () { return ops.steep(input.message, input.title, input.parentId); }); });
    server.registerTool('feature', { description: description('feature'), inputSchema: zod_1.z.object({ args: zod_1.z.string().trim().max(constants_1.CODEX_LIMITS.title).default('') }).strict(), annotations: annotations(false) }, function (_a) {
        var args = _a.args;
        return run(function () { return ops.feature(args); });
    });
    for (var _b = 0, _c = ['done', 'task_looks_done']; _b < _c.length; _b++) {
        var name_2 = _c[_b];
        server.registerTool(name_2, { description: "".concat(description('done'), ". Supply the taskId from queue_tea. Does not finish it."), inputSchema: reviewInput, annotations: annotations(false) }, function (_a) {
            var taskId = _a.taskId, checked = _a.checked;
            return run(function () { return ops.review(taskId, checked); });
        });
    }
    server.registerTool('helper_instructions', { description: 'Read the shared instructions and companion skill names for a Queue-tea helper. Does not launch a model or mark the helper as run.', inputSchema: zod_1.z.object({ helper: helper }).strict(), annotations: annotations(true) }, function (_a) {
        var helper = _a.helper;
        return run(function () { return ({ instructions: (0, definitions_1.helperInstructions)(helper) }); });
    });
    server.registerTool('helper_finished', { description: 'Record a helper after its work has actually completed on the supplied current task. Never call for brew/instant/tea errands.', inputSchema: zod_1.z.object({ taskId: taskId, helper: helper }).strict(), annotations: annotations(false) }, function (_a) {
        var taskId = _a.taskId, helper = _a.helper;
        return run(function () { return ops.helperFinished(taskId, helper); });
    });
    server.registerTool('set_test_profile', { description: 'Record the test profile Tea-DD picked for the supplied current task, with the reason, before running its checks. Call again to move up. If Rohan chose the profile, it stands and nothing changes.', inputSchema: zod_1.z.object({ taskId: taskId, profile: zod_1.z.enum(test_profile_1.TEST_PROFILE_IDS), reason: zod_1.z.string().trim().min(1).max(constants_1.CODEX_LIMITS.reason) }).strict(), annotations: annotations(false) }, function (_a) {
        var taskId = _a.taskId, profile = _a.profile, reason = _a.reason;
        return run(function () { return ops.testProfile(taskId, { id: profile, reason: reason }); });
    });
    return server;
};
exports.createCodexServer = createCodexServer;
