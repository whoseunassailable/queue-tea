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
exports.AddRealmDialog = exports.FirstRun = void 0;
var hooks_1 = require("preact/hooks");
var icon_png_1 = require("../../../../../../.claude-plugin/icon.png");
var dialog_1 = require("../../../../core/widgets/dialog");
var en_1 = require("../../../../l10n/en");
var choice_1 = require("../../../github/domain/choice");
var use_github_1 = require("../../../github/presentation/state_management/use_github");
var github_picker_1 = require("../../../github/presentation/widgets/github_picker");
var copy_line_1 = require("../../../quests/presentation/widgets/copy_line");
var COMMAND = 'queue-tea open';
var FirstRun = function (_a) {
    var onOpenFolder = _a.onOpenFolder, onCopy = _a.onCopy;
    return (<main class="first-run">
    <div class="first-run-box panel panel-pad">
      <img src={icon_png_1.default} alt="" width={120} height={120}/>
      <h1>{en_1.t.firstRun.title}</h1>
      <p>{en_1.t.firstRun.line}</p>
      <button type="button" class="btn primary" onClick={onOpenFolder}>
        {en_1.t.firstRun.open}
      </button>
      <p class="card-note">{en_1.t.firstRun.orTerminal}</p>
      <copy_line_1.CopyLine text={COMMAND} onCopy={onCopy}/>
      <p class="card-note">{en_1.t.firstRun.hint}</p>
    </div>
  </main>);
};
exports.FirstRun = FirstRun;
// Nothing is written until this is answered, GitHub included when there are
// accounts to choose from. No accounts, or no gh, doesn't hold anyone up.
var AddRealmDialog = function (_a) {
    var engine = _a.engine, pick = _a.pick, isDetected = _a.isDetected, flows = _a.flows, onAccount = _a.onAccount, onCopy = _a.onCopy, onClose = _a.onClose;
    var _b = (0, hooks_1.useState)(null), choice = _b[0], setChoice = _b[1];
    var _c = (0, hooks_1.useState)(false), isTouched = _c[0], setTouched = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    var isSending = (0, hooks_1.useRef)(false);
    var github = (0, use_github_1.useGithub)(engine, setChoice);
    var picked = (0, choice_1.pickedOf)(github.accounts, choice);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(true);
                    if (isSending.current || (0, choice_1.needsAnswer)(github.accounts, picked) || github.isSigningIn)
                        return [2 /*return*/];
                    isSending.current = true;
                    setFailure(null);
                    return [4 /*yield*/, flows.add(pick.path, isDetected)];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    if (!answer.ok) {
                        setFailure(answer.message);
                        return [2 /*return*/];
                    }
                    if (picked !== null && picked !== choice_1.NO_ACCOUNT)
                        onAccount(answer.data, picked);
                    onClose();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.addRealm.notYet(pick.name)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <p class="form-line">{en_1.t.addRealm.note}</p>
      {!pick.isRepo && <p class="form-line">{en_1.t.addRealm.noRepo}</p>}
      <github_picker_1.GithubPicker github={github} picked={picked} error={isTouched && (0, choice_1.needsAnswer)(github.accounts, picked) ? en_1.t.github.pickOne : undefined} onPick={setChoice} onCopy={onCopy}/>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.addRealm.add}
        </button>
      </div>
    </dialog_1.Dialog>);
};
exports.AddRealmDialog = AddRealmDialog;
