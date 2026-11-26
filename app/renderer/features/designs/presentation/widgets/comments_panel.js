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
exports.CommentsPanel = void 0;
var hooks_1 = require("preact/hooks");
var designs_1 = require("../../../../../shared/designs");
var en_1 = require("../../../../l10n/en");
var design_forms_1 = require("../../domain/design_forms");
var CommentRow = function (_a) {
    var _b;
    var comment = _a.comment, names = _a.names, onSet = _a.onSet;
    var _c = (0, hooks_1.useState)(null), failure = _c[0], setFailure = _c[1];
    var set = function (isResolved) { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onSet(comment.id, isResolved)];
                case 1:
                    answer = _a.sent();
                    setFailure(answer.ok ? null : answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    var on = comment.on === null ? null : ((_b = names.get(comment.on)) !== null && _b !== void 0 ? _b : null);
    return (<li class={"dz-comment".concat((0, designs_1.isOpen)(comment) ? '' : ' done')}>
      <div class="dz-c-head">
        <span class="dz-avatar" aria-hidden="true">
          {comment.by.slice(0, 1).toUpperCase()}
        </span>
        <b>{comment.by}</b>
        <span class="sub">{en_1.t.designs.commentWhen(comment.at, Date.now())}</span>
        {comment.sentTo !== null ? (<span class="sub dz-c-act">{en_1.t.designs.sentTo(comment.sentTo)}</span>) : comment.resolved === null ? (<button type="button" class="link-btn dz-c-act" onClick={function () { return void set(true); }}>
            {en_1.t.designs.resolve}
          </button>) : (<button type="button" class="link-btn dz-c-act" onClick={function () { return void set(false); }}>
            {en_1.t.designs.reopen}
          </button>)}
      </div>
      {comment.resolved !== null && comment.sentTo === null && <p class="sub">{en_1.t.designs.resolvedOn(comment.resolved)}</p>}
      {comment.on !== null && <p class="dz-c-on">{on === null ? en_1.t.designs.onGone : en_1.t.designs.onLayer(on)}</p>}
      <p class="dz-c-text">{comment.text}</p>
      {failure !== null && (<p class="field-error" role="alert">
          {failure}
        </p>)}
    </li>);
};
// Every design's comments box: the open ones first, newest first, the rest
// folded away, and a box for a new one about the selection or the whole design.
var CommentsPanel = function (_a) {
    var scene = _a.scene, designId = _a.designId, comments = _a.comments, problem = _a.problem, about = _a.about, onAdd = _a.onAdd, onSet = _a.onSet;
    var id = (0, hooks_1.useId)();
    var _b = (0, hooks_1.useState)(''), text = _b[0], setText = _b[1];
    var _c = (0, hooks_1.useState)(undefined), error = _c[0], setError = _c[1];
    var _d = (0, hooks_1.useState)(null), failure = _d[0], setFailure = _d[1];
    var _e = (0, hooks_1.useState)(false), isWhole = _e[0], setWhole = _e[1];
    // Typed into since the last comment went: only then does leaving it check it.
    var isTouched = (0, hooks_1.useRef)(false);
    var isSending = (0, hooks_1.useRef)(false);
    // A new selection is what the next comment is about again.
    (0, hooks_1.useEffect)(function () { return setWhole(false); }, [about === null || about === void 0 ? void 0 : about.id]);
    var names = new Map((0, designs_1.layersOf)(scene.nodes).map(function (l) { return [l.id, l.name]; }));
    var newest = __spreadArray([], comments, true).sort(function (a, b) { return Date.parse(b.at) - Date.parse(a.at); });
    var open = newest.filter(designs_1.isOpen);
    var closed = newest.filter(function (c) { return !(0, designs_1.isOpen)(c); });
    var target = isWhole ? null : about;
    var submit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var wrong, answer;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event.preventDefault();
                    wrong = (0, design_forms_1.commentError)(text);
                    setError(wrong);
                    if (wrong !== undefined || isSending.current)
                        return [2 /*return*/];
                    isSending.current = true;
                    return [4 /*yield*/, onAdd({ design: designId, on: (_a = target === null || target === void 0 ? void 0 : target.id) !== null && _a !== void 0 ? _a : null, text: text.trim() })];
                case 1:
                    answer = _b.sent();
                    isSending.current = false;
                    if (answer.ok) {
                        setText('');
                        isTouched.current = false;
                        setFailure(null);
                    }
                    else
                        setFailure(answer.message);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<section class="dz-comments panel" aria-labelledby={"".concat(id, "-h")}>
      <h2 id={"".concat(id, "-h")}>
        {en_1.t.designs.commentsOn(scene.name)} <span class="sub">{en_1.t.designs.open(open.length)}</span>
      </h2>
      {open.length === 0 && closed.length === 0 && <p class="hint">{en_1.t.designs.noCommentsYet}</p>}
      <ul class="dz-c-list">
        {open.map(function (c) { return (<CommentRow key={c.id} comment={c} names={names} onSet={onSet}/>); })}
      </ul>
      {closed.length > 0 && (<details class="dz-c-fold">
          <summary>{en_1.t.designs.resolvedFold(closed.length)}</summary>
          <ul class="dz-c-list">
            {closed.map(function (c) { return (<CommentRow key={c.id} comment={c} names={names} onSet={onSet}/>); })}
          </ul>
        </details>)}
      {problem !== null ? (<p class="form-banner" role="alert">
          {problem.file}: {problem.detail} {en_1.t.designs.fixLine}
        </p>) : (<form class="dz-c-new" noValidate onSubmit={function (event) { return void submit(event); }}>
          <div class="form-field">
            <label for={id}>{en_1.t.designs.yourComment} *</label>
            <textarea id={id} class="input" rows={3} value={text} placeholder={en_1.t.designs.placeholder(scene.name)} aria-invalid={error === undefined ? undefined : 'true'} aria-describedby={error === undefined ? undefined : "".concat(id, "-error")} onInput={function (event) {
                isTouched.current = true;
                setText(event.target.value);
            }} onBlur={function () { return isTouched.current && setError((0, design_forms_1.commentError)(text)); }} onKeyDown={function (event) {
                if (event.key === 'Enter' && event.metaKey)
                    void submit(event);
            }}/>
            {error !== undefined && (<p class="field-error" id={"".concat(id, "-error")}>
                {error}
              </p>)}
          </div>
          <div class="dz-c-foot">
            {target === null ? (<span class="sub">{en_1.t.designs.aboutWhole}</span>) : (<span class="tag dz-about">
                {en_1.t.designs.about(target.name)}
                <button type="button" class="dz-about-x" aria-label={en_1.t.designs.clearAbout} onClick={function () { return setWhole(true); }}>
                  ✕
                </button>
              </span>)}
            <button type="submit" class="btn primary">
              {en_1.t.designs.addComment}
            </button>
          </div>
          {failure !== null && (<p class="form-banner" role="alert">
              {failure}
            </p>)}
        </form>)}
    </section>);
};
exports.CommentsPanel = CommentsPanel;
