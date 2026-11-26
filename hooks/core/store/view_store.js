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
exports.getView = getView;
exports.setView = setView;
var claude_code_1 = require("claude-code");
var recordAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'record' }, null);
var loadAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'load' }, 'loading');
var loadErrorAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'loadError' }, null);
var holdAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'hold' }, null);
var bandAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'band' }, { kind: 'none' });
var isAskingDoneAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'isAskingDone' }, false);
var isChoosingNextAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'isChoosingNext' }, false);
var openRowAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'openRow' }, null);
var isCheckingAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'isChecking' }, false);
var allowanceAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'allowance' }, null);
var noticeAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'notice' }, null);
var spinAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'spin' }, 0);
var canContinueAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'canContinue' }, false);
var mismatchAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'mismatch' }, null);
var bandQueueAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'bandQueue' }, []);
var checkedAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'checked' }, null);
var busyAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'busy' }, null);
var warningAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'warning' }, null);
var blockingAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'blocking' }, null);
var budgetAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'budget' }, null);
var driftAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'drift' }, []);
var linesAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'lines' }, null);
var othersAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'others' }, []);
var menuViewAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'menuView' }, 'menu');
var isMenuOpenAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'isMenuOpen' }, false);
var isCupStillAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'isCupStill' }, false);
var parentingAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'parenting' }, null);
var openParentsAtom = (0, claude_code_1.atom)({ plugin: 'queue-tea', key: 'openParents' }, []);
// Reads one view value. Read while drawing, it redraws the reader on a change.
function getView($, key) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = key;
                    switch (_a) {
                        case 'record': return [3 /*break*/, 1];
                        case 'load': return [3 /*break*/, 3];
                        case 'loadError': return [3 /*break*/, 5];
                        case 'hold': return [3 /*break*/, 7];
                        case 'band': return [3 /*break*/, 9];
                        case 'isAskingDone': return [3 /*break*/, 11];
                        case 'isChoosingNext': return [3 /*break*/, 13];
                        case 'openRow': return [3 /*break*/, 15];
                        case 'isChecking': return [3 /*break*/, 17];
                        case 'allowance': return [3 /*break*/, 19];
                        case 'notice': return [3 /*break*/, 21];
                        case 'canContinue': return [3 /*break*/, 23];
                        case 'mismatch': return [3 /*break*/, 25];
                        case 'bandQueue': return [3 /*break*/, 27];
                        case 'checked': return [3 /*break*/, 29];
                        case 'busy': return [3 /*break*/, 31];
                        case 'warning': return [3 /*break*/, 33];
                        case 'blocking': return [3 /*break*/, 35];
                        case 'budget': return [3 /*break*/, 37];
                        case 'drift': return [3 /*break*/, 39];
                        case 'lines': return [3 /*break*/, 41];
                        case 'others': return [3 /*break*/, 43];
                        case 'menuView': return [3 /*break*/, 45];
                        case 'isMenuOpen': return [3 /*break*/, 47];
                        case 'isCupStill': return [3 /*break*/, 49];
                        case 'parenting': return [3 /*break*/, 51];
                        case 'openParents': return [3 /*break*/, 53];
                    }
                    return [3 /*break*/, 55];
                case 1: return [4 /*yield*/, (0, claude_code_1.read)($, recordAtom)];
                case 2: return [2 /*return*/, (_b.sent())];
                case 3: return [4 /*yield*/, (0, claude_code_1.read)($, loadAtom)];
                case 4: return [2 /*return*/, (_b.sent())];
                case 5: return [4 /*yield*/, (0, claude_code_1.read)($, loadErrorAtom)];
                case 6: return [2 /*return*/, (_b.sent())];
                case 7: return [4 /*yield*/, (0, claude_code_1.read)($, holdAtom)];
                case 8: return [2 /*return*/, (_b.sent())];
                case 9: return [4 /*yield*/, (0, claude_code_1.read)($, bandAtom)];
                case 10: return [2 /*return*/, (_b.sent())];
                case 11: return [4 /*yield*/, (0, claude_code_1.read)($, isAskingDoneAtom)];
                case 12: return [2 /*return*/, (_b.sent())];
                case 13: return [4 /*yield*/, (0, claude_code_1.read)($, isChoosingNextAtom)];
                case 14: return [2 /*return*/, (_b.sent())];
                case 15: return [4 /*yield*/, (0, claude_code_1.read)($, openRowAtom)];
                case 16: return [2 /*return*/, (_b.sent())];
                case 17: return [4 /*yield*/, (0, claude_code_1.read)($, isCheckingAtom)];
                case 18: return [2 /*return*/, (_b.sent())];
                case 19: return [4 /*yield*/, (0, claude_code_1.read)($, allowanceAtom)];
                case 20: return [2 /*return*/, (_b.sent())];
                case 21: return [4 /*yield*/, (0, claude_code_1.read)($, noticeAtom)];
                case 22: return [2 /*return*/, (_b.sent())];
                case 23: return [4 /*yield*/, (0, claude_code_1.read)($, canContinueAtom)];
                case 24: return [2 /*return*/, (_b.sent())];
                case 25: return [4 /*yield*/, (0, claude_code_1.read)($, mismatchAtom)];
                case 26: return [2 /*return*/, (_b.sent())];
                case 27: return [4 /*yield*/, (0, claude_code_1.read)($, bandQueueAtom)];
                case 28: return [2 /*return*/, (_b.sent())];
                case 29: return [4 /*yield*/, (0, claude_code_1.read)($, checkedAtom)];
                case 30: return [2 /*return*/, (_b.sent())];
                case 31: return [4 /*yield*/, (0, claude_code_1.read)($, busyAtom)];
                case 32: return [2 /*return*/, (_b.sent())];
                case 33: return [4 /*yield*/, (0, claude_code_1.read)($, warningAtom)];
                case 34: return [2 /*return*/, (_b.sent())];
                case 35: return [4 /*yield*/, (0, claude_code_1.read)($, blockingAtom)];
                case 36: return [2 /*return*/, (_b.sent())];
                case 37: return [4 /*yield*/, (0, claude_code_1.read)($, budgetAtom)];
                case 38: return [2 /*return*/, (_b.sent())];
                case 39: return [4 /*yield*/, (0, claude_code_1.read)($, driftAtom)];
                case 40: return [2 /*return*/, (_b.sent())];
                case 41: return [4 /*yield*/, (0, claude_code_1.read)($, linesAtom)];
                case 42: return [2 /*return*/, (_b.sent())];
                case 43: return [4 /*yield*/, (0, claude_code_1.read)($, othersAtom)];
                case 44: return [2 /*return*/, (_b.sent())];
                case 45: return [4 /*yield*/, (0, claude_code_1.read)($, menuViewAtom)];
                case 46: return [2 /*return*/, (_b.sent())];
                case 47: return [4 /*yield*/, (0, claude_code_1.read)($, isMenuOpenAtom)];
                case 48: return [2 /*return*/, (_b.sent())];
                case 49: return [4 /*yield*/, (0, claude_code_1.read)($, isCupStillAtom)];
                case 50: return [2 /*return*/, (_b.sent())];
                case 51: return [4 /*yield*/, (0, claude_code_1.read)($, parentingAtom)];
                case 52: return [2 /*return*/, (_b.sent())];
                case 53: return [4 /*yield*/, (0, claude_code_1.read)($, openParentsAtom)];
                case 54: return [2 /*return*/, (_b.sent())];
                case 55: return [4 /*yield*/, (0, claude_code_1.read)($, spinAtom)];
                case 56: return [2 /*return*/, (_b.sent())];
            }
        });
    });
}
function setView($, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var v;
        return __generator(this, function (_a) {
            v = value;
            switch (key) {
                case 'record':
                    return [2 /*return*/, (0, claude_code_1.update)($, recordAtom, function () { return v; })];
                case 'load':
                    return [2 /*return*/, (0, claude_code_1.update)($, loadAtom, function () { return v; })];
                case 'loadError':
                    return [2 /*return*/, (0, claude_code_1.update)($, loadErrorAtom, function () { return v; })];
                case 'hold':
                    return [2 /*return*/, (0, claude_code_1.update)($, holdAtom, function () { return v; })];
                case 'band':
                    return [2 /*return*/, (0, claude_code_1.update)($, bandAtom, function () { return v; })];
                case 'isAskingDone':
                    return [2 /*return*/, (0, claude_code_1.update)($, isAskingDoneAtom, function () { return v; })];
                case 'isChoosingNext':
                    return [2 /*return*/, (0, claude_code_1.update)($, isChoosingNextAtom, function () { return v; })];
                case 'openRow':
                    return [2 /*return*/, (0, claude_code_1.update)($, openRowAtom, function () { return v; })];
                case 'isChecking':
                    return [2 /*return*/, (0, claude_code_1.update)($, isCheckingAtom, function () { return v; })];
                case 'allowance':
                    return [2 /*return*/, (0, claude_code_1.update)($, allowanceAtom, function () { return v; })];
                case 'notice':
                    return [2 /*return*/, (0, claude_code_1.update)($, noticeAtom, function () { return v; })];
                case 'canContinue':
                    return [2 /*return*/, (0, claude_code_1.update)($, canContinueAtom, function () { return v; })];
                case 'mismatch':
                    return [2 /*return*/, (0, claude_code_1.update)($, mismatchAtom, function () { return v; })];
                case 'bandQueue':
                    return [2 /*return*/, (0, claude_code_1.update)($, bandQueueAtom, function () { return v; })];
                case 'checked':
                    return [2 /*return*/, (0, claude_code_1.update)($, checkedAtom, function () { return v; })];
                case 'busy':
                    return [2 /*return*/, (0, claude_code_1.update)($, busyAtom, function () { return v; })];
                case 'warning':
                    return [2 /*return*/, (0, claude_code_1.update)($, warningAtom, function () { return v; })];
                case 'blocking':
                    return [2 /*return*/, (0, claude_code_1.update)($, blockingAtom, function () { return v; })];
                case 'budget':
                    return [2 /*return*/, (0, claude_code_1.update)($, budgetAtom, function () { return v; })];
                case 'drift':
                    return [2 /*return*/, (0, claude_code_1.update)($, driftAtom, function () { return v; })];
                case 'lines':
                    return [2 /*return*/, (0, claude_code_1.update)($, linesAtom, function () { return v; })];
                case 'others':
                    return [2 /*return*/, (0, claude_code_1.update)($, othersAtom, function () { return v; })];
                case 'menuView':
                    return [2 /*return*/, (0, claude_code_1.update)($, menuViewAtom, function () { return v; })];
                case 'isMenuOpen':
                    return [2 /*return*/, (0, claude_code_1.update)($, isMenuOpenAtom, function () { return v; })];
                case 'isCupStill':
                    return [2 /*return*/, (0, claude_code_1.update)($, isCupStillAtom, function () { return v; })];
                case 'parenting':
                    return [2 /*return*/, (0, claude_code_1.update)($, parentingAtom, function () { return v; })];
                case 'openParents':
                    return [2 /*return*/, (0, claude_code_1.update)($, openParentsAtom, function () { return v; })];
                default:
                    return [2 /*return*/, (0, claude_code_1.update)($, spinAtom, function () { return v; })];
            }
            return [2 /*return*/];
        });
    });
}
