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
exports.errandState = void 0;
exports.errandFor = errandFor;
exports.giveBack = giveBack;
exports.sendErrand = sendErrand;
exports.brewNow = brewNow;
var live_1 = require("../../../../core/session/live");
var logger_1 = require("../../../../core/logger/logger");
var menu_1 = require("../../../../core/store/menu");
var effort_controller_1 = require("../../../../shared/effort/presentation/state_management/effort_controller");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var errands_1 = require("../../domain/services/errands");
// A /brew or /tea errand on its way or running. A reload starts it over.
exports.errandState = { errand: null };
// A /brew or /tea errand on its way: time goes to the project, as after a
// quick question. Answers the note Claude reads before the words.
function errandFor(p, kind, text) {
    return __awaiter(this, void 0, void 0, function () {
        var record;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, p.get('record')];
                case 1:
                    record = _b.sent();
                    exports.errandState.errand = { kind: kind, text: text, isRunning: false };
                    (_a = effort_controller_1.effortState.tracker) === null || _a === void 0 ? void 0 : _a.route('project');
                    return [2 /*return*/, (0, errands_1.errandNote)(kind, record === null ? null : (0, queue_rules_1.currentTask)(record.tasks, live_1.live.ctx))];
            }
        });
    });
}
// An errand's words that did not reach Claude go back in the prompt box as
// the command that sends them, when nothing has been typed there since;
// appended, so a box the mod can't read is never written over. Answers
// whether they went back.
function giveBack(p, command, text) {
    return __awaiter(this, void 0, void 0, function () {
        var box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.prompt.read()];
                case 1:
                    box = _a.sent();
                    if (box.text !== '')
                        return [2 /*return*/, false];
                    return [4 /*yield*/, p.prompt.fill("/".concat(command, " ").concat(text))];
                case 2: return [2 /*return*/, (_a.sent()).isFilled];
            }
        });
    });
}
// The errand's words go to Claude as Rohan's once the caller is done (a
// submit from a command's own hook would wait on it). Words that do not
// enter, refused or dropped, are not lost: Rohan is told, and they go back.
function sendErrand(p, text, command) {
    var _this = this;
    p.later(function () { return __awaiter(_this, void 0, void 0, function () {
        var failure, err_1, isBack;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    failure = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, p.prompt.send(text)];
                case 2:
                    failure = (_a = (_b.sent()).drop) !== null && _a !== void 0 ? _a : null;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _b.sent();
                    failure = err_1;
                    return [3 /*break*/, 4];
                case 4:
                    if (failure === null)
                        return [2 /*return*/];
                    exports.errandState.errand = null;
                    (0, logger_1.debug)(p, "/".concat(command, " failed"), failure);
                    return [4 /*yield*/, giveBack(p, command, text).catch(function () { return false; })];
                case 5:
                    isBack = _b.sent();
                    p.toast("Queue-tea: /".concat(command, " did not reach Claude. ").concat(isBack ? 'It is back in the prompt to send again.' : 'Send it again.'));
                    return [2 /*return*/];
            }
        });
    }); });
}
// Brew now: the /brew errand. With no command row to carry its note, the
// note goes in as a row only Claude reads. The menu closes so the answer
// shows.
function brewNow(p, text) {
    return __awaiter(this, void 0, void 0, function () {
        var request, note;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = text.trim();
                    if (request === '')
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, menu_1.closeMenu)(p)];
                case 1:
                    _a.sent();
                    if (!(0, errands_1.startsAsCommand)(request)) return [3 /*break*/, 3];
                    p.toast("Queue-tea: ".concat(errands_1.ERRAND_NOT_SENT));
                    return [4 /*yield*/, giveBack(p, 'brew', request)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, errandFor(p, 'brew', request)];
                case 4:
                    note = _a.sent();
                    return [4 /*yield*/, p.session.append(note)];
                case 5:
                    _a.sent();
                    sendErrand(p, request, 'brew');
                    return [2 /*return*/];
            }
        });
    });
}
