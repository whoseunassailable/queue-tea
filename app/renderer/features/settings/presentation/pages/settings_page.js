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
exports.SettingsPage = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var dialog_1 = require("../../../../core/widgets/dialog");
var field_1 = require("../../../../core/widgets/field");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var github_accounts_1 = require("../../../github/presentation/widgets/github_accounts");
var quest_form_1 = require("../../../quests/domain/quest_form");
var SKIES = ['auto', 'morning', 'day', 'evening', 'night'];
var TERMINALS = ['terminal', 'iterm', 'vscode'];
var GIT_MODES = ['manual', 'assisted'];
var CONFIG = '/config';
var LogDialog = function (_a) {
    var _b;
    var engine = _a.engine, realm = _a.realm, onDone = _a.onDone, onClose = _a.onClose;
    var _c = (0, hooks_1.useState)((_b = realm.logPath) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_LOG_PATH), path = _c[0], setPath = _c[1];
    var _d = (0, hooks_1.useState)(false), isTouched = _d[0], setTouched = _d[1];
    var _e = (0, hooks_1.useState)(null), failure = _e[0], setFailure = _e[1];
    var isSending = (0, hooks_1.useRef)(false);
    var error = (0, quest_form_1.logPathError)(path, realm.path);
    var submit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setTouched(true);
                    setFailure(null);
                    if (isSending.current || error !== undefined)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.setTaskLog(realm.key, path.trim()); })];
                case 1:
                    answer = _a.sent();
                    isSending.current = false;
                    if (!answer.ok) {
                        setFailure(answer.message);
                        return [2 /*return*/];
                    }
                    onDone();
                    onClose();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<dialog_1.Dialog title={en_1.t.settings.logTitle(realm.name)} onCancel={onClose} onSubmit={function () { return void submit(); }}>
      {failure !== null && (<p class="form-banner" role="alert">
          {failure}
        </p>)}
      <field_1.Field label={en_1.t.finish.path} isRequired value={path} error={isTouched ? error : undefined} onInput={setPath} onBlur={function () { return setTouched(true); }} onEnter={function () { return void submit(); }}/>
      <p class="card-note">{en_1.t.settings.logInside}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {en_1.t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {en_1.t.actions.save}
        </button>
      </div>
    </dialog_1.Dialog>);
};
var Switch = function (_a) {
    var label = _a.label, isOn = _a.isOn, onToggle = _a.onToggle;
    return <button type="button" class="switch" role="switch" aria-checked={isOn} aria-label={label} onClick={onToggle}/>;
};
var Motion = function (_a) {
    var settings = _a.settings, onChange = _a.onChange;
    return (<section class="panel panel-pad" aria-labelledby="set-sky">
    <div class="sec-row">
      <h2 id="set-sky">{en_1.t.settings.sky}</h2>
    </div>
    <div class="set-row">
      <span>{en_1.t.settings.skyLabel}</span>
      <div class="seg" role="group" aria-label={en_1.t.settings.skyLabel}>
        {SKIES.map(function (sky) { return (<button key={sky} type="button" class={settings.sky === sky ? 'on' : ''} aria-pressed={settings.sky === sky} onClick={function () { return onChange({ sky: sky }); }}>
            {en_1.t.settings.skyNames[sky]}
          </button>); })}
      </div>
      <span class="sub">{en_1.t.settings.skyLine}</span>
    </div>
    <div class="set-row">
      <span>{en_1.t.settings.calm}</span>
      <Switch label={en_1.t.settings.calm} isOn={settings.isCalm} onToggle={function () { return onChange({ isCalm: !settings.isCalm }); }}/>
      <span class="sub">{en_1.t.settings.calmLine}</span>
    </div>
  </section>);
};
var FromClaude = function (_a) {
    var page = _a.page, onCopy = _a.onCopy;
    var value = function (text) { return (page.isDefault ? "".concat(text, " \u00B7 ").concat(en_1.t.settings.default) : text); };
    var options = page.options;
    var row = function (label, text) { return (<div class="set-row">
      <span>{label}</span>
      <span class="val">{value(text)}</span>
    </div>); };
    return (<section class="panel panel-pad" aria-labelledby="set-claude">
      <div class="sec-row">
        <h2 id="set-claude">{en_1.t.settings.claude}</h2>
        <span class="sec-sub">{en_1.t.settings.claudeSub}</span>
      </div>
      {row(en_1.t.settings.idle, en_1.t.settings.minutes(options.idleGapMinutes))}
      {row(en_1.t.settings.fresh, en_1.t.settings.tokens(options.freshAtTokens.toLocaleString('en-US')))}
      {row(en_1.t.settings.handoff, en_1.t.settings.percent(options.handoffAtPercent))}
      {row(en_1.t.settings.check, en_1.t.settings.seconds(options.checkTimeoutSeconds))}
      <div class="set-row">
        <span class="copy-line">
          {en_1.t.settings.fromClaude} · <code>{CONFIG}</code>
        </span>
        <button type="button" class="chip-btn" onClick={function () { return onCopy(CONFIG); }}>
          {en_1.t.settings.copyConfig}
        </button>
      </div>
    </section>);
};
var Terminals = function (_a) {
    var settings = _a.settings, onChange = _a.onChange;
    return (<section class="panel panel-pad" aria-labelledby="set-terminal">
    <div class="sec-row">
      <h2 id="set-terminal">{en_1.t.settings.terminal}</h2>
    </div>
    <div class="set-row">
      <div class="seg" role="group" aria-label={en_1.t.settings.terminal}>
        {TERMINALS.map(function (terminal) { return (<button key={terminal} type="button" class={settings.terminal === terminal ? 'on' : ''} aria-pressed={settings.terminal === terminal} onClick={function () { return onChange({ terminal: terminal }); }}>
            {en_1.t.terminal[terminal]}
          </button>); })}
      </div>
      <span class="sub">{en_1.t.settings.terminalLine}</span>
    </div>
  </section>);
};
var copyText = function (realm) {
    if (!realm.isReadable)
        return en_1.t.settings.cantRead;
    return realm.hasCopy ? en_1.t.settings.hasCopy : en_1.t.settings.noCopy;
};
// Saved as soon as it's pressed; pressing again after a failure retries.
var GitModeRow = function (_a) {
    var engine = _a.engine, realm = _a.realm, onSaved = _a.onSaved;
    var _b = (0, hooks_1.useState)(null), pending = _b[0], setPending = _b[1];
    var _c = (0, hooks_1.useState)(false), isSaving = _c[0], setSaving = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    // The reread brings the saved mode; until then the pressed one shows.
    (0, hooks_1.useEffect)(function () { return setPending(null); }, [realm.gitMode]);
    var shown = pending !== null && pending !== void 0 ? pending : realm.gitMode;
    var choose = function (mode) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isSaving || (mode === shown && failure === null))
                        return [2 /*return*/];
                    setPending(mode);
                    setSaving(true);
                    setFailure(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.setGitMode(realm.key, mode); })];
                case 1:
                    answer = _a.sent();
                    setSaving(false);
                    if (!answer.ok) {
                        setPending(null);
                        setFailure(answer.message);
                        return [2 /*return*/];
                    }
                    onSaved();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div class="set-row">
      <span>{en_1.t.settings.gitMode}</span>
      <div class="seg" role="group" aria-label={en_1.t.settings.gitMode}>
        {GIT_MODES.map(function (mode) { return (<button key={mode} type="button" class={shown === mode ? 'on' : ''} aria-pressed={shown === mode} disabled={isSaving} onClick={function () { return void choose(mode); }}>
            {en_1.t.settings.gitModes[mode]}
          </button>); })}
      </div>
      {isSaving ? (<span class="sub" role="status">
          <states_1.Spinner /> {en_1.t.settings.savingGitMode}
        </span>) : failure !== null ? (<span class="sub" role="alert">
          {failure}
        </span>) : (<span class="sub">{en_1.t.settings.gitModeLines[shown]}</span>)}
    </div>);
};
// One realm at a time, so nothing of another realm's is ever on this page.
var ThisRealm = function (_a) {
    var engine = _a.engine, realm = _a.realm, account = _a.account, onShow = _a.onShow, onEdit = _a.onEdit, onConnect = _a.onConnect, onSaved = _a.onSaved;
    return (<section class="panel panel-pad" aria-labelledby="set-realm">
    <div class="sec-row">
      <h2 id="set-realm">{en_1.t.settings.thisRealm(realm.name)}</h2>
    </div>
    <div class="set-row">
      <span>
        {en_1.t.settings.record} · <span class="mono">{realm.file}</span>
      </span>
      <button type="button" class="chip-btn" onClick={function () { return onShow(realm.key); }}>
        {en_1.t.settings.showInFinder}
      </button>
      <span class="sub">{copyText(realm)}</span>
    </div>
    {realm.isReadable && (<>
        <div class="set-row">
          <span>
            {en_1.t.settings.log} · {realm.logPath === null ? en_1.t.settings.notSet : <span class="mono">{realm.logPath}</span>}
          </span>
          <button type="button" class="chip-btn" onClick={onEdit}>
            {realm.logPath === null ? en_1.t.settings.setNow : en_1.t.settings.change}
          </button>
          {realm.logPath === null && <span class="sub">{en_1.t.settings.notSetLine}</span>}
        </div>
        <GitModeRow key={realm.key} engine={engine} realm={realm} onSaved={onSaved}/>
        <div class="set-row">
          <span>
            {en_1.t.github.question} · {account === null ? en_1.t.github.notConnected : <span class="mono">{en_1.t.github.chip(account)}</span>}
          </span>
          <button type="button" class="chip-btn" aria-label={account === null ? en_1.t.github.connectFor(realm.name) : en_1.t.github.changeFor(realm.name)} onClick={function () { return onConnect(realm); }}>
            {account === null ? en_1.t.github.connect : en_1.t.settings.change}
          </button>
        </div>
      </>)}
  </section>);
};
var Opening = function (_a) {
    var _b;
    var page = _a.page, onInstall = _a.onInstall;
    return (<section class="panel panel-pad" aria-labelledby="set-opening">
    <div class="sec-row">
      <h2 id="set-opening">{en_1.t.settings.opening}</h2>
    </div>
    <div class="set-row">
      <span class="copy-line">
        <code>queue-tea open</code> {en_1.t.settings.commandLine}
      </span>
      {page.command === null ? (<button type="button" class="chip-btn" onClick={onInstall}>
          {en_1.t.settings.install}
        </button>) : (<span class="val mono">{page.command.path}</span>)}
      {((_b = page.command) === null || _b === void 0 ? void 0 : _b.needsPath) === true && <span class="sub">{en_1.t.settings.installedPath(page.command.path)}</span>}
    </div>
    <div class="set-row">
      <span class="copy-line">
        <code>queue-tea://open?path=…</code>
      </span>
      <span class="sub">{en_1.t.settings.linkLine}</span>
    </div>
  </section>);
};
var Keyboard = function (_a) {
    var settings = _a.settings, onChange = _a.onChange;
    return (<section class="panel panel-pad" aria-labelledby="set-keys">
    <div class="sec-row">
      <h2 id="set-keys">{en_1.t.settings.keyboard}</h2>
    </div>
    <div class="set-row">
      <span>{en_1.t.settings.letters}</span>
      <Switch label={en_1.t.settings.letters} isOn={settings.letterKeys} onToggle={function () { return onChange({ letterKeys: !settings.letterKeys }); }}/>
      <span class="sub">{en_1.t.settings.lettersLine}</span>
    </div>
  </section>);
};
var SettingsPage = function (_a) {
    var engine = _a.engine, selected = _a.selected, settings = _a.settings, onChange = _a.onChange, onCopy = _a.onCopy, onShow = _a.onShow, onInstall = _a.onInstall, onConnect = _a.onConnect;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readSettingsPage(selected); }, [selected]);
    var _b = (0, hooks_1.useState)(false), isEditing = _b[0], setEditing = _b[1];
    return (<main class="page">
      <read_view_1.ReadView read={read} line={en_1.t.loading.settings}>
        {function (page) {
            var _a;
            return (<div class="set-grid">
            {page.realm !== null && <ThisRealm engine={engine} realm={page.realm} account={(_a = settings.realmAccounts[page.realm.key]) !== null && _a !== void 0 ? _a : null} onShow={onShow} onEdit={function () { return setEditing(true); }} onConnect={onConnect} onSaved={read.refresh}/>}
            <github_accounts_1.GithubAccounts engine={engine} onCopy={onCopy}/>
            <FromClaude page={page} onCopy={onCopy}/>
            <Opening page={page} onInstall={function () { return void onInstall().then(function (isDone) { return isDone && read.refresh(); }); }}/>
            {isEditing && page.realm !== null && <LogDialog engine={engine} realm={page.realm} onDone={read.refresh} onClose={function () { return setEditing(false); }}/>}
          </div>);
        }}
      </read_view_1.ReadView>
      <div class="set-grid">
        <Motion settings={settings} onChange={onChange}/>
        <Terminals settings={settings} onChange={onChange}/>
        <Keyboard settings={settings} onChange={onChange}/>
      </div>
    </main>);
};
exports.SettingsPage = SettingsPage;
