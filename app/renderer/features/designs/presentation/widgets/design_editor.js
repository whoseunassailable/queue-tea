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
exports.DesignEditor = exports.Neighbours = exports.isTyping = void 0;
var hooks_1 = require("preact/hooks");
var designs_1 = require("../../../../../shared/designs");
var engine_client_1 = require("../../../../core/api/engine_client");
var constants_1 = require("../../../../core/constants/constants");
var dialog_1 = require("../../../../core/widgets/dialog");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var window_width_1 = require("../../../../core/widgets/window_width");
var en_1 = require("../../../../l10n/en");
var history_1 = require("../../domain/history");
var scene_edits_1 = require("../../domain/scene_edits");
var use_autosave_1 = require("../state_management/use_autosave");
var comments_panel_1 = require("./comments_panel");
var inspector_1 = require("./inspector");
var scene_view_1 = require("./scene_view");
var clampZoom = function (zoom) { return Math.min(constants_1.ZOOM_RANGE.high, Math.max(constants_1.ZOOM_RANGE.low, zoom)); };
var isTyping = function (target) { return target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]') !== null; };
exports.isTyping = isTyping;
var elementOf = function (root, id) { var _a, _b; return (_b = __spreadArray([], ((_a = root === null || root === void 0 ? void 0 : root.querySelectorAll('[data-layer]')) !== null && _a !== void 0 ? _a : []), true).find(function (el) { return el.dataset.layer === id; })) !== null && _b !== void 0 ? _b : null; };
// Where the selection sits, in the parent's space; a text's height is what it
// measures on screen, since it grows with what it says.
var boxOf = function (scene, id, root) {
    var _a, _b, _c;
    if (id === scene_edits_1.DESIGN_FRAME)
        return { x: 0, y: 0, width: scene.width, height: scene.height };
    var layer = (0, scene_edits_1.layerOf)(scene, id);
    if (layer === null)
        return null;
    var height = typeof layer.height === 'number' && !(0, designs_1.isText)(layer) ? layer.height : ((_c = (_b = (_a = elementOf(root, id)) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : layer.height) !== null && _c !== void 0 ? _c : 40);
    return { x: layer.x, y: layer.y, width: layer.width, height: height };
};
var withBox = function (scene, id, box) {
    if (id === scene_edits_1.DESIGN_FRAME)
        return (0, scene_edits_1.updateLayer)(scene, id, { width: box.width, height: box.height });
    var layer = (0, scene_edits_1.layerOf)(scene, id);
    if (layer !== null && (0, designs_1.isText)(layer))
        return (0, scene_edits_1.updateLayer)(scene, id, { x: box.x, width: box.width });
    return (0, scene_edits_1.updateLayer)(scene, id, box);
};
var Selection = function (_a) {
    var _b;
    var scene = _a.scene, id = _a.id, root = _a.root;
    var _c = (0, hooks_1.useState)(0), remeasure = _c[1];
    var box = boxOf(scene, id, root);
    // A text's height is only known once it's drawn.
    (0, hooks_1.useLayoutEffect)(function () {
        var _a;
        if (id !== scene_edits_1.DESIGN_FRAME && ((_a = boxOf(scene, id, root)) === null || _a === void 0 ? void 0 : _a.height) !== (box === null || box === void 0 ? void 0 : box.height))
            remeasure(function (n) { return n + 1; });
    });
    if (box === null)
        return null;
    var at = id === scene_edits_1.DESIGN_FRAME ? { x: 0, y: 0 } : ((_b = (0, scene_edits_1.placeOf)(scene, id)) !== null && _b !== void 0 ? _b : { x: 0, y: 0 });
    var layer = id === scene_edits_1.DESIGN_FRAME ? null : (0, scene_edits_1.layerOf)(scene, id);
    return (<div class="dz-sel" style={{ left: "".concat(at.x, "px"), top: "".concat(at.y, "px"), width: "".concat(box.width, "px"), height: "".concat(box.height, "px") }}>
      {(0, scene_edits_1.handlesOf)(id, layer).map(function (handle) { return (<span key={handle} class={"dz-handle h-".concat(handle)} data-handle={handle}/>); })}
      <span class="dz-size">
        {Math.round(box.width)} × {Math.round(box.height)}
      </span>
    </div>);
};
// Typing into a text in place, in its own font, at the canvas's zoom.
var TextEdit = function (_a) {
    var layer = _a.layer, at = _a.at, onDone = _a.onDone;
    var _b = (0, hooks_1.useState)(layer.text), value = _b[0], setValue = _b[1];
    var box = (0, hooks_1.useRef)(null);
    var isDone = (0, hooks_1.useRef)(false);
    var done = function (text) {
        if (isDone.current)
            return;
        isDone.current = true;
        onDone(text);
    };
    (0, hooks_1.useLayoutEffect)(function () {
        var _a, _b;
        (_a = box.current) === null || _a === void 0 ? void 0 : _a.focus();
        (_b = box.current) === null || _b === void 0 ? void 0 : _b.select();
    }, []);
    (0, hooks_1.useLayoutEffect)(function () {
        var el = box.current;
        if (el === null)
            return;
        el.style.height = 'auto';
        el.style.height = "".concat(el.scrollHeight, "px");
    });
    return (<textarea ref={box} class="dz-textedit" aria-label={layer.name} style={__assign({ left: "".concat(at.x, "px"), top: "".concat(at.y, "px"), width: "".concat(layer.width, "px") }, (0, scene_view_1.textStyle)(layer))} value={value} onInput={function (event) { return setValue(event.target.value); }} onBlur={function () { return done(value); }} onKeyDown={function (event) {
            if (event.key === 'Escape' || (event.key === 'Enter' && event.metaKey)) {
                event.preventDefault();
                event.stopPropagation();
                done(value);
            }
        }}/>);
};
var saveLine = function (state, isWaiting) {
    if (state.kind === 'failed')
        return en_1.t.designs.saveFailed;
    if (state.kind === 'changed')
        return en_1.t.designs.changedOnDisk;
    if (state.kind === 'saving' || isWaiting)
        return en_1.t.designs.saving;
    return state.kind === 'saved' ? en_1.t.designs.savedAt(state.at) : en_1.t.designs.upToDate;
};
// The designs either side of this one, in the version's card order; off at either end.
var Neighbours = function (_a) {
    var onPrevious = _a.onPrevious, onNext = _a.onNext;
    return (<span class="dz-neighbours">
    <button type="button" class="link-btn" disabled={onPrevious === null} onClick={function () { return onPrevious === null || onPrevious === void 0 ? void 0 : onPrevious(); }}>
      {en_1.t.designs.previousDesign}
    </button>
    <button type="button" class="link-btn" disabled={onNext === null} onClick={function () { return onNext === null || onNext === void 0 ? void 0 : onNext(); }}>
      {en_1.t.designs.nextDesign}
    </button>
  </span>);
};
exports.Neighbours = Neighbours;
var DesignEditor = function (_a) {
    var _b;
    var engine = _a.engine, realm = _a.realm, folder = _a.folder, label = _a.label, id = _a.id, first = _a.scene, stamp = _a.stamp, comments = _a.comments, commentsProblem = _a.commentsProblem, onBack = _a.onBack, onPrevious = _a.onPrevious, onNext = _a.onNext, onReload = _a.onReload, onCopied = _a.onCopied, onAddComment = _a.onAddComment, onSetComment = _a.onSetComment;
    var _c = (0, hooks_1.useState)(function () { return (0, history_1.historyOf)(first); }), history = _c[0], setHistory = _c[1];
    var _d = (0, hooks_1.useState)(null), draft = _d[0], setDraft = _d[1];
    var scene = draft !== null && draft !== void 0 ? draft : history.present;
    var _e = (0, hooks_1.useState)(null), picked = _e[0], setPicked = _e[1];
    var _f = (0, hooks_1.useState)(null), editing = _f[0], setEditing = _f[1];
    var _g = (0, hooks_1.useState)({ zoom: 1, x: 32, y: 32 }), view = _g[0], setView = _g[1];
    var _h = (0, hooks_1.useState)(null), panel = _h[0], setPanel = _h[1];
    var _j = (0, hooks_1.useState)(null), dialog = _j[0], setDialog = _j[1];
    var _k = (0, hooks_1.useState)(null), copyFailure = _k[0], setCopyFailure = _k[1];
    var save = (0, use_autosave_1.useAutosave)(engine, realm, folder, id, stamp);
    var isNarrow = (0, window_width_1.useWindowWidth)() < constants_1.DETAIL_IS_PAGE_BELOW;
    var viewport = (0, hooks_1.useRef)(null);
    var stage = (0, hooks_1.useRef)(null);
    var gesture = (0, hooks_1.useRef)(null);
    var isSpace = (0, hooks_1.useRef)(false);
    // A selection undone out of the design is no selection.
    var layer = picked !== null && picked !== scene_edits_1.DESIGN_FRAME ? (0, scene_edits_1.layerOf)(scene, picked) : null;
    var selected = picked === scene_edits_1.DESIGN_FRAME || layer !== null ? picked : null;
    var change = function (next) {
        var after = (0, history_1.commit)(history, next);
        if (after === history)
            return;
        setHistory(after);
        save.schedule(after.present);
    };
    var step = function (move) {
        var after = move(history);
        if (after === history)
            return;
        setHistory(after);
        save.schedule(after.present);
    };
    (0, hooks_1.useEffect)(function () {
        if (save.state.kind === 'failed' || save.state.kind === 'changed')
            setDialog(save.state.kind);
    }, [save.state.kind]);
    var fit = function () {
        var _a;
        var box = (_a = viewport.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (box === undefined)
            return;
        var zoom = clampZoom(Math.min((box.width - 64) / scene.width, (box.height - 64) / scene.height, 1));
        setView({ zoom: zoom, x: Math.max(16, (box.width - scene.width * zoom) / 2), y: Math.max(16, (box.height - scene.height * zoom) / 2) });
    };
    (0, hooks_1.useLayoutEffect)(fit, []);
    // Zooms keeping the point under (cx, cy) still; the viewport's middle by default.
    var zoomTo = function (zoom, cx, cy) {
        var _a, _b, _c;
        var box = (_a = viewport.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var px = cx !== null && cx !== void 0 ? cx : ((_b = box === null || box === void 0 ? void 0 : box.width) !== null && _b !== void 0 ? _b : 0) / 2;
        var py = cy !== null && cy !== void 0 ? cy : ((_c = box === null || box === void 0 ? void 0 : box.height) !== null && _c !== void 0 ? _c : 0) / 2;
        setView(function (v) {
            var next = clampZoom(zoom);
            return { zoom: next, x: px - ((px - v.x) * next) / v.zoom, y: py - ((py - v.y) * next) / v.zoom };
        });
    };
    // A wheel is a pan, or a zoom with ⌘ or a pinch. It has to be able to stop
    // the page scrolling, so it can't be a passive listener.
    var latestWheel = (0, hooks_1.useRef)(function () { });
    latestWheel.current = function (event) {
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
            var box = viewport.current.getBoundingClientRect();
            zoomTo(view.zoom * Math.exp(-event.deltaY * 0.01), event.clientX - box.left, event.clientY - box.top);
        }
        else
            setView(function (v) { return (__assign(__assign({}, v), { x: v.x - event.deltaX, y: v.y - event.deltaY })); });
    };
    (0, hooks_1.useEffect)(function () {
        var el = viewport.current;
        var heard = function (event) { return latestWheel.current(event); };
        el === null || el === void 0 ? void 0 : el.addEventListener('wheel', heard, { passive: false });
        return function () { return el === null || el === void 0 ? void 0 : el.removeEventListener('wheel', heard); };
    }, []);
    (0, hooks_1.useEffect)(function () {
        var up = function (event) {
            if (event.key === ' ')
                isSpace.current = false;
        };
        window.addEventListener('keyup', up);
        return function () { return window.removeEventListener('keyup', up); };
    }, []);
    var duplicate = function () {
        if (layer === null)
            return;
        var copied = (0, scene_edits_1.duplicateLayer)(scene, layer.id);
        if (copied === null)
            return;
        change(copied.scene);
        setPicked(copied.id);
    };
    var remove = function () {
        if (layer === null)
            return;
        change((0, scene_edits_1.removeLayer)(scene, layer.id));
        setPicked((0, scene_edits_1.parentOf)(scene, layer.id));
    };
    (0, window_keys_1.useWindowKeys)(function (event) {
        var _a;
        if (document.querySelector('[role="dialog"]') !== null || (0, exports.isTyping)(event.target))
            return;
        var key = event.key.toLowerCase();
        if (event.metaKey) {
            var zoomKeys = { '=': function () { return zoomTo(view.zoom * 1.25); }, '+': function () { return zoomTo(view.zoom * 1.25); }, '-': function () { return zoomTo(view.zoom / 1.25); }, '0': function () { return zoomTo(1); } };
            if (key === 'z')
                step(event.shiftKey ? history_1.redo : history_1.undo);
            else if (key === 'd')
                duplicate();
            else if (zoomKeys[key] !== undefined)
                zoomKeys[key]();
            else
                return;
            event.preventDefault();
            return;
        }
        if (event.ctrlKey || event.altKey)
            return;
        if (event.shiftKey && event.code === 'Digit1') {
            event.preventDefault();
            fit();
            return;
        }
        // The rest act on the canvas, not on a button or a link that has focus.
        if (event.target !== viewport.current && event.target !== document.body)
            return;
        var nudge = event.shiftKey ? constants_1.NUDGE_PX.big : constants_1.NUDGE_PX.small;
        var arrows = { arrowleft: [-nudge, 0], arrowright: [nudge, 0], arrowup: [0, -nudge], arrowdown: [0, nudge] };
        if (key === ' ')
            isSpace.current = true;
        else if (key === 'tab')
            setPicked((0, scene_edits_1.stepFrom)(scene, (_a = layer === null || layer === void 0 ? void 0 : layer.id) !== null && _a !== void 0 ? _a : null, event.shiftKey));
        else if (key === 'escape')
            setPicked(layer === null ? null : (0, scene_edits_1.parentOf)(scene, layer.id));
        else if (key === 'enter' && layer !== null && (0, designs_1.isText)(layer))
            setEditing(layer.id);
        else if ((key === 'backspace' || key === 'delete') && layer !== null)
            remove();
        else if (arrows[key] !== undefined && layer !== null)
            change(scene_edits_1.moveBy.apply(void 0, __spreadArray([scene, layer.id], arrows[key], false)));
        else
            return;
        event.preventDefault();
    });
    var onPointerDown = function (event) {
        var _a, _b, _c, _d, _e;
        if (event.button !== 0 && event.button !== 1)
            return;
        (_a = viewport.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
        var target = event.target;
        var capture = function () { var _a, _b; return (_b = (_a = viewport.current) === null || _a === void 0 ? void 0 : _a.setPointerCapture) === null || _b === void 0 ? void 0 : _b.call(_a, event.pointerId); };
        if (isSpace.current || event.button === 1) {
            gesture.current = { kind: 'pan', cx: event.clientX, cy: event.clientY, x: view.x, y: view.y };
            capture();
            return;
        }
        var handle = (_b = target.closest('[data-handle]')) === null || _b === void 0 ? void 0 : _b.dataset.handle;
        var box = selected === null ? null : boxOf(scene, selected, stage.current);
        if (handle !== undefined && selected !== null && box !== null) {
            gesture.current = { kind: 'resize', id: selected, handle: handle, cx: event.clientX, cy: event.clientY, start: scene, box: box };
            capture();
            return;
        }
        var hit = (_c = target.closest('[data-layer]')) === null || _c === void 0 ? void 0 : _c.dataset.layer;
        if (hit !== undefined) {
            // Inside what's selected, the selection moves; double-click goes deeper.
            var path = (_e = (_d = (0, scene_edits_1.pathTo)(scene.nodes, hit)) === null || _d === void 0 ? void 0 : _d.map(function (l) { return l.id; })) !== null && _e !== void 0 ? _e : [];
            var moving = selected !== null && path.includes(selected) ? selected : hit;
            setPicked(moving);
            gesture.current = { kind: 'move', id: moving, cx: event.clientX, cy: event.clientY, start: scene, moved: false };
            capture();
            return;
        }
        setPicked(target.closest('.dz-scene, .dz-frame-name') !== null ? scene_edits_1.DESIGN_FRAME : null);
    };
    var onPointerMove = function (event) {
        var g = gesture.current;
        if (g === null)
            return;
        if (g.kind === 'pan') {
            setView(function (v) { return (__assign(__assign({}, v), { x: g.x + event.clientX - g.cx, y: g.y + event.clientY - g.cy })); });
            return;
        }
        var dx = (event.clientX - g.cx) / view.zoom;
        var dy = (event.clientY - g.cy) / view.zoom;
        if (g.kind === 'move') {
            if (!g.moved && Math.hypot(event.clientX - g.cx, event.clientY - g.cy) < constants_1.DRAG_SLOP_PX)
                return;
            g.moved = true;
            setDraft((0, scene_edits_1.moveBy)(g.start, g.id, dx, dy));
        }
        else
            setDraft(withBox(g.start, g.id, (0, scene_edits_1.resizeBox)(g.box, g.handle, dx, dy, event.shiftKey)));
    };
    var onPointerUp = function () {
        gesture.current = null;
        if (draft !== null)
            change(draft);
        setDraft(null);
    };
    var onDoubleClick = function (event) {
        var _a, _b;
        // The first click captured the pointer, so the event's target is the
        // canvas: what's under the pointer is the layer that was clicked.
        var under = (_a = document.elementFromPoint(event.clientX, event.clientY)) !== null && _a !== void 0 ? _a : event.target;
        var hit = (_b = under.closest('[data-layer]')) === null || _b === void 0 ? void 0 : _b.dataset.layer;
        if (hit === undefined)
            return;
        setPicked(hit);
        var found = (0, scene_edits_1.layerOf)(scene, hit);
        if (found !== null && (0, designs_1.isText)(found))
            setEditing(hit);
    };
    var editingLayer = editing === null ? null : (0, scene_edits_1.layerOf)(scene, editing);
    var saveMine = function () { return __awaiter(void 0, void 0, void 0, function () {
        var answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCopyFailure(null);
                    return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.saveDesignCopy(realm, folder, id, history.present); })];
                case 1:
                    answer = _a.sent();
                    if (!answer.ok) {
                        setCopyFailure(answer.message);
                        return [2 /*return*/];
                    }
                    onCopied(history.present.name);
                    onReload();
                    return [2 /*return*/];
            }
        });
    }); };
    var ownComments = comments.filter(function (c) { return c.design === id; });
    var open = ownComments.filter(function (c) { return c.resolved === null && c.sentTo === null; }).length;
    var inspector = <inspector_1.Inspector scene={scene} selected={selected} onChange={function (patch) { return selected !== null && change((0, scene_edits_1.updateLayer)(scene, selected, patch)); }} onDuplicate={duplicate} onRemove={remove}/>;
    var commentsPanel = <comments_panel_1.CommentsPanel scene={scene} designId={id} comments={ownComments} problem={commentsProblem} about={layer} onAdd={onAddComment} onSet={onSetComment}/>;
    return (<div class={"dz-editor".concat(isNarrow ? ' narrow' : '')}>
      <div class="dz-ed-top panel">
        <button type="button" class="link-btn" onClick={onBack}>
          {en_1.t.designs.back(label)}
        </button>
        <exports.Neighbours onPrevious={onPrevious} onNext={onNext}/>
        <h1>{scene.name}</h1>
        <button type="button" class={"dz-save s-".concat(save.state.kind)} onClick={function () { return (save.state.kind === 'failed' || save.state.kind === 'changed') && setDialog(save.state.kind); }} aria-live="polite">
          {saveLine(save.state, save.hasPending())}
        </button>
        <span class="dz-tools">
          <button type="button" class="icon-btn" aria-label={en_1.t.designs.undo} disabled={history.past.length === 0} onClick={function () { return step(history_1.undo); }}>
            ↶
          </button>
          <button type="button" class="icon-btn" aria-label={en_1.t.designs.redo} disabled={history.future.length === 0} onClick={function () { return step(history_1.redo); }}>
            ↷
          </button>
          <button type="button" class="icon-btn" aria-label={en_1.t.designs.zoomOut} onClick={function () { return zoomTo(view.zoom / 1.25); }}>
            −
          </button>
          <button type="button" class="dz-zoom" onClick={fit} aria-label={en_1.t.designs.fit}>
            {en_1.t.designs.zoom(view.zoom)}
          </button>
          <button type="button" class="icon-btn" aria-label={en_1.t.designs.zoomIn} onClick={function () { return zoomTo(view.zoom * 1.25); }}>
            +
          </button>
          {isNarrow && (<>
              <button type="button" class={"chip-btn".concat(panel === 'inspector' ? ' on' : '')} onClick={function () { return setPanel(panel === 'inspector' ? null : 'inspector'); }}>
                {en_1.t.designs.inspector}
              </button>
              <button type="button" class={"chip-btn".concat(panel === 'comments' ? ' on' : '')} onClick={function () { return setPanel(panel === 'comments' ? null : 'comments'); }}>
                {en_1.t.designs.commentsButton(open)}
              </button>
            </>)}
        </span>
      </div>
      <div class="dz-ed-body">
        <div ref={viewport} class="dz-viewport panel" tabIndex={0} role="application" aria-label={en_1.t.designs.canvas(scene.name)} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onDblClick={onDoubleClick}>
          <div ref={stage} class="dz-stage" style={{ transform: "translate(".concat(view.x, "px, ").concat(view.y, "px) scale(").concat(view.zoom, ")"), '--z': view.zoom }}>
            <span class="dz-frame-name">
              {scene.name} {scene.width} × {scene.height}
            </span>
            <scene_view_1.SceneView scene={scene} editing={editing}/>
            {selected !== null && editing === null && <Selection scene={scene} id={selected} root={stage.current}/>}
            {editingLayer !== null && (0, designs_1.isText)(editingLayer) && (<TextEdit layer={editingLayer} at={(_b = (0, scene_edits_1.placeOf)(scene, editingLayer.id)) !== null && _b !== void 0 ? _b : { x: 0, y: 0 }} onDone={function (text) {
                var _a;
                setEditing(null);
                (_a = viewport.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
                if (text !== editingLayer.text)
                    change((0, scene_edits_1.updateLayer)(scene, editingLayer.id, { text: text }));
            }}/>)}
          </div>
          <p class="dz-hint">{editing === null ? en_1.t.designs.hint : en_1.t.designs.editingText}</p>
        </div>
        {!isNarrow && (<aside class="dz-side">
            {inspector}
            {commentsPanel}
          </aside>)}
        {isNarrow && panel !== null && (<aside class="dz-float panel">
            <button type="button" class="icon-btn dz-float-x" aria-label={en_1.t.designs.close} onClick={function () { return setPanel(null); }}>
              ✕
            </button>
            {panel === 'inspector' ? inspector : commentsPanel}
          </aside>)}
      </div>
      {dialog === 'failed' && save.state.kind === 'failed' && (<dialog_1.Dialog title={en_1.t.designs.saveFailedTitle(scene.name)} onCancel={function () { return setDialog(null); }} onSubmit={function () {
                setDialog(null);
                void save.flush();
            }}>
          <p class="form-line">{save.state.message}</p>
          <p class="form-line">{en_1.t.designs.saveFailedKeep}</p>
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={function () { return setDialog(null); }}>
              {en_1.t.designs.keepEditing}
            </button>
            <button type="submit" class="btn primary">
              {en_1.t.failed.tryAgain}
            </button>
          </div>
        </dialog_1.Dialog>)}
      {dialog === 'changed' && (<dialog_1.Dialog title={en_1.t.designs.changedTitle(scene.name)} onCancel={function () { return setDialog(null); }} onSubmit={function () { return void saveMine(); }}>
          <p class="form-line">{en_1.t.designs.changedLine(scene.name)}</p>
          <p class="form-line">{en_1.t.designs.changedChoice(scene.name)}</p>
          {copyFailure !== null && (<p class="form-banner" role="alert">
              {copyFailure}
            </p>)}
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={onReload}>
              {en_1.t.designs.loadNew}
            </button>
            <button type="submit" class="btn primary">
              {en_1.t.designs.saveMine}
            </button>
          </div>
        </dialog_1.Dialog>)}
    </div>);
};
exports.DesignEditor = DesignEditor;
