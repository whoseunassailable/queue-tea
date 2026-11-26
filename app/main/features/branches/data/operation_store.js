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
exports.withBranchLock = exports.operationsOf = exports.loadOperation = exports.saveOperation = exports.operationPath = void 0;
var node_crypto_1 = require("node:crypto");
var reply_1 = require("../../../core/reply");
var constants_1 = require("../domain/constants");
var git_rules_1 = require("../domain/git_rules");
var validId = function (id) { return typeof id === 'string' && /^[a-f0-9-]{36}$/.test(id); };
var operationPath = function (d, key, id) { return "".concat((0, constants_1.operationsFolder)(d.home, key), "/").concat(id); };
exports.operationPath = operationPath;
var saveOperation = function (d, op) { return __awaiter(void 0, void 0, void 0, function () {
    var file, temp, moved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = "".concat((0, exports.operationPath)(d, op.key, op.id), ".json");
                temp = "".concat(file, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
                return [4 /*yield*/, d.host.write(temp, JSON.stringify(op, null, 2))];
            case 1:
                _a.sent();
                return [4 /*yield*/, d.host.move(temp, file)];
            case 2:
                moved = _a.sent();
                if (moved.exitCode)
                    throw new Error("saving merge operation: ".concat(moved.stderr));
                return [2 /*return*/];
        }
    });
}); };
exports.saveOperation = saveOperation;
var loadOperation = function (d, key, id) { return __awaiter(void 0, void 0, void 0, function () {
    var op, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!validId(id))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                _b = (_a = JSON).parse;
                return [4 /*yield*/, d.host.read("".concat((0, exports.operationPath)(d, key, id), ".json"))];
            case 1:
                op = _b.apply(_a, [_c.sent()]);
                if (op.version !== 1 || op.key !== key || op.id !== id || !(0, git_rules_1.isBranch)(op.source) || !(0, git_rules_1.isBranch)(op.target) || !(0, git_rules_1.isOid)(op.sourceHead) || !(0, git_rules_1.isOid)(op.targetHead))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.invalid);
                return [2 /*return*/, op];
        }
    });
}); };
exports.loadOperation = loadOperation;
var operationsOf = function (d, key) { return __awaiter(void 0, void 0, void 0, function () {
    var names, ops;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, d.host.list((0, constants_1.operationsFolder)(d.home, key))];
            case 1:
                names = (_a.sent()).filter(function (n) { return validId(n.replace(/\.json$/, '')) && n.endsWith('.json'); });
                return [4 /*yield*/, Promise.all(names.map(function (n) { return (0, exports.loadOperation)(d, key, n.slice(0, -5)); }))];
            case 2:
                ops = _a.sent();
                return [2 /*return*/, ops.sort(function (a, b) { return b.created - a.created; })];
        }
    });
}); };
exports.operationsOf = operationsOf;
var inFlight = new Set();
// Directory creation is atomic across windows/processes. A crash leaves its
// owner PID; only a confirmed-dead owner can be released automatically.
var withBranchLock = function (d, key, work) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, lock, owned, made, recovery, pid, _a, _b, removed, dir;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                folder = (0, constants_1.operationsFolder)(d.home, key);
                lock = "".concat(folder, "/operation.lock");
                if (inFlight.has(folder))
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                inFlight.add(folder);
                owned = false;
                _c.label = 1;
            case 1:
                _c.trys.push([1, , 19, 23]);
                return [4 /*yield*/, d.host.makeDirs(folder)];
            case 2:
                if ((_c.sent()).exitCode)
                    throw new Error('creating integrations folder failed');
                return [4 /*yield*/, d.host.makeDir(lock)];
            case 3:
                made = _c.sent();
                if (!(made.exitCode !== 0)) return [3 /*break*/, 16];
                recovery = "".concat(folder, "/recovery.lock");
                return [4 /*yield*/, d.host.makeDir(recovery)];
            case 4:
                if ((_c.sent()).exitCode)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                _c.label = 5;
            case 5:
                _c.trys.push([5, , 12, 14]);
                pid = void 0;
                _c.label = 6;
            case 6:
                _c.trys.push([6, 8, , 9]);
                _a = Number;
                return [4 /*yield*/, d.host.read("".concat(lock, "/pid"))];
            case 7:
                pid = _a.apply(void 0, [_c.sent()]);
                return [3 /*break*/, 9];
            case 8:
                _b = _c.sent();
                throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy); /* An owner still creating its PID is live. */
            case 9:
                if (!Number.isInteger(pid) || pid <= 0)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                try {
                    process.kill(pid, 0);
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                }
                catch (err) {
                    if (err.code !== 'ESRCH')
                        throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                }
                return [4 /*yield*/, d.host.remove("".concat(lock, "/pid"))];
            case 10:
                _c.sent();
                return [4 /*yield*/, d.host.removeDir(lock)];
            case 11:
                if ((_c.sent()).exitCode)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, d.host.removeDir(recovery)];
            case 13:
                if ((_c.sent()).exitCode)
                    d.log.warn('Could not release the branch recovery lock');
                return [7 /*endfinally*/];
            case 14: return [4 /*yield*/, d.host.makeDir(lock)];
            case 15:
                made = _c.sent();
                _c.label = 16;
            case 16:
                if (made.exitCode)
                    throw new reply_1.Refusal(constants_1.BRANCH_TEXT.busy);
                owned = true;
                return [4 /*yield*/, d.host.write("".concat(lock, "/pid"), String(process.pid))];
            case 17:
                _c.sent();
                return [4 /*yield*/, work()];
            case 18: return [2 /*return*/, _c.sent()];
            case 19:
                if (!owned) return [3 /*break*/, 22];
                return [4 /*yield*/, d.host.remove("".concat(lock, "/pid"))];
            case 20:
                removed = _c.sent();
                return [4 /*yield*/, d.host.removeDir(lock)];
            case 21:
                dir = _c.sent();
                if (removed.exitCode || dir.exitCode)
                    d.log.warn('Could not release the branch operation lock');
                _c.label = 22;
            case 22:
                inFlight.delete(folder);
                return [7 /*endfinally*/];
            case 23: return [2 /*return*/];
        }
    });
}); };
exports.withBranchLock = withBranchLock;
