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
exports.proposeCommit = exports.guardText = exports.commitWarning = exports.commitGuardState = void 0;
exports.pressDismissWarning = pressDismissWarning;
var logger_1 = require("../../../../core/logger/logger");
var live_1 = require("../../../../core/session/live");
var git_providers_1 = require("../../../../shared/git/git_providers");
var records_providers_1 = require("../../../../shared/records/records_providers");
var git_mode_1 = require("../../../../shared/records/domain/services/git_mode");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var records_controller_1 = require("../../../../shared/records/presentation/state_management/records_controller");
var time_1 = require("../../../../shared/time/domain/services/time");
var commit_proposal_1 = require("../../domain/services/commit_proposal");
var find_new_commits_1 = require("../../domain/usecases/find_new_commits");
var propose_commit_1 = require("../../domain/usecases/propose_commit");
var commit_guard_text_1 = require("../constants/commit_guard_text");
// The commit the running turn started on. A reload starts it over.
exports.commitGuardState = { turnHead: null };
// After a turn: names the commits that appeared during it.
var commitWarning = function (p, ctx, before) { return __awaiter(void 0, void 0, void 0, function () {
    var commits, named, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, find_new_commits_1.findNewCommits)((0, git_providers_1.gitRepositoryOf)(p, ctx), before)];
            case 1:
                commits = _a.sent();
                if (commits === null)
                    return [2 /*return*/, null];
                named = commits.length === 1 ? "a commit appeared: ".concat(commits[0]) : "".concat(commits.length, " commits appeared, newest ").concat(commits[0]);
                text = "During the last turn ".concat(named, ". Queue-tea stops Claude's commits, so check it was yours.");
                return [4 /*yield*/, p.set('warning', text)];
            case 2:
                _a.sent();
                p.toast("Queue-tea: ".concat(named));
                return [2 /*return*/, text];
        }
    });
}); };
exports.commitWarning = commitWarning;
function pressDismissWarning(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.set('warning', null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// The refusal names what Claude can do instead; with no record, the plain one.
var guardText = function (record) { return commit_guard_text_1.GUARD_TEXT[record === null ? 'manual' : (0, git_mode_1.gitModeOf)(record)]; };
exports.guardText = guardText;
// The propose_commit tool: saves Claude's proposal on the current task for
// Branches to show. Returns what Claude reads; it never throws.
var proposeCommit = function (p, input) { return __awaiter(void 0, void 0, void 0, function () {
    var ctx, record, current, checked, at, _a, proposed, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ctx = live_1.live.ctx;
                return [4 /*yield*/, p.get('record')];
            case 1:
                record = _b.sent();
                current = record === null || ctx === null ? null : (0, queue_rules_1.currentTask)(record.tasks, ctx);
                if (ctx === null || current === null)
                    return [2 /*return*/, commit_guard_text_1.PROPOSAL_TEXT.noTask];
                checked = (0, commit_proposal_1.checkProposal)(input);
                if (typeof checked === 'string')
                    return [2 /*return*/, commit_guard_text_1.PROPOSAL_TEXT.problems[checked]];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                _a = time_1.isoLocal;
                return [4 /*yield*/, p.now()];
            case 3:
                at = _a.apply(void 0, [_b.sent(), ctx.offsetMinutes]);
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)({ records: (0, records_providers_1.recordsRepositoryOf)(p, ctx), git: (0, git_providers_1.gitRepositoryOf)(p, ctx) }, current.id, checked, at)];
            case 4:
                proposed = _b.sent();
                if (proposed.kind !== 'saved')
                    return [2 /*return*/, commit_guard_text_1.PROPOSAL_TEXT[proposed.kind]];
                return [4 /*yield*/, (0, records_controller_1.applySaved)(p, ctx, proposed.record)];
            case 5:
                _b.sent();
                return [2 /*return*/, commit_guard_text_1.PROPOSAL_TEXT.saved(checked.files.length)];
            case 6:
                err_1 = _b.sent();
                (0, logger_1.debug)(p, 'saving the commit proposal failed', err_1);
                return [2 /*return*/, commit_guard_text_1.PROPOSAL_TEXT.failed];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.proposeCommit = proposeCommit;
