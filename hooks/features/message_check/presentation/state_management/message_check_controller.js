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
exports.dropHeld = exports.sendHeld = exports.onMessage = void 0;
exports.sendAsTask = sendAsTask;
exports.sendQuick = sendQuick;
exports.cancelHeld = cancelHeld;
exports.unsureToNew = unsureToNew;
var band_queue_1 = require("../../../../core/store/band_queue");
var families_1 = require("../../../../shared/backlog/domain/services/families");
var effort_controller_1 = require("../../../../shared/effort/presentation/state_management/effort_controller");
var check_typed_message_1 = require("../../domain/usecases/check_typed_message");
var message_check_providers_1 = require("../../message_check_providers");
// Runs the check on a typed message and puts up its band, if it needs one.
var onMessage = function (p, ctx, text) { return __awaiter(void 0, void 0, void 0, function () {
    var record, verdict;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('record')];
            case 1:
                record = _a.sent();
                if (record === null)
                    return [2 /*return*/, { verdict: 'pass', intent: null, kind: null }];
                return [4 /*yield*/, p.set('isChecking', true)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _a.trys.push([3, , 5, 7]);
                return [4 /*yield*/, (0, check_typed_message_1.checkTypedMessage)((0, message_check_providers_1.checkRepositoryOf)(p), ctx, record, text)];
            case 4:
                verdict = _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, p.set('isChecking', false)];
            case 6:
                _a.sent();
                return [7 /*endfinally*/];
            case 7:
                if (!(verdict.kind === 'new')) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, band_queue_1.showBand)(p, verdict.band)];
            case 8:
                _a.sent();
                return [2 /*return*/, { verdict: 'drop', intent: verdict.intent, kind: 'new' }];
            case 9:
                if (!(verdict.kind === 'unsure')) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, band_queue_1.showBand)(p, verdict.band)];
            case 10:
                _a.sent();
                return [2 /*return*/, { verdict: 'drop', intent: verdict.intent, kind: verdict.wasChecked ? 'unsure' : null }];
            case 11: return [2 /*return*/, { verdict: 'pass', intent: verdict.intent, kind: verdict.kind }];
        }
    });
}); };
exports.onMessage = onMessage;
// Sends a held message on to Claude after all, as Rohan's own, and puts up the
// next band. Returns the message's intent for the effort count.
var sendHeld = function (p) { return __awaiter(void 0, void 0, void 0, function () {
    var band;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('band')];
            case 1:
                band = _a.sent();
                if (band.kind !== 'file' && band.kind !== 'unsure')
                    return [2 /*return*/, null];
                return [4 /*yield*/, (0, band_queue_1.closeBand)(p)];
            case 2:
                _a.sent();
                return [4 /*yield*/, p.submit(band.text, true)];
            case 3:
                _a.sent();
                return [2 /*return*/, band.intent];
        }
    });
}); };
exports.sendHeld = sendHeld;
// Drops a held message: Claude never sees it and nothing is filed. Puts up
// the next band, and returns the message so it can go back in the prompt box.
var dropHeld = function (p) { return __awaiter(void 0, void 0, void 0, function () {
    var band;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, p.get('band')];
            case 1:
                band = _a.sent();
                if (band.kind !== 'file' && band.kind !== 'unsure')
                    return [2 /*return*/, null];
                return [4 /*yield*/, (0, band_queue_1.closeBand)(p)];
            case 2:
                _a.sent();
                return [2 /*return*/, band.text];
        }
    });
}); };
exports.dropHeld = dropHeld;
function sendOn(p, to) {
    return __awaiter(this, void 0, void 0, function () {
        var band;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _c.sent();
                    if (band.kind !== 'file' && band.kind !== 'unsure')
                        return [2 /*return*/];
                    (_a = effort_controller_1.effortState.tracker) === null || _a === void 0 ? void 0 : _a.route(to);
                    if (to === 'task')
                        (_b = effort_controller_1.effortState.tracker) === null || _b === void 0 ? void 0 : _b.intent(band.intent);
                    return [4 /*yield*/, (0, exports.sendHeld)(p)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Sends a held message on to Claude after all, as the current task's. Where
// its time goes is set before it is sent, so its turn counts there.
function sendAsTask(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendOn(p, 'task')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Sends a held message on as a quick question: its time goes to the project
// and it isn't counted, as when the check answers quick.
function sendQuick(p) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendOn(p, 'project')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Cancel: the held message is neither sent nor filed. It goes back in the
// prompt box when nothing has been typed there since; appended, so a box the
// mod can't read is never written over.
function cancelHeld(p) {
    return __awaiter(this, void 0, void 0, function () {
        var text, box;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.dropHeld)(p)];
                case 1:
                    text = _a.sent();
                    if (text === null)
                        return [2 /*return*/];
                    return [4 /*yield*/, p.prompt.read()];
                case 2:
                    box = _a.sent();
                    if (!(box.text === '')) return [3 /*break*/, 4];
                    return [4 /*yield*/, p.prompt.fill(text)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function unsureToNew(p) {
    return __awaiter(this, void 0, void 0, function () {
        var band, record;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, p.get('band')];
                case 1:
                    band = _a.sent();
                    if (band.kind !== 'unsure')
                        return [2 /*return*/];
                    return [4 /*yield*/, p.get('record')];
                case 2:
                    record = _a.sent();
                    return [4 /*yield*/, p.set('band', __assign({ kind: 'file', text: band.text, title: band.text.slice(0, 60), priority: 'mid', difficulty: 'medium', intent: band.intent }, (record === null ? null : (0, families_1.guessParent)(record, band.text, null))))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
