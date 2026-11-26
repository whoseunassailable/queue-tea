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
exports.NoteGraphView = exports.keptStart = exports.GRAPH_START = void 0;
var hooks_1 = require("preact/hooks");
var notes_1 = require("../../../../../shared/notes");
var constants_1 = require("../../../../core/constants/constants");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var note_graph_1 = require("../../domain/note_graph");
var note_graph_layout_1 = require("../../domain/note_graph_layout");
var notes_view_1 = require("../../domain/notes_view");
var graph_layout_1 = require("../state_management/graph_layout");
var note_graph_draw_1 = require("./note_graph_draw");
exports.GRAPH_START = { scope: 'around', steps: 2, filter: note_graph_1.SHOW_ALL };
var keptStart = function () { return ({ input: null, points: new Map(), view: null, isFocused: false, isByMouse: false }); };
exports.keptStart = keptStart;
var KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
var clampZoom = function (zoom) { return Math.min(constants_1.GRAPH_ZOOM_MAX, Math.max(constants_1.GRAPH_ZOOM_MIN, zoom)); };
// Two inputs that place the same nodes and lines lay out alike, so the second
// keeps the first's identity and no new layout starts.
var isSameLayout = function (a, b) {
    return a.centre === b.centre && a.ids.length === b.ids.length && a.edges.length === b.edges.length && a.ids.every(function (id, i) { return id === b.ids[i]; }) && a.edges.every(function (edge, i) { return edge.a === b.edges[i].a && edge.b === b.edges[i].b; });
};
var lineOf = function (node) {
    var _a, _b, _c;
    return node.kind === 'quest'
        ? en_1.t.notebook.graphView.questLine((_a = node.title) !== null && _a !== void 0 ? _a : en_1.t.notebook.graphView.goneQuest, en_1.t.notebook.questStateSaid[(_b = node.questState) !== null && _b !== void 0 ? _b : 'gone'])
        : en_1.t.notebook.graphView.noteLine((_c = node.title) !== null && _c !== void 0 ? _c : '', node.noteType === null ? null : en_1.t.notebook.types[node.noteType].toLowerCase(), node.links);
};
var NoteGraphView = function (_a) {
    var engine = _a.engine, notes = _a.notes, open = _a.open, quests = _a.quests, settings = _a.settings, onSettings = _a.onSettings, kept = _a.kept, _b = _a.run, run = _b === void 0 ? graph_layout_1.workerLayout : _b, onOpenNote = _a.onOpenNote, onOpenQuest = _a.onOpenQuest, onLeave = _a.onLeave;
    var area = (0, hooks_1.useRef)(null);
    var canvas = (0, hooks_1.useRef)(null);
    // undefined until asked; null where there is no 2D canvas (the tests' jsdom).
    var context = (0, hooks_1.useRef)(undefined);
    var drag = (0, hooks_1.useRef)(null);
    // Set while a focus comes from the mouse, which picks no node.
    var isMouseFocus = (0, hooks_1.useRef)(false);
    var isFitted = (0, hooks_1.useRef)(settings.scope === 'realm' && kept.current.view !== null);
    var _c = (0, hooks_1.useState)(settings.scope === 'realm' && kept.current.view !== null ? kept.current.view : { zoom: 1, x: 0, y: 0 }), view = _c[0], setView = _c[1];
    var _d = (0, hooks_1.useState)(null), hovered = _d[0], setHovered = _d[1];
    var _e = (0, hooks_1.useState)(null), focused = _e[0], setFocused = _e[1];
    var _f = (0, hooks_1.useState)(false), isPanning = _f[0], setPanning = _f[1];
    var _g = (0, hooks_1.useState)(false), isSlow = _g[0], setSlow = _g[1];
    var _h = (0, hooks_1.useState)(false), isMenuOpen = _h[0], setMenuOpen = _h[1];
    var _j = (0, hooks_1.useState)(0), setRedraw = _j[1];
    var scope = settings.scope, steps = settings.steps, filter = settings.filter;
    // The open note counts as it is on screen; the rest as saved.
    var questIds = open.quests.map(function (quest) { return quest.id; }).join(',');
    // noteGraphOf reads only these fields of open, so the list names them instead of open itself.
    var graph = (0, hooks_1.useMemo)(function () { return (0, note_graph_1.noteGraphOf)(notes.some(function (note) { return note.id === open.id; }) ? notes.map(function (note) { return (note.id === open.id ? open : note); }) : __spreadArray(__spreadArray([], notes, true), [open], false), quests); }, [notes, open.id, open.title, open.body, open.type, open.isArchived, questIds, quests]);
    var local = (0, hooks_1.useMemo)(function () { return (scope === 'around' ? (0, note_graph_1.aroundOf)(graph, open.id, steps) : graph); }, [graph, scope, steps, open.id]);
    var lastInput = (0, hooks_1.useRef)(kept.current.input);
    var input = (0, hooks_1.useMemo)(function () {
        var next = { ids: __spreadArray([], local.nodes.keys(), true).sort(), edges: __spreadArray([], local.edges, true).sort(function (x, y) { return (x.a < y.a ? -1 : x.a > y.a ? 1 : x.b < y.b ? -1 : x.b > y.b ? 1 : 0); }), centre: scope === 'around' ? open.id : null, start: scope === 'realm' ? kept.current.points : new Map() };
        if (lastInput.current === null || !isSameLayout(lastInput.current, next))
            lastInput.current = next;
        return lastInput.current;
    }, [local, scope, open.id]);
    var ready = scope === 'realm' && input === kept.current.input && kept.current.points.size > 0 ? kept.current.points : null;
    var layout = (0, graph_layout_1.useGraphLayout)(run, input, function (text) { return engine.log('error', text); }, ready);
    var state = layout.state;
    // A whole realm laid out again keeps its old map on screen until the new one is ready.
    var points = state.kind === 'done' ? state.points : scope === 'realm' && kept.current.points.size > 0 ? kept.current.points : null;
    var shown = (0, hooks_1.useMemo)(function () { return (0, note_graph_1.shownIdsOf)(local, filter, open.id); }, [local, filter, open.id]);
    var fit = function (at) {
        var _a;
        var _b;
        if (at === void 0) { at = points; }
        var box = (_b = area.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        if (box === undefined || at === null)
            return;
        var _c = [Infinity, Infinity, -Infinity, -Infinity], left = _c[0], top = _c[1], right = _c[2], bottom = _c[3];
        for (var _i = 0, shown_1 = shown; _i < shown_1.length; _i++) {
            var id = shown_1[_i];
            var point = at.get(id);
            if (point === undefined)
                continue;
            _a = [Math.min(left, point.x), Math.min(top, point.y), Math.max(right, point.x), Math.max(bottom, point.y)], left = _a[0], top = _a[1], right = _a[2], bottom = _a[3];
        }
        if (left === Infinity)
            return;
        var zoom = clampZoom(Math.min(1, (box.width - 2 * constants_1.GRAPH_FIT_PX) / (right - left), (box.height - 2 * constants_1.GRAPH_FIT_PX) / (bottom - top)));
        setView({ zoom: zoom, x: box.width / 2 - ((left + right) / 2) * zoom, y: box.height / 2 - ((top + bottom) / 2) * zoom });
    };
    // Pans the open note to the middle when it lies outside the view.
    var bringIntoView = function (at) {
        var _a;
        var box = (_a = area.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        var point = at.get(open.id);
        if (box === undefined || point === undefined)
            return;
        setView(function (v) {
            var _a = [point.x * v.zoom + v.x, point.y * v.zoom + v.y], x = _a[0], y = _a[1];
            var isInside = x >= constants_1.GRAPH_FIT_PX && x <= box.width - constants_1.GRAPH_FIT_PX && y >= constants_1.GRAPH_FIT_PX && y <= box.height - constants_1.GRAPH_FIT_PX;
            return isInside ? v : __assign(__assign({}, v), { x: box.width / 2 - point.x * v.zoom, y: box.height / 2 - point.y * v.zoom });
        });
    };
    // Around a note every layout is fitted; the whole realm only its first, so the map doesn't jump.
    (0, hooks_1.useEffect)(function () {
        if (state.kind !== 'done')
            return;
        if (scope === 'realm') {
            kept.current.input = input;
            kept.current.points = state.points;
        }
        if (scope === 'around' || !isFitted.current)
            fit(state.points);
        else
            bringIntoView(state.points);
        isFitted.current = scope === 'realm';
    }, [state]);
    (0, hooks_1.useEffect)(function () {
        if (scope === 'realm' && isFitted.current)
            kept.current.view = view;
    }, [view, scope]);
    // A note the map opened brings its new mount's focus back to the map.
    (0, hooks_1.useEffect)(function () {
        var _a;
        if (!kept.current.isFocused)
            return;
        kept.current.isFocused = false;
        isMouseFocus.current = kept.current.isByMouse;
        (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
        isMouseFocus.current = false; // no focus event fires when the map already has the focus
    }, []);
    (0, hooks_1.useEffect)(function () {
        if (scope === 'realm' && state.kind === 'done')
            bringIntoView(state.points);
    }, [open.id]);
    (0, hooks_1.useEffect)(function () {
        if (state.kind !== 'laying')
            return setSlow(false);
        var timer = setTimeout(function () { return setSlow(true); }, constants_1.GRAPH_SPINNER_MS);
        return function () { return clearTimeout(timer); };
    }, [state.kind]);
    // The canvas follows the area's size and the theme's colours.
    (0, hooks_1.useEffect)(function () {
        var _a;
        var redraw = function () { return setRedraw(function (n) { return n + 1; }); };
        var theme = new MutationObserver(redraw);
        var root = (_a = area.current) === null || _a === void 0 ? void 0 : _a.closest('.rm');
        if (root)
            theme.observe(root, { attributes: true, attributeFilter: ['class'] });
        // jsdom has no ResizeObserver; the app's Chromium always does.
        var size = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(redraw);
        if (area.current)
            size === null || size === void 0 ? void 0 : size.observe(area.current);
        return function () {
            theme.disconnect();
            size === null || size === void 0 ? void 0 : size.disconnect();
        };
    }, []);
    var hot = hovered !== null && hovered !== void 0 ? hovered : focused;
    (0, hooks_1.useEffect)(function () {
        var _a;
        var element = canvas.current;
        if (element === null)
            return;
        if (context.current === undefined)
            context.current = element.getContext('2d');
        var ctx = context.current;
        if (ctx === null)
            return;
        var box = element.getBoundingClientRect();
        var ratio = window.devicePixelRatio || 1;
        var _b = [Math.round(box.width * ratio), Math.round(box.height * ratio)], width = _b[0], height = _b[1];
        if (element.width !== width || element.height !== height)
            _a = [width, height], element.width = _a[0], element.height = _a[1];
        var isLabelled = scope === 'around' || view.zoom >= constants_1.GRAPH_LABEL_ZOOM;
        (0, note_graph_draw_1.drawGraph)(ctx, { width: box.width, height: box.height, ratio: ratio, view: view, graph: local, points: points !== null && points !== void 0 ? points : new Map(), shown: shown, openId: open.id, hot: hot, goneQuest: en_1.t.notebook.graphView.goneQuest, isLabelled: isLabelled, colours: (0, note_graph_draw_1.graphColoursOf)(element) });
    });
    // A wheel pans, or zooms around the pointer with ⌘ or a pinch. It has to
    // stop the page scrolling, so it can't be a passive listener.
    var latestWheel = (0, hooks_1.useRef)(function () { });
    latestWheel.current = function (event) {
        event.preventDefault();
        if (!(event.ctrlKey || event.metaKey))
            return setView(function (v) { return (__assign(__assign({}, v), { x: v.x - event.deltaX, y: v.y - event.deltaY })); });
        var box = area.current.getBoundingClientRect();
        var _a = [event.clientX - box.left, event.clientY - box.top], px = _a[0], py = _a[1];
        setView(function (v) {
            var zoom = clampZoom(v.zoom * Math.exp(-event.deltaY * 0.01));
            return { zoom: zoom, x: px - ((px - v.x) * zoom) / v.zoom, y: py - ((py - v.y) * zoom) / v.zoom };
        });
    };
    (0, hooks_1.useEffect)(function () {
        var element = area.current;
        var heard = function (event) { return latestWheel.current(event); };
        element === null || element === void 0 ? void 0 : element.addEventListener('wheel', heard, { passive: false });
        return function () { return element === null || element === void 0 ? void 0 : element.removeEventListener('wheel', heard); };
    }, []);
    var nodeUnder = function (clientX, clientY) {
        var _a;
        var box = (_a = area.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (box === undefined || points === null)
            return null;
        return (0, note_graph_layout_1.nodeAt)(points, shown, { x: (clientX - box.left - view.x) / view.zoom, y: (clientY - box.top - view.y) / view.zoom }, constants_1.GRAPH_HIT_PX / view.zoom);
    };
    // A note opens; a quest only while it's in play, since Quests can't open a done one.
    var openNode = function (id, isByMouse) {
        if (isByMouse === void 0) { isByMouse = false; }
        var questId = (0, note_graph_1.questIdOfNode)(id);
        if (questId === null) {
            if (id !== open.id) {
                kept.current.isFocused = true;
                kept.current.isByMouse = isByMouse;
                onOpenNote(id);
            }
        }
        else if ((0, notes_view_1.isInPlay)(quests, questId))
            onOpenQuest(questId);
    };
    // Whether a click on the node opens something.
    var opensOf = function (id) {
        var questId = (0, note_graph_1.questIdOfNode)(id);
        return questId === null ? id !== open.id : (0, notes_view_1.isInPlay)(quests, questId);
    };
    // The press is a pan once it moves past GRAPH_DRAG_PX, and a click otherwise.
    var latestMove = (0, hooks_1.useRef)(function () { });
    latestMove.current = function (event) {
        var start = drag.current;
        if (start === null)
            return;
        var _a = [event.clientX - start.x, event.clientY - start.y], dx = _a[0], dy = _a[1];
        if (!start.isPan && Math.hypot(dx, dy) <= constants_1.GRAPH_DRAG_PX)
            return;
        if (!start.isPan) {
            start.isPan = true;
            setPanning(true);
        }
        setView(__assign(__assign({}, start.view), { x: start.view.x + dx, y: start.view.y + dy }));
    };
    var latestUp = (0, hooks_1.useRef)(function () { });
    latestUp.current = function (event) {
        var start = drag.current;
        drag.current = null;
        window.removeEventListener('mousemove', onWindowMove);
        window.removeEventListener('mouseup', onWindowUp);
        setPanning(false);
        if (start === null || start.isPan)
            return;
        var id = nodeUnder(event.clientX, event.clientY);
        if (id !== null)
            openNode(id, true);
    };
    var onWindowMove = (0, hooks_1.useRef)(function (event) { return latestMove.current(event); }).current;
    var onWindowUp = (0, hooks_1.useRef)(function (event) { return latestUp.current(event); }).current;
    (0, hooks_1.useEffect)(function () { return function () {
        window.removeEventListener('mousemove', onWindowMove);
        window.removeEventListener('mouseup', onWindowUp);
    }; }, []);
    var onMouseDown = function (event) {
        var _a;
        // The buttons laid over the map are pressed, not panned.
        if (event.button !== 0 || event.target.closest('button') !== null)
            return;
        isMouseFocus.current = true;
        (_a = area.current) === null || _a === void 0 ? void 0 : _a.focus({ preventScroll: true });
        isMouseFocus.current = false; // no focus event fires when the map already has the focus
        drag.current = { x: event.clientX, y: event.clientY, view: view, isPan: false };
        window.addEventListener('mousemove', onWindowMove);
        window.addEventListener('mouseup', onWindowUp);
    };
    var onKeyDown = function (event) {
        var _a;
        var from = focused !== null && focused !== void 0 ? focused : open.id;
        if (KEYS[event.key] !== undefined) {
            if (points !== null)
                setFocused((_a = (0, note_graph_layout_1.nextNode)(points, shown, from, KEYS[event.key])) !== null && _a !== void 0 ? _a : from);
        }
        else if (event.key === 'Enter')
            openNode(from);
        else if (event.key === 'Escape') {
            event.stopPropagation();
            onLeave();
        }
        else
            return;
        event.preventDefault();
    };
    // The filter menu closes on a click outside it or on Esc.
    var menu = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(function () {
        if (!isMenuOpen)
            return undefined;
        var away = function (event) {
            var _a;
            if (!((_a = menu.current) === null || _a === void 0 ? void 0 : _a.contains(event.target)))
                setMenuOpen(false);
        };
        var heard = function (event) {
            if (event.key === 'Escape')
                setMenuOpen(false);
        };
        window.addEventListener('mousedown', away);
        window.addEventListener('keydown', heard);
        return function () {
            window.removeEventListener('mousedown', away);
            window.removeEventListener('keydown', heard);
        };
    }, [isMenuOpen]);
    var toggleType = function (type) {
        var hiddenTypes = new Set(filter.hiddenTypes);
        if (!hiddenTypes.delete(type))
            hiddenTypes.add(type);
        onSettings(__assign(__assign({}, settings), { filter: __assign(__assign({}, filter), { hiddenTypes: hiddenTypes }) }));
    };
    var choices = __spreadArray(__spreadArray([], __spreadArray(__spreadArray([], notes_1.NOTE_TYPES, true), ['none'], false).map(function (type) { return ({ key: type, label: type === 'none' ? en_1.t.notebook.graphView.noType : en_1.t.notebook.types[type], isOn: !filter.hiddenTypes.has(type), onToggle: function () { return toggleType(type); } }); }), true), [
        { key: 'quests', label: en_1.t.notebook.graphView.quests, isOn: filter.quests, onToggle: function () { return onSettings(__assign(__assign({}, settings), { filter: __assign(__assign({}, filter), { quests: !filter.quests }) })); } },
        { key: 'doneQuests', label: en_1.t.notebook.graphView.doneQuests, isOn: filter.doneQuests, onToggle: function () { return onSettings(__assign(__assign({}, settings), { filter: __assign(__assign({}, filter), { doneQuests: !filter.doneQuests }) })); } },
    ], false);
    var others = __spreadArray([], shown, true).filter(function (id) { return id !== open.id; });
    var questCount = (scope === 'around' ? others : __spreadArray([], shown, true)).filter(function (id) { return (0, note_graph_1.questIdOfNode)(id) !== null; }).length;
    var summary = scope === 'around' ? en_1.t.notebook.graphView.summaryAround(open.title, others.length - questCount, questCount, steps) : en_1.t.notebook.graphView.summaryRealm(shown.size - questCount, questCount);
    var focusedNode = focused !== null && shown.has(focused) ? graph.nodes.get(focused) : undefined;
    var isDone = state.kind === 'done';
    var pressedOf = function (isOn) { return (isOn ? 'nt-mode-btn on' : 'nt-mode-btn'); };
    return (<div class="nt-graph">
      <div class="nt-graph-bar">
        <span class="nt-mode" role="group" aria-label={en_1.t.notebook.graphView.scope}>
          {['around', 'realm'].map(function (choice) { return (<button key={choice} type="button" class={pressedOf(scope === choice)} aria-pressed={scope === choice} onClick={function () { return onSettings(__assign(__assign({}, settings), { scope: choice })); }}>
              {en_1.t.notebook.graphView[choice]}
            </button>); })}
        </span>
        {scope === 'around' && (<span class="nt-mode" role="group" aria-label={en_1.t.notebook.graphView.steps}>
            {[1, 2].map(function (choice) { return (<button key={choice} type="button" class={pressedOf(steps === choice)} aria-pressed={steps === choice} onClick={function () { return onSettings(__assign(__assign({}, settings), { steps: choice })); }}>
                {choice === 1 ? en_1.t.notebook.graphView.oneStep : en_1.t.notebook.graphView.twoSteps}
              </button>); })}
          </span>)}
        <span class="prio" ref={menu}>
          <button type="button" class="btn" aria-haspopup="menu" aria-expanded={isMenuOpen ? 'true' : 'false'} onClick={function () { return setMenuOpen(!isMenuOpen); }}>
            {en_1.t.notebook.graphView.filter} <span aria-hidden="true">▾</span>
          </button>
          {isMenuOpen && (<span class="prio-menu nt-graph-menu" role="menu">
              {choices.map(function (choice) { return (<button key={choice.key} type="button" role="menuitemcheckbox" aria-checked={choice.isOn ? 'true' : 'false'} class="prio-item" onClick={choice.onToggle}>
                  <span aria-hidden="true">{choice.isOn ? '✓' : ' '}</span>
                  {choice.label}
                </button>); })}
            </span>)}
        </span>
        <button type="button" class="btn" onClick={function () { return fit(); }}>
          {en_1.t.notebook.graphView.fit}
        </button>
      </div>
      <div ref={area} class={"nt-graph-area".concat(isPanning ? ' is-panning' : hovered !== null && opensOf(hovered) ? ' is-over-node' : '')} role="group" aria-label={summary} aria-busy={state.kind === 'laying'} tabIndex={0} onMouseDown={onMouseDown} onMouseMove={function (event) { return drag.current === null && setHovered(nodeUnder(event.clientX, event.clientY)); }} onMouseLeave={function () { return setHovered(null); }} onFocus={function () {
            if (!isMouseFocus.current && focused === null)
                setFocused(open.id);
            isMouseFocus.current = false;
        }} onBlur={function () { return setFocused(null); }} onKeyDown={onKeyDown}>
        <canvas ref={canvas} aria-hidden="true"/>
        <p class="nt-graph-said" role="status" aria-live="polite">
          {focusedNode === undefined ? '' : lineOf(focusedNode)}
        </p>
        <div class="nt-graph-over">
          {state.kind === 'laying' && isSlow && (<states_1.Loading line={en_1.t.notebook.graphView.laying(input.ids.length)}>{state.share > 0 && <p class="state-line">{en_1.t.notebook.graphView.progress(state.share)}</p>}</states_1.Loading>)}
          {state.kind === 'failed' && <states_1.Failed message={en_1.t.notebook.graphView.failed} onRetry={layout.retry}/>}
          {isDone && local.edges.length === 0 && scope === 'around' && (<div class="state panel">
              <p class="state-line">{en_1.t.notebook.graphView.alone}</p>
              <p class="state-line">{en_1.t.notebook.graphView.aloneHint}</p>
            </div>)}
          {isDone && local.edges.length === 0 && scope === 'realm' && <p class="state panel state-line">{en_1.t.notebook.graphView.unlinked}</p>}
          {isDone && shown.size <= 1 && local.nodes.size > 1 && (<div class="state panel">
              <p class="state-line">{en_1.t.notebook.graphView.filteredOut}</p>
              <button type="button" class="btn" onClick={function () { return onSettings(__assign(__assign({}, settings), { filter: note_graph_1.SHOW_ALL })); }}>
                {en_1.t.notebook.graphView.showAll}
              </button>
            </div>)}
        </div>
      </div>
    </div>);
};
exports.NoteGraphView = NoteGraphView;
