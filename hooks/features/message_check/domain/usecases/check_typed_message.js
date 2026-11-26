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
exports.checkTypedMessage = void 0;
var families_1 = require("../../../../shared/backlog/domain/services/families");
var queue_rules_1 = require("../../../../shared/records/domain/services/queue_rules");
var check_prompt_1 = require("../services/check_prompt");
// Decides what happens to a typed message: through to Claude, or held for the
// band. The intent is for the effort count.
var checkTypedMessage = function (check, ctx, record, text) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt, answer, intent, wasChecked;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                prompt = (0, check_prompt_1.checkPrompt)((0, queue_rules_1.currentTask)(record.tasks, ctx), (0, queue_rules_1.orderQueue)(record.tasks), text, (0, families_1.filingCandidates)(record), (_b = (_a = (0, families_1.activeFeature)(record)) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null, (0, families_1.loneTasks)(record));
                return [4 /*yield*/, check.check(prompt, ctx.options.checkTimeoutSeconds * 1000)];
            case 1:
                answer = _f.sent();
                if ((answer === null || answer === void 0 ? void 0 : answer.kind) === 'same' || (answer === null || answer === void 0 ? void 0 : answer.kind) === 'quick')
                    return [2 /*return*/, { kind: answer.kind, intent: answer.intent }];
                if ((answer === null || answer === void 0 ? void 0 : answer.kind) === 'new') {
                    return [2 /*return*/, {
                            kind: 'new',
                            intent: answer.intent,
                            band: __assign({ kind: 'file', text: text, title: (_c = answer.title) !== null && _c !== void 0 ? _c : text.slice(0, 60), priority: 'mid', difficulty: (_d = answer.difficulty) !== null && _d !== void 0 ? _d : 'medium', intent: answer.intent }, (0, families_1.guessParent)(record, text, answer.parent)),
                        }];
                }
                intent = (_e = answer === null || answer === void 0 ? void 0 : answer.intent) !== null && _e !== void 0 ? _e : 'improving';
                wasChecked = answer !== null;
                return [2 /*return*/, { kind: 'unsure', intent: wasChecked ? intent : null, wasChecked: wasChecked, band: { kind: 'unsure', text: text, intent: intent, didCheckRun: wasChecked } }];
        }
    });
}); };
exports.checkTypedMessage = checkTypedMessage;
