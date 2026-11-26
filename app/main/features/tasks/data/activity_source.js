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
exports.readActivity = exports.COMMIT_ACTIVITY_LIMIT = void 0;
exports.COMMIT_ACTIVITY_LIMIT = 20;
// The step the quest is on, as saved, and its commits. Read only local refs:
// no fetch, push, or terminal process is started. A ref containing a commit is
// evidence of local tracking state, not a live remote.
var readActivity = function (host, log, path, task) { return __awaiter(void 0, void 0, void 0, function () {
    var activity, ran, _i, _a, line, _b, id, at, message, refs, err_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                activity = { step: (_c = task.step) !== null && _c !== void 0 ? _c : null, commits: [], gitUnavailable: false };
                if (task.branch === null || task.startCommit === null)
                    return [2 /*return*/, activity];
                if (!/^[\da-f]{7,64}$/i.test(task.startCommit))
                    return [2 /*return*/, __assign(__assign({}, activity), { gitUnavailable: true })];
                _d.label = 1;
            case 1:
                _d.trys.push([1, 7, , 8]);
                return [4 /*yield*/, host.run(['git', 'log', "--max-count=".concat(exports.COMMIT_ACTIVITY_LIMIT), '--format=%H%x00%cI%x00%s', '--end-of-options', "".concat(task.startCommit, "..refs/heads/").concat(task.branch), '--'], path)];
            case 2:
                ran = _d.sent();
                if (ran.exitCode !== 0)
                    throw new Error(ran.stderr);
                _i = 0, _a = ran.stdout.split('\n').filter(Boolean);
                _d.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                line = _a[_i];
                _b = line.split('\0'), id = _b[0], at = _b[1], message = _b[2];
                if (id === undefined || at === undefined || message === undefined || !/^[\da-f]{40,64}$/i.test(id) || !Number.isFinite(Date.parse(at)))
                    return [3 /*break*/, 5];
                return [4 /*yield*/, host.run(['git', 'for-each-ref', "--contains=".concat(id), '--format=%(refname)', 'refs/remotes/'], path)];
            case 4:
                refs = _d.sent();
                if (refs.exitCode !== 0)
                    log.warn("reading tracking branches failed: ".concat(refs.stderr));
                activity.commits.push({ id: id, at: at, message: message, remotes: refs.exitCode === 0 ? refs.stdout.split('\n').filter(function (ref) { return ref.startsWith('refs/remotes/') && !ref.endsWith('/HEAD'); }).map(function (ref) { return ref.slice('refs/remotes/'.length); }) : null });
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [3 /*break*/, 8];
            case 7:
                err_1 = _d.sent();
                log.error('reading quest activity from git failed', err_1);
                activity.gitUnavailable = true;
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/, activity];
        }
    });
}); };
exports.readActivity = readActivity;
