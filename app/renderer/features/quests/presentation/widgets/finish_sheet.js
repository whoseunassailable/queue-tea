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
exports.FinishSheet = void 0;
var hooks_1 = require("preact/hooks");
var constants_1 = require("../../../../core/constants/constants");
var format_1 = require("../../../../core/domain/format");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var quest_form_1 = require("../../domain/quest_form");
var DIFFICULTIES = ['light', 'medium', 'hard'];
var FinishSheet = function (_a) {
    var realm = _a.realm, realmPath = _a.realmPath, quest = _a.quest, logPath = _a.logPath, flows = _a.flows, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(quest.difficulty), actual = _b[0], setActual = _b[1];
    var _c = (0, hooks_1.useState)(constants_1.DEFAULT_LOG_PATH), path = _c[0], setPath = _c[1];
    var _d = (0, hooks_1.useState)(false), isTouched = _d[0], setTouched = _d[1];
    var _e = (0, hooks_1.useState)(false), isWorking = _e[0], setWorking = _e[1];
    var _f = (0, hooks_1.useState)(null), failure = _f[0], setFailure = _f[1];
    // State waits for a render, and ⌘↩ twice can land before one.
    var isSending = (0, hooks_1.useRef)(false);
    var needsPath = logPath === null;
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(true);
                    setFailure(null);
                    if (isSending.current || (needsPath && (0, quest_form_1.logPathError)(path, realmPath) !== undefined))
                        return [2 /*return*/];
                    isSending.current = true;
                    setWorking(true);
                    return [4 /*yield*/, flows.finish(realm, quest, actual, needsPath ? path.trim() : null)];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    setWorking(false);
                    if (answer.ok)
                        onClose();
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.finish.title(quest.title)} isSheet onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <p class="form-line">{en_1.t.finish.howHard}</p>
      <div class="seg" role="group" aria-label={en_1.t.finish.howHard}>
        {DIFFICULTIES.map(function (difficulty) { return (<button key={difficulty} type="button" class={difficulty === actual ? 'on' : ''} aria-pressed={difficulty === actual} onClick={function () { return setActual(difficulty); }}>
            {en_1.t.finish.option(en_1.t.difficulty[difficulty], constants_1.XP_BY_DIFFICULTY[difficulty], difficulty === quest.difficulty)}
          </button>); })}
      </div>
      <p class="card-note">{en_1.t.finish.meta((0, format_1.formatMinutes)(quest.minutes), quest.branch, quest.improvingMessages)}</p>
      {needsPath ? (<>
          <p class="form-line">{en_1.t.finish.askPath}</p>
          <field_1.Field label={en_1.t.finish.path} isRequired value={path} error={isTouched ? (0, quest_form_1.logPathError)(path, realmPath) : undefined} onInput={setPath} onBlur={function () { return setTouched(true); }} onEnter={function () { return void submit(); }}/>
          <p class="card-note">{en_1.t.finish.firstLine}</p>
        </>) : (<p class="card-note">{"".concat(en_1.t.finish.measured, " ").concat(en_1.t.finish.row(logPath))}</p>)}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn go" disabled={isWorking}>
          {isWorking && <states_1.Spinner />}
          {isWorking ? en_1.t.finish.going : en_1.t.finish.go}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.FinishSheet = FinishSheet;
