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
exports.DesignsPage = void 0;
var hooks_1 = require("preact/hooks");
var designs_1 = require("../../../../../shared/designs");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var read_view_1 = require("../../../../core/widgets/read_view");
var states_1 = require("../../../../core/widgets/states");
var window_width_1 = require("../../../../core/widgets/window_width");
var en_1 = require("../../../../l10n/en");
var design_forms_1 = require("../../domain/design_forms");
var design_card_1 = require("../widgets/design_card");
var design_editor_1 = require("../widgets/design_editor");
var next_version_sheet_1 = require("../widgets/next_version_sheet");
var version_rail_1 = require("../widgets/version_rail");
require("../designs.css");
// Labels a new version can't take: the folders on disk and the ones already coming.
var takenOf = function (view) { return __spreadArray(__spreadArray([], view.versions.map(function (v) { return v.folder; }), true), view.coming.map(function (c) { return (0, designs_1.folderOf)(c.label); }), true); };
// What was filed, and the way to the quest.
var FiledNote = function (_a) {
    var filed = _a.filed, onQuests = _a.onQuests;
    return (<div class="note panel dz-filed" role="status">
    <b>{filed.form.from === null ? en_1.t.designs.firstFiledTitle : en_1.t.designs.filedTitle}</b>
    <button type="button" class="link-btn" onClick={onQuests}>
      {filed.form.title.trim()} · {en_1.t.designs.queued}
    </button>
    <p class="sub">{filed.form.from === null ? en_1.t.designs.firstFiledLine : en_1.t.designs.filedLine(filed.count, filed.form.label.trim())}</p>
  </div>);
};
var EditorLoader = function (_a) {
    var engine = _a.engine, realm = _a.realm, row = _a.row, id = _a.id, version = _a.version, onBack = _a.onBack, onPrevious = _a.onPrevious, onNext = _a.onNext, onComments = _a.onComments, onCopied = _a.onCopied;
    var _b = (0, hooks_1.useState)(0), reads = _b[0], setReads = _b[1];
    var _c = (0, hooks_1.useState)({ status: 'loading' }), load = _c[0], setLoad = _c[1];
    (0, hooks_1.useEffect)(function () {
        var isCurrent = true;
        setLoad({ status: 'loading' });
        void (0, engine_client_1.ask)(engine, function () { return engine.readDesign(realm, row.folder, id); }).then(function (answer) {
            if (isCurrent)
                setLoad(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message });
        });
        return function () {
            isCurrent = false;
        };
    }, [engine, realm, row.folder, id, reads]);
    var again = function () { return setReads(function (n) { return n + 1; }); };
    var comment = function (call) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, call)];
                case 1:
                    answer = _a.sent();
                    if (answer.ok)
                        onComments(answer.data);
                    return [2 /*return*/, answer];
            }
        });
    }); };
    if (load.status === 'loading')
        return <states_1.Loading line={en_1.t.designs.readingDesign(id)}/>;
    if (load.status === 'failed')
        return <states_1.Failed message={load.message} onRetry={again}/>;
    if (load.data.kind === 'broken') {
        return (<div class="dz-page">
        <button type="button" class="link-btn" onClick={onBack}>
          {en_1.t.designs.back(row.label)}
        </button>
        <design_editor_1.Neighbours onPrevious={onPrevious} onNext={onNext}/>
        <div class="panel panel-pad">
          <design_card_1.BrokenFile title={en_1.t.designs.brokenTitle(id)} problem={load.data.problem} onRetry={again} onRestore={function () { return __awaiter(void 0, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreDesignFile(realm, row.folder, id); })];
                        case 1:
                            answer = _a.sent();
                            if (answer.ok)
                                again();
                            return [2 /*return*/, answer.ok ? null : answer.message];
                    }
                });
            }); }}/>
        </div>
      </div>);
    }
    return (<design_editor_1.DesignEditor key={reads} engine={engine} realm={realm} folder={row.folder} label={row.label} id={id} scene={load.data.scene} stamp={load.data.stamp} comments={version.comments} commentsProblem={version.commentsProblem} onBack={onBack} onPrevious={onPrevious} onNext={onNext} onReload={again} onCopied={onCopied} onAddComment={function (input) { return comment(function () { return engine.addDesignComment(realm, row.folder, input); }); }} onSetComment={function (commentId, isResolved) { return comment(function () { return engine.setDesignComment(realm, row.folder, commentId, isResolved); }); }}/>);
};
// A version's approval: who approved it and when, and the button that
// approves or withdraws it. A failure shows beside the button, which tries again.
var ApprovalRow = function (_a) {
    var engine = _a.engine, realm = _a.realm, row = _a.row, onChanged = _a.onChanged;
    var _b = (0, hooks_1.useState)({ kind: 'idle' }), state = _b[0], setState = _b[1];
    var isApproved = row.approved !== null;
    var toggle = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setState({ kind: 'saving' });
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.setDesignApproval(realm, row.folder, !isApproved); })];
                case 1:
                    answer = _a.sent();
                    setState(answer.ok ? { kind: 'idle' } : { kind: 'failed', message: answer.message });
                    if (answer.ok)
                        onChanged();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div class="dz-approval">
      <p class="sub">{row.approved !== null ? <b>{en_1.t.designs.approvedLine(row.approved.by, row.approved.at)}</b> : en_1.t.designs.notApprovedLine}</p>
      <button type="button" class="btn" disabled={state.kind === 'saving'} onClick={function () { return void toggle(); }}>
        {state.kind === 'saving' ? en_1.t.designs.approving : isApproved ? en_1.t.designs.withdrawApproval : en_1.t.designs.approve}
      </button>
      {state.kind === 'failed' && (<p class="field-error" role="alert">
          {state.message}
        </p>)}
    </div>);
};
// One version: its page of cards, or one of its designs open in the editor.
var VersionScope = function (_a) {
    var _b;
    var engine = _a.engine, realm = _a.realm, name = _a.name, row = _a.row, view = _a.view, rail = _a.rail, filed = _a.filed, onFiled = _a.onFiled, onChanged = _a.onChanged, onQuests = _a.onQuests;
    var version = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readDesignVersion(realm, row.folder); }, [realm, row.folder]);
    var _c = (0, hooks_1.useState)(null), open = _c[0], setOpen = _c[1];
    var _d = (0, hooks_1.useState)({}), names = _d[0], setNames = _d[1];
    var _e = (0, hooks_1.useState)({}), reads = _e[0], setReads = _e[1];
    var _f = (0, hooks_1.useState)(null), sheet = _f[0], setSheet = _f[1];
    var _g = (0, hooks_1.useState)(false), needComment = _g[0], setNeedComment = _g[1];
    var _h = (0, hooks_1.useState)(null), copied = _h[0], setCopied = _h[1];
    if (version.load.status !== 'ready') {
        return (<div class="dz">
        {rail}
        <read_view_1.ReadView read={version} line={en_1.t.designs.loading}>
          {function () { return null; }}
        </read_view_1.ReadView>
      </div>);
    }
    var data = version.load.data;
    var adoptComments = function (comments) {
        version.adopt(__assign(__assign({}, data), { comments: comments }));
        onChanged();
    };
    if (open !== null) {
        var at_1 = data.designs.indexOf(open);
        var stepTo = function (to) { return (at_1 >= 0 && to >= 0 && to < data.designs.length ? function () { return setOpen(data.designs[to]); } : null); };
        return (
        // Keyed by design, so moving on unmounts the editor (saving what's waiting
        // under the design left) before the next one is read.
        <EditorLoader key={open} engine={engine} realm={realm} row={row} id={open} version={data} onPrevious={stepTo(at_1 - 1)} onNext={stepTo(at_1 + 1)} onBack={function () {
                setOpen(null);
                version.refresh();
                onChanged();
            }} onComments={adoptComments} onCopied={function (designName) {
                setCopied(en_1.t.designs.savedCopy(designName));
                version.refresh();
            }}/>);
    }
    var openCount = data.comments.filter(designs_1.isOpen).length;
    var commented = new Set(data.comments.filter(designs_1.isOpen).map(function (c) { return c.design; })).size;
    var taken = takenOf(view);
    var stillReading = data.designs.some(function (id) { return reads[id] === undefined; });
    var next = (0, design_forms_1.nextFormOf)(name, { label: row.label, folder: row.folder }, data.comments, names, taken);
    return (<div class="dz">
      {rail}
      <section class="dz-main">
        {version.note !== null && (<p class="note panel" role="status">
            {version.note}
          </p>)}
        <header class="dz-head panel">
          <div>
            <h1>{row.label}</h1>
            <p class="sub">
              <b>{en_1.t.designs.by(row.by)}</b> · {en_1.t.designs.meta(row.made, row.from, data.designs.length)}
            </p>
            <ApprovalRow engine={engine} realm={realm} row={row} onChanged={onChanged}/>
          </div>
          <div class="dz-next">
            <button type="button" class="btn primary" onClick={function () {
            setNeedComment(openCount === 0);
            if (openCount > 0)
                setSheet(next);
        }}>
              {en_1.t.designs.nextVersion}
            </button>
            {needComment && openCount === 0 ? (<p class="field-error" role="alert">
                {en_1.t.designs.needComment}
              </p>) : (<p class="sub">{stillReading ? en_1.t.designs.stillReading : openCount > 0 ? en_1.t.designs.nextLine(openCount, commented, next.label) : en_1.t.designs.noOpenLine}</p>)}
          </div>
        </header>
        {filed !== null && ((_b = filed.form.from) === null || _b === void 0 ? void 0 : _b.folder) === row.folder && <FiledNote filed={filed} onQuests={onQuests}/>}
        {copied !== null && (<p class="note panel" role="status">
            {copied}
          </p>)}
        {data.designs.length === 0 && <p class="hint panel panel-pad">{en_1.t.designs.noDesigns}</p>}
        <div class="dz-cards">
          {data.designs.map(function (id) { return (<design_card_1.DesignCard key={id} engine={engine} realm={realm} folder={row.folder} id={id} comments={data.comments} onOpen={function () { return setOpen(id); }} onRead={function (design, state, found) {
                setReads(function (was) {
                    var _a;
                    return (was[design] === state ? was : __assign(__assign({}, was), (_a = {}, _a[design] = state, _a)));
                });
                if (found !== null)
                    setNames(function (was) {
                        var _a;
                        return (__assign(__assign({}, was), (_a = {}, _a[design] = found, _a)));
                    });
            }}/>); })}
        </div>
      </section>
      {sheet !== null && (<next_version_sheet_1.NextVersionSheet realm={name} first={sheet} taken={taken} comments={data.comments} names={names} uncommitted={data.uncommitted} onFile={function (form) { return __awaiter(void 0, void 0, void 0, function () {
                var fresh, labelError, filedQuest, marked;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.readDesigns(realm); })];
                        case 1:
                            fresh = _a.sent();
                            if (!fresh.ok)
                                return [2 /*return*/, { filed: fresh, marked: null }];
                            labelError = (0, design_forms_1.validateNext)(form, takenOf(fresh.data)).label;
                            if (labelError !== undefined)
                                return [2 /*return*/, { filed: { ok: false, message: labelError }, marked: null }];
                            return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.fileQuest(realm, (0, design_forms_1.questOfNext)(form)); })];
                        case 2:
                            filedQuest = _a.sent();
                            if (!filedQuest.ok || form.from === null)
                                return [2 /*return*/, { filed: filedQuest, marked: null }];
                            return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.sendDesignComments(realm, row.folder, { label: form.label.trim(), quest: form.title.trim() }); })];
                        case 3:
                            marked = _a.sent();
                            return [2 /*return*/, { filed: filedQuest, marked: marked }];
                    }
                });
            }); }} onMarkAgain={function (form) { return (0, engine_client_1.ask)(engine, function () { return engine.sendDesignComments(realm, row.folder, { label: form.label.trim(), quest: form.title.trim() }); }); }} onDone={function (form) {
                setSheet(null);
                onFiled({ form: form, count: openCount });
                version.refresh();
                onChanged();
            }} onClose={function () { return setSheet(null); }}/>)}
    </div>);
};
// A version that doesn't read, where its page would be.
var BrokenVersion = function (_a) {
    var engine = _a.engine, realm = _a.realm, row = _a.row, others = _a.others, rail = _a.rail, onChanged = _a.onChanged;
    var _b = (0, hooks_1.useState)(null), failure = _b[0], setFailure = _b[1];
    var problem = row.problem;
    return (<div class="dz">
      {rail}
      <section class="dz-main">
        <div class="panel panel-pad dz-broken" role="alert">
          <h2>{en_1.t.designs.versionBrokenTitle(row.label)}</h2>
          <p>{en_1.t.designs.versionBrokenLine(problem.detail)}</p>
          <code>{problem.file}</code>
          <p>{problem.backupAt === null ? en_1.t.designs.fixLine : "".concat(en_1.t.designs.fixLine, " ").concat(en_1.t.designs.backupLine(problem.backupAt))}</p>
          <div class="dz-broken-acts">
            <button type="button" class="btn" onClick={onChanged}>
              {en_1.t.failed.tryAgain}
            </button>
            {problem.backupAt !== null && (<button type="button" class="btn" onClick={function () { return __awaiter(void 0, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreDesignFile(realm, row.folder, 'version'); })];
                        case 1:
                            answer = _a.sent();
                            setFailure(answer.ok ? null : answer.message);
                            if (answer.ok)
                                onChanged();
                            return [2 /*return*/];
                    }
                });
            }); }}>
                {en_1.t.designs.useLastGood}
              </button>)}
          </div>
          {failure !== null && <p class="field-error">{failure}</p>}
          {others > 0 && <p class="sub">{en_1.t.designs.othersWork(others)}</p>}
        </div>
      </section>
    </div>);
};
var DesignsPage = function (_a) {
    var _b, _c, _d, _e, _f;
    var engine = _a.engine, realm = _a.realm, name = _a.name, onQuests = _a.onQuests;
    var list = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readDesigns(realm); }, [realm]);
    var _g = (0, hooks_1.useState)(null), chosen = _g[0], setChosen = _g[1];
    var _h = (0, hooks_1.useState)(null), filed = _h[0], setFiled = _h[1];
    var _j = (0, hooks_1.useState)(null), sheet = _j[0], setSheet = _j[1];
    var _k = (0, hooks_1.useState)(null), showFailure = _k[0], setShowFailure = _k[1];
    var isNarrow = (0, window_width_1.useWindowWidth)() < constants_1.DETAIL_IS_PAGE_BELOW;
    (0, hooks_1.useEffect)(function () {
        setChosen(null);
        setFiled(null);
    }, [realm]);
    // Claude or a merge may have changed docs/designs while the window was away.
    (0, hooks_1.useEffect)(function () {
        window.addEventListener('focus', list.refresh);
        return function () { return window.removeEventListener('focus', list.refresh); };
    }, [list.refresh]);
    var show = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.showDesigns(realm); })];
                case 1:
                    answer = _a.sent();
                    setShowFailure(answer.ok ? null : answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    if (list.load.status !== 'ready') {
        return (<main class="page dz-page">
        <read_view_1.ReadView read={list} line={en_1.t.designs.loading}>
          {function () { return null; }}
        </read_view_1.ReadView>
        {list.load.status === 'loading' && <p class="sub dz-where">{en_1.t.designs.loadingWhere(name)}</p>}
      </main>);
    }
    var view = list.load.data;
    // Until one is picked, the newest version that reads.
    var row = (_d = (_c = (_b = view.versions.find(function (v) { return v.folder === chosen; })) !== null && _b !== void 0 ? _b : view.versions.find(function (v) { return v.problem === null; })) !== null && _c !== void 0 ? _c : view.versions[0]) !== null && _d !== void 0 ? _d : null;
    var rail = isNarrow ? (view.versions.length > 0 && <version_rail_1.VersionMenu view={view} current={(_e = row === null || row === void 0 ? void 0 : row.folder) !== null && _e !== void 0 ? _e : null} showFailure={showFailure} onPick={setChosen} onShow={function () { return void show(); }}/>) : (<version_rail_1.VersionRail view={view} current={(_f = row === null || row === void 0 ? void 0 : row.folder) !== null && _f !== void 0 ? _f : null} showFailure={showFailure} onPick={setChosen} onShow={function () { return void show(); }}/>);
    if (row === null) {
        return (<main class={"page dz-page".concat(isNarrow ? ' narrow' : '')}>
        <div class="dz">
          {rail}
          <section class="dz-main">
            {filed !== null ? (<FiledNote filed={filed} onQuests={onQuests}/>) : (<div class="state panel">
                <h2 class="state-title">{en_1.t.designs.emptyTitle(name)}</h2>
                <p class="state-line">{en_1.t.designs.emptyLine}</p>
                <button type="button" class="btn primary" onClick={function () { return setSheet((0, design_forms_1.nextFormOf)(name, null, [], {}, view.coming.map(function (c) { return (0, designs_1.folderOf)(c.label); }))); }}>
                  {en_1.t.designs.fileDesignQuest}
                </button>
                <p class="sub">{en_1.t.designs.emptyHint}</p>
              </div>)}
          </section>
        </div>
        {sheet !== null && (<next_version_sheet_1.NextVersionSheet realm={name} first={sheet} taken={[]} comments={[]} names={{}} uncommitted={0} onFile={function (form) { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = {};
                            return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.fileQuest(realm, (0, design_forms_1.questOfNext)(form)); })];
                        case 1: return [2 /*return*/, (_a.filed = _b.sent(), _a.marked = null, _a)];
                    }
                });
            }); }} onMarkAgain={function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ ok: true, data: null })];
            }); }); }} onDone={function (form) {
                    setSheet(null);
                    setFiled({ form: form, count: 0 });
                }} onClose={function () { return setSheet(null); }}/>)}
      </main>);
    }
    return (<main class={"page dz-page".concat(isNarrow ? ' narrow' : '')}>
      {list.note !== null && (<p class="note panel" role="status">
          {list.note}
        </p>)}
      {row.problem !== null ? (<BrokenVersion engine={engine} realm={realm} row={row} others={view.versions.length - 1} rail={rail} onChanged={list.refresh}/>) : (<VersionScope key={"".concat(realm, "/").concat(row.folder)} engine={engine} realm={realm} name={name} row={row} view={view} rail={rail} filed={filed} onFiled={setFiled} onChanged={list.refresh} onQuests={onQuests}/>)}
    </main>);
};
exports.DesignsPage = DesignsPage;
