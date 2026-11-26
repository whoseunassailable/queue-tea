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
exports.jotIdea = void 0;
var engine_client_1 = require("../../../../core/api/engine_client");
var en_1 = require("../../../../l10n/en");
var notes_view_1 = require("../../domain/notes_view");
// Jots an idea into a realm's Inbox from a screen other than Notes, and a toast
// says how it went: Open on the note, or Try again with the same words.
var jotIdea = function (engine, workspace, key, text, onOpen) { return __awaiter(void 0, void 0, void 0, function () {
    var input, pending, answer;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                input = (0, notes_view_1.captureOf)(text);
                if (input === null)
                    return [2 /*return*/];
                workspace.say({ tone: 'info', text: en_1.t.palette.jotting, isBusy: true });
                pending = (_a = workspace.getState().toasts.at(-1)) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.createNote(key, input); })];
            case 1:
                answer = _b.sent();
                if (pending !== undefined)
                    workspace.dismiss(pending);
                if (answer.ok)
                    workspace.say({ tone: 'success', text: en_1.t.palette.jotted(input.title), action: { label: en_1.t.palette.openNote, run: function () { return onOpen(answer.data.id); } } });
                else
                    workspace.say({ tone: 'error', text: en_1.t.palette.jotFailed(input.title, answer.message), action: { label: en_1.t.failed.tryAgain, run: function () { return void (0, exports.jotIdea)(engine, workspace, key, text, onOpen); } } });
                return [2 /*return*/];
        }
    });
}); };
exports.jotIdea = jotIdea;
