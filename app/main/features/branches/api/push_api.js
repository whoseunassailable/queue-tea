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
exports.pushMerge = exports.readPush = void 0;
var reply_1 = require("../../../core/reply");
var scope_1 = require("../../tasks/api/scope");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var branch_source_1 = require("../data/branch_source");
var operation_store_1 = require("../data/operation_store");
var merge_workspace_1 = require("../data/merge_workspace");
var branch_api_1 = require("./branch_api");
// Called only by the user's Check remote action. Opening a branch never
// reaches the network, and preparing/completing a merge stays entirely local.
var preview = function (d, key, id, remote) { return __awaiter(void 0, void 0, void 0, function () {
    var scope, git, op, remotes, head, urls, url, remoteResult, remoteHead, known, _a, range, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _d.sent();
                git = (0, branch_source_1.gitIn)(d, scope.ctx.projectPath);
                return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, id)];
            case 2:
                op = _d.sent();
                if (!op.commit || op.stage !== 'merged')
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [4 /*yield*/, git(['remote'])];
            case 3:
                remotes = (_d.sent()).trim().split('\n');
                if (typeof remote !== 'string' || !remotes.includes(remote) || remote.startsWith('-'))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [4 /*yield*/, (0, branch_source_1.headOf)(d, scope.ctx.projectPath, op.target)];
            case 4:
                head = _d.sent();
                return [4 /*yield*/, (0, branch_source_1.ancestor)(d, scope.ctx.projectPath, op.commit, head)];
            case 5:
                if (!(_d.sent()))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                return [4 /*yield*/, git(['remote', 'get-url', '--push', '--all', remote])];
            case 6:
                urls = (_d.sent()).trim().split('\n');
                if (urls.length !== 1 || !urls[0])
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.multiplePush);
                url = urls[0];
                return [4 /*yield*/, git(['ls-remote', '--heads', '--', url, "refs/heads/".concat(op.target)])];
            case 7:
                remoteResult = _d.sent();
                remoteHead = remoteResult.trim().split(/\s/)[0] || null;
                if (remoteHead && !(0, git_rules_1.isOid)(remoteHead))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.push);
                if (!remoteHead) return [3 /*break*/, 9];
                return [4 /*yield*/, d.host.run(['git', 'cat-file', '-e', "".concat(remoteHead, "^{commit}")], scope.ctx.projectPath)];
            case 8:
                _a = _d.sent();
                return [3 /*break*/, 10];
            case 9:
                _a = null;
                _d.label = 10;
            case 10:
                known = _a;
                range = remoteHead && (known === null || known === void 0 ? void 0 : known.exitCode) === 0 ? "".concat(remoteHead, "..").concat(head) : "".concat(op.targetHead, "..").concat(head);
                _c = { operationId: op.id, remote: remote, branch: op.target, head: head, remoteHead: remoteHead };
                _b = git_rules_1.parseLog;
                return [4 /*yield*/, git(['log', '--format=%H%x00%P%x00%s', range, '--'])];
            case 11: return [2 /*return*/, (_c.commits = _b.apply(void 0, [_d.sent()]), _c.fingerprint = (0, branch_source_1.digest)(op.id + remote + url + head + remoteHead), _c)];
        }
    });
}); };
var readPush = function (d, key, id, remote) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.push, function () { return preview(d, key, id, remote); }); };
exports.readPush = readPush;
var pushMerge = function (d, key, input) { return (0, reply_1.reply)(d.log, constants_1.BRANCH_TEXT.push, function () { return __awaiter(void 0, void 0, void 0, function () {
    var scope, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, scope_1.scopeOf)(d, key)];
            case 1:
                scope = _a.sent();
                r = input;
                if (!r || typeof r.fingerprint !== 'string')
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [2 /*return*/, (0, operation_store_1.withBranchLock)(d, scope.key, function () { return __awaiter(void 0, void 0, void 0, function () {
                        var checked, op, result, err_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, preview(d, key, r.operationId, r.remote)];
                                case 1:
                                    checked = _b.sent();
                                    if (checked.fingerprint !== r.fingerprint)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.stale);
                                    return [4 /*yield*/, (0, operation_store_1.loadOperation)(d, scope.key, checked.operationId)
                                        // Remote inspection recovers a successful push whose reply was lost.
                                    ];
                                case 2:
                                    op = _b.sent();
                                    if (!(checked.remoteHead !== checked.head)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, (0, branch_api_1.runStep)(d, op, scope.ctx.projectPath, { kind: 'push', remote: checked.remote, branch: checked.branch, head: checked.head })];
                                case 3:
                                    result = _b.sent();
                                    if (result.exitCode !== 0)
                                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.push);
                                    _b.label = 4;
                                case 4:
                                    op.published = { remote: checked.remote, at: d.now(), commit: checked.head };
                                    return [4 /*yield*/, (0, operation_store_1.saveOperation)(d, op)
                                        // Publication has succeeded (or was acknowledged by the remote after a
                                        // lost response). An update failure must never misreport a failed push.
                                    ];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    _b.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, ((_a = d.published) === null || _a === void 0 ? void 0 : _a.call(d, scope.ctx.projectPath, checked.remote, checked.branch, checked.head))];
                                case 7:
                                    _b.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    err_1 = _b.sent();
                                    d.log.error('starting the published application update failed', err_1);
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/, (0, merge_workspace_1.workspaceOf)(d, scope.ctx.projectPath, op)];
                            }
                        });
                    }); })];
        }
    });
}); }); };
exports.pushMerge = pushMerge;
