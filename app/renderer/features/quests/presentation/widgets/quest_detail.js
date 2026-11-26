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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestDetail = void 0;
var hooks_1 = require("preact/hooks");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var format_1 = require("../../../../core/domain/format");
var attachment_input_1 = require("../../../../core/widgets/attachment_input");
var field_1 = require("../../../../core/widgets/field");
var tags_1 = require("../../../../core/widgets/tags");
var en_1 = require("../../../../l10n/en");
var states_1 = require("../../../../core/widgets/states");
var quest_form_1 = require("../../domain/quest_form");
var claude_out_1 = require("./claude_out");
var description_files_1 = require("./description_files");
var due_control_1 = require("./due_control");
var helper_toggles_1 = require("./helper_toggles");
var test_profile_control_1 = require("./test_profile_control");
var priority_control_1 = require("./priority_control");
var quest_notes_1 = require("./quest_notes");
var DIFFICULTIES = ['light', 'medium', 'hard'];
// The title, read until clicked. A field being edited keeps its text when the
// record changes underneath it.
var EditableTitle = function (_a) {
    var title = _a.title, onSave = _a.onSave;
    var _b = (0, hooks_1.useState)(null), draft = _b[0], setDraft = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    var save = function () { return __awaiter(void 0, void 0, void 0, function () {
        var problem, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (draft === null || draft.trim() === title) {
                        setDraft(null);
                        setError(undefined);
                        return [2 /*return*/];
                    }
                    if (!((_b = (0, quest_form_1.titleError)(draft)) !== null && _b !== void 0)) return [3 /*break*/, 1];
                    _a = _b;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, onSave(draft)];
                case 2:
                    _a = (_c.sent());
                    _c.label = 3;
                case 3:
                    problem = _a;
                    setError(problem);
                    if (problem === undefined)
                        setDraft(null);
                    return [2 /*return*/];
            }
        });
    }); };
    if (draft === null) {
        return (<h2 class="d-title">
        <button type="button" class="title-btn" aria-label={en_1.t.actions.editTitle(title)} onClick={function () { return setDraft(title); }}>
          {title}
        </button>
      </h2>);
    }
    return (<div onKeyDown={function (event) {
            if (event.key === 'Escape') {
                event.stopPropagation();
                setDraft(null);
                setError(undefined);
            }
        }}>
      <field_1.Field label={en_1.t.form.title} isRequired value={draft} error={error} onInput={setDraft} onBlur={function () { return void save(); }} onEnter={function () { return void save(); }}/>
    </div>);
};
// Keyed by quest, so a draft belongs to one quest and a change on disk leaves
// what's being typed alone. A file goes in at the caret while the box has
// focus, else at the end, and is saved at once.
var Description = function (_a) {
    var _b;
    var engine = _a.engine, realm = _a.realm, value = _a.value, onSave = _a.onSave;
    var _c = (0, hooks_1.useState)(null), draft = _c[0], setDraft = _c[1];
    var area = (0, hooks_1.useRef)(null);
    // The newest text, typed or sent, so a file landing before the save comes
    // back keeps it, and a batch of files keeps every link. An older save's
    // reply can land after a newer save went out, so the saved text only
    // replaces it once no save is still on its way.
    var latest = (0, hooks_1.useRef)(value !== null && value !== void 0 ? value : '');
    var saving = (0, hooks_1.useRef)(0);
    (0, hooks_1.useEffect)(function () {
        if (draft === null && saving.current === 0)
            latest.current = value !== null && value !== void 0 ? value : '';
    }, [value]);
    var save = function (text) {
        latest.current = text;
        saving.current += 1;
        void onSave(text).finally(function () { saving.current -= 1; });
    };
    var insert = function (markdown) { return __awaiter(void 0, void 0, void 0, function () {
        var text, box, from, link, next;
        return __generator(this, function (_a) {
            text = latest.current;
            box = area.current;
            if (box === null || document.activeElement !== box) {
                save((0, description_files_1.withFileLink)(text, markdown));
                setDraft(null);
                return [2 /*return*/];
            }
            from = Math.min(box.selectionStart, text.length);
            link = "".concat(from > 0 && text[from - 1] !== '\n' ? '\n' : '').concat(markdown, "\n");
            next = text.slice(0, from) + link + text.slice(Math.max(from, box.selectionEnd));
            save(next);
            setDraft(next);
            requestAnimationFrame(function () { return box.setSelectionRange(from + link.length, from + link.length); });
            return [2 /*return*/];
        });
    }); };
    var shown = (_b = draft !== null && draft !== void 0 ? draft : value) !== null && _b !== void 0 ? _b : '';
    return (<attachment_input_1.AttachmentInput engine={engine} realm={realm} id={null} onInsert={insert}>
      <textarea ref={area} class="input" rows={3} aria-label={en_1.t.detail.description} placeholder={en_1.t.detail.descriptionPlaceholder} value={shown} onInput={function (event) {
            latest.current = event.target.value;
            setDraft(latest.current);
        }} onBlur={function (event) {
            var text = event.target.value;
            if (text.trim() !== (value !== null && value !== void 0 ? value : ''))
                save(text);
            setDraft(null);
        }}/>
      <description_files_1.DescriptionFiles engine={engine} realm={realm} text={shown}/>
    </attachment_input_1.AttachmentInput>);
};
var Criteria = function (_a) {
    var lines = _a.lines, onSave = _a.onSave;
    var _b = (0, hooks_1.useState)(''), draft = _b[0], setDraft = _b[1];
    var add = function () {
        if (draft.trim() === '')
            return;
        onSave(__spreadArray(__spreadArray([], lines, true), [draft.trim()], false));
        setDraft('');
    };
    return (<>
      {lines.length > 0 && (<ul class="chapters">
          {lines.map(function (line) { return (<li key={line}>
              <span class="grow">{line}</span>
              <button type="button" class="link-btn" aria-label={en_1.t.actions.removeCriterion(line)} onClick={function () { return onSave(lines.filter(function (l) { return l !== line; })); }}>
                ×
              </button>
            </li>); })}
        </ul>)}
      <input class="input" type="text" aria-label={en_1.t.actions.addCriterion} placeholder={en_1.t.detail.criterionPlaceholder} value={draft} onInput={function (event) { return setDraft(event.target.value); }} onBlur={add} onKeyDown={function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                add();
            }
        }}/>
    </>);
};
// Read apart from the board: the pane stands without it, and its own failure
// stays on its own line.
var Facts = function (_a) {
    var _b, _c;
    var engine = _a.engine, realm = _a.realm, row = _a.row, filedOn = _a.filedOn;
    var quest = row.quest;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readQuestFacts(realm, quest.id); }, [realm, quest.id]);
    var facts = read.load.status === 'ready' ? read.load.data : null;
    var failure = read.load.status === 'failed' ? read.load.message : read.note;
    return (<>
      {facts !== null && <quest_notes_1.QuestNotes facts={facts}/>}
      {read.load.status === 'loading' && <p class="hint" role="status"><states_1.Spinner />{en_1.t.loading.stillReading}</p>}
      {failure !== null && <p class="hint" role="alert">{failure}</p>}
      <button type="button" class="link-btn" disabled={read.isRefreshing || read.load.status === 'loading'} onClick={read.load.status === 'failed' ? read.retry : read.refresh}>
        {read.isRefreshing && <states_1.Spinner />}{read.isRefreshing ? en_1.t.activity.refreshing : en_1.t.activity.refresh}
      </button>
      <dl class="facts">
        <dt>{en_1.t.detail.branch}</dt>
        <dd class="mono">{(_c = (_b = quest.branch) !== null && _b !== void 0 ? _b : facts === null || facts === void 0 ? void 0 : facts.branchToBe) !== null && _c !== void 0 ? _c : en_1.t.detail.noBranch}</dd>
        <dt>{en_1.t.detail.filed}</dt>
        <dd>{filedOn}</dd>
      </dl>
    </>);
};
var QuestDetail = function (_a) {
    var engine = _a.engine, realm = _a.realm, row = _a.row, isBusy = _a.isBusy, isActiveSaga = _a.isActiveSaga, isSaved = _a.isSaved, note = _a.note, edits = _a.edits, onStart = _a.onStart, allowance = _a.allowance, onSeal = _a.onSeal, onUnseal = _a.onUnseal, onPartOf = _a.onPartOf, onRemove = _a.onRemove, onPlayNext = _a.onPlayNext, onActiveSaga = _a.onActiveSaga;
    if (row === null) {
        return (<aside class="detail panel" aria-label={en_1.t.detail.label}>
        <p class="ph">{en_1.t.detail.pick}</p>
      </aside>);
    }
    var quest = row.quest, sagaOf = row.sagaOf;
    var isSealed = quest.sealedBecause !== null;
    var kind = isSealed ? en_1.t.detail.sealed : sagaOf !== null ? en_1.t.detail.saga : en_1.t.detail.quest;
    var saveTitle = function (title) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, edits.edit(realm, quest, { title: title })];
                case 1:
                    answer = _a.sent();
                    return [2 /*return*/, answer.ok ? undefined : answer.message];
            }
        });
    }); };
    return (<aside class="detail panel" aria-label={en_1.t.detail.label}>
      <p class="d-kind">{en_1.t.detail.onBoard(kind)}</p>
      <EditableTitle key={quest.id} title={quest.title} onSave={saveTitle}/>
      <div class="d-chips">
        <priority_control_1.PriorityControl title={quest.title} priority={quest.priority} isSaved={isSaved} onPick={function (priority) { return void edits.setPriority(realm, quest, priority); }}/>
        <select class="chip-select" aria-label={en_1.t.form.difficulty} value={quest.difficulty} onChange={function (event) { return void edits.edit(realm, quest, { difficulty: event.target.value }); }}>
          {DIFFICULTIES.map(function (difficulty) { return (<option key={difficulty} value={difficulty}>
              {en_1.t.difficulty[difficulty]}
            </option>); })}
        </select>
        <span class="d-est">~{(0, format_1.formatSpan)(quest.estimateMinutes)}</span>
      </div>
      <div class="d-reward">
        <tags_1.XpReward xp={quest.xp}/>
        <tags_1.GoldReward gold={quest.xp}/>
      </div>
      {!isSealed && <claude_out_1.ClaudeOut allowance={allowance}/>}
      <div class="q-actions">
        {!isSealed && (<button type="button" class="btn primary" disabled={isBusy} onClick={function () { return onStart('claude'); }}>
            {quest.isStar ? en_1.t.actions.startMain : en_1.t.actions.start}
          </button>)}
        {!isSealed && (<button type="button" class="btn" disabled={isBusy} onClick={function () { return onStart('codex'); }}>
            {en_1.t.actions.startCodex}
          </button>)}
        {!isSealed && (<button type="button" class="btn" onClick={onPlayNext}>
            {quest.isPlayNext ? en_1.t.actions.playNextOff : en_1.t.actions.playNext}
          </button>)}
        {isSealed ? (<button type="button" class="btn" onClick={onUnseal}>
            {en_1.t.actions.unseal}
          </button>) : (<button type="button" class="btn" onClick={onSeal}>
            {en_1.t.actions.seal}
          </button>)}
      </div>
      {note !== undefined && <p class="card-note">⚠ {note}</p>}
      <hr />
      {quest.why !== null && <p class="d-star">{en_1.t.detail.main(quest.why)}</p>}
      {isSealed && <p class="d-star">⊘ {quest.sealedBecause}</p>}
      <h3>{en_1.t.detail.description}</h3>
      <Description key={quest.id} engine={engine} realm={realm} value={quest.description} onSave={function (description) { return edits.edit(realm, quest, { description: description }); }}/>
      {quest.description === null && quest.goal !== null && (<button type="button" class="link-btn" onClick={function () { return void edits.edit(realm, quest, { description: quest.goal }); }}>
          {en_1.t.detail.useGoal}
        </button>)}
      <h3>{en_1.t.detail.criteria}</h3>
      <Criteria lines={quest.criteria} onSave={function (criteria) { return void edits.edit(realm, quest, { criteria: criteria }); }}/>
      {quest.criteria.length === 0 && quest.acceptance.length > 0 && (<button type="button" class="link-btn" onClick={function () { return void edits.edit(realm, quest, { criteria: quest.acceptance }); }}>
          {en_1.t.detail.useAcceptance(quest.acceptance.length)}
        </button>)}
      <h3>{en_1.t.helpers.label}</h3>
      <helper_toggles_1.HelperToggles on={quest.helpers} onChange={function (helpers) { return edits.edit(realm, quest, { helpers: helpers }); }}/>
      <h3>{en_1.t.testProfile.label}</h3>
      <test_profile_control_1.TestProfileControl profile={quest.testProfile} onChange={function (testProfile) { return edits.edit(realm, quest, { testProfile: testProfile }); }}/>
      <due_control_1.DueControl key={quest.id} due={quest.due} onChange={function (due) { return edits.edit(realm, quest, { due: due }); }}/>
      {sagaOf !== null && (<>
          <h3>{en_1.t.detail.chapters(sagaOf.chapters.length)}</h3>
          <ul class="chapters">
            {sagaOf.chapters.map(function (chapter) { return (<li key={chapter.id}>{chapter.title}</li>); })}
          </ul>
        </>)}
      <hr />
      <Facts key={quest.id} engine={engine} realm={realm} row={row} filedOn={(0, format_1.dayOf)(quest.created)}/>
      <div class="d-foot">
        {!row.isChapter && (<button type="button" class="link-btn" onClick={onActiveSaga}>
            {isActiveSaga ? en_1.t.actions.sagaOff : en_1.t.actions.makeSaga}
          </button>)}
        <button type="button" class="link-btn" onClick={onPartOf}>
          {en_1.t.actions.partOf}
        </button>
        <button type="button" class="link-btn danger" onClick={onRemove}>
          {en_1.t.actions.remove}
        </button>
      </div>
    </aside>);
};
exports.QuestDetail = QuestDetail;
