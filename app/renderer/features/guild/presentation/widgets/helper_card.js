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
exports.HelperCard = void 0;
var hooks_1 = require("preact/hooks");
var field_1 = require("../../../../core/widgets/field");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var order_form_1 = require("../../domain/order_form");
var helper_bot_1 = require("./helper_bot");
var skillsText = function (skills) { var _a; return (skills.length > 1 ? "".concat(skills[0], " +").concat(skills.length - 1) : ((_a = skills[0]) !== null && _a !== void 0 ? _a : '')); };
// The speech bubble: what the helper says now, from waiting for an order to its answer.
var Bubble = function (_a) {
    var _b;
    var helper = _a.helper, job = _a.job, isChecking = _a.isChecking, onRetry = _a.onRetry;
    if (isChecking) {
        return (<div class="bubble" role="status">
        <p class="bubble-now">
          <states_1.Spinner />
          <span>{en_1.t.guild.checking}</span>
        </p>
      </div>);
    }
    if (job === null) {
        return (<div class="bubble idle">
        <p>{en_1.t.guild.idle[helper.id]}</p>
      </div>);
    }
    var folder = (0, order_form_1.folderName)(job.folder);
    return (<div class={"bubble ".concat(job.status)} aria-live="polite">
      <p class="bubble-order">
        <b>{en_1.t.guild.youAsked}</b> · {job.order}
      </p>
      {job.status === 'working' && (<>
          <p class="bubble-now">
            <states_1.Spinner />
            <span>{job.doing === null ? en_1.t.guild.starting : en_1.t.guild.doing(job.doing.kind, job.doing.target)}</span>
          </p>
          <p class="card-note">{en_1.t.guild.working(job.steps, folder)}</p>
        </>)}
      {job.status === 'done' && (<>
          <p class="bubble-reply">{((_b = job.reply) === null || _b === void 0 ? void 0 : _b.trim()) || en_1.t.guild.noReply}</p>
          <p class="card-note">{en_1.t.guild.done(job.steps, folder)}</p>
        </>)}
      {(job.status === 'failed' || job.status === 'stopped') && (<>
          <p class="bubble-error" role={job.status === 'failed' ? 'alert' : undefined}>
            {job.status === 'failed' ? job.error : en_1.t.guild.stopped}
          </p>
          <div>
            <button type="button" class="btn" onClick={function () { return onRetry(job); }}>
              {en_1.t.guild.tryAgain}
            </button>
          </div>
        </>)}
    </div>);
};
// One helper: a portrait that idles, works and celebrates, its bubble, and an
// order box that sends it to work in the realm picked in the sidebar.
var HelperCard = function (_a) {
    var _b;
    var helper = _a.helper, job = _a.job, isChecking = _a.isChecking, realm = _a.realm, onSend = _a.onSend, onStop = _a.onStop, onRetry = _a.onRetry, onCopy = _a.onCopy;
    var _c = (0, hooks_1.useState)(''), order = _c[0], setOrder = _c[1];
    var _d = (0, hooks_1.useState)(false), isTouched = _d[0], setTouched = _d[1];
    var _e = (0, hooks_1.useState)(null), problem = _e[0], setProblem = _e[1];
    var _f = (0, hooks_1.useState)(false), isSending = _f[0], setSending = _f[1];
    var error = isTouched ? (0, order_form_1.orderError)(order) : undefined;
    var mood = isChecking ? 'idle' : ((_b = job === null || job === void 0 ? void 0 : job.status) !== null && _b !== void 0 ? _b : 'idle');
    var send = function (key, text) { return __awaiter(void 0, void 0, void 0, function () {
        var failed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSending(true);
                    setProblem(null);
                    return [4 /*yield*/, onSend(key, text)];
                case 1:
                    failed = _a.sent();
                    setSending(false);
                    setProblem(failed);
                    return [2 /*return*/, failed === null];
            }
        });
    }); };
    var submit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setTouched(true);
                    if (realm === null || isSending || (0, order_form_1.orderError)(order) !== undefined)
                        return [2 /*return*/];
                    return [4 /*yield*/, send(realm.key, order.trim())];
                case 1:
                    if (_a.sent()) {
                        setOrder('');
                        setTouched(false);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (<article class={"member panel ".concat(helper.kind)} aria-labelledby={"".concat(helper.id, "-name")}>
      <div class="m-top">
        <span class={"portrait ".concat(mood)}>
          <helper_bot_1.HelperBot id={helper.id} mood={mood}/>
          <span class="steam" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </span>
        <div>
          <h2 class="m-name" id={"".concat(helper.id, "-name")}>
            {helper.name}
          </h2>
          <span class="m-class">{helper.role}</span> <span class={"m-state ".concat(mood)}>{en_1.t.guild.states[mood]}</span>
        </div>
      </div>
      <Bubble helper={helper} job={job} isChecking={isChecking} onRetry={function (last) { return void onRetry(last).then(setProblem); }}/>
      <p class="m-desc">{helper.summary}</p>
      <p class="card-note">
        <b>{en_1.t.guild.skills}</b> · {skillsText(helper.skills)}
      </p>
      {realm !== null && (<form class="m-order" onSubmit={function (event) { return void submit(event); }} noValidate>
          <field_1.Field label={en_1.t.guild.orderLabel(helper.name)} value={order} error={error} isRequired isLong onInput={setOrder} onBlur={function () { return setTouched(true); }}/>
          {problem !== null && (<p class="field-error" role="alert">
              {problem}
            </p>)}
          {(job === null || job === void 0 ? void 0 : job.status) !== 'working' && (<div class="m-send">
              <button type="submit" class="btn primary">
                {isSending ? en_1.t.guild.sending : en_1.t.guild.send}
              </button>
            </div>)}
        </form>)}
      {/* Outside the form: a helper at work can be stopped with no realm picked. */}
      {(job === null || job === void 0 ? void 0 : job.status) === 'working' && (<div class="m-send">
          {realm === null && problem !== null && (<p class="field-error" role="alert">
              {problem}
            </p>)}
          <button type="button" class="btn" onClick={function () { return void onStop().then(setProblem); }}>
            {en_1.t.guild.stop}
          </button>
        </div>)}
      <div class="m-call">
        <code>{helper.mention}</code>
        <button type="button" class="icon-btn" aria-label={en_1.t.guild.copy(helper.name)} onClick={function () { return onCopy(helper.mention); }}>
          ⧉
        </button>
      </div>
    </article>);
};
exports.HelperCard = HelperCard;
