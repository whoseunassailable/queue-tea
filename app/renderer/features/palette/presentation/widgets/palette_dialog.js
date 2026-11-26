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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaletteDialog = void 0;
var hooks_1 = require("preact/hooks");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var states_1 = require("../../../../core/widgets/states");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var en_1 = require("../../../../l10n/en");
var palette_1 = require("../../domain/palette");
var LIST_ID = 'palette-list';
var optionId = function (item) { return "palette-".concat(item.id); };
// With no realm to read, no notes and no call to main.
var NO_NOTES = { ok: true, data: { notes: [], unreadable: [], folder: '' } };
// The selected realm's notes are read while the palette is open, and the rest
// of the list works while they're on their way.
var PaletteDialog = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, input = _a.input, onClose = _a.onClose;
    var _e = (0, hooks_1.useState)(''), query = _e[0], setQuery = _e[1];
    var _f = (0, hooks_1.useState)(0), at = _f[0], setAt = _f[1];
    var box = (0, hooks_1.useRef)(null);
    (0, hooks_1.useLayoutEffect)(function () { var _a; return (_a = box.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
    var key = (_c = (_b = input.view) === null || _b === void 0 ? void 0 : _b.key) !== null && _c !== void 0 ? _c : null;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return (key === null ? Promise.resolve(NO_NOTES) : engine.readNotes(key)); }, [key]);
    var entries = (0, hooks_1.useMemo)(function () { return (0, palette_1.paletteEntries)(__assign(__assign({}, input), { notes: read.load, isRefreshingNotes: read.isRefreshing, notesProblem: read.note !== null })); }, [input, read.load, read.isRefreshing, read.note]);
    var found = (0, palette_1.filterPalette)(entries, query);
    var pointed = Math.min(at, found.length - 1);
    // Reading is feedback, so Return stays on the next action while it waits.
    var index = ((_d = found[pointed]) === null || _d === void 0 ? void 0 : _d.isBusy) ? found.findIndex(function (item, i) { return i > pointed && !item.isBusy; }) : pointed;
    var highlighted = found[index];
    var noNoteMatches = key !== null && query.trim() !== '' && read.load.status === 'ready' && !read.isRefreshing && read.note === null && read.load.data.unreadable.length === 0 && !found.some(function (item) { return item.note !== null; });
    var run = function (item) {
        if (item === undefined || !(0, palette_1.canRun)(item))
            return;
        onClose();
        item.run();
    };
    var start = function (item) {
        if ((item === null || item === void 0 ? void 0 : item.start) == null)
            return;
        onClose();
        item.start();
    };
    (0, window_keys_1.useWindowKeys)(function (event) {
        var _a;
        if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
        }
        else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            var step = event.key === 'ArrowDown' ? 1 : -1;
            var next = index + step;
            while ((_a = found[next]) === null || _a === void 0 ? void 0 : _a.isBusy)
                next += step;
            if (next >= 0 && next < found.length)
                setAt(next);
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            if (event.metaKey)
                start(highlighted);
            else
                run(highlighted);
        }
    });
    return (<div class="scrim palette-scrim" onClick={function (event) { return event.target === event.currentTarget && onClose(); }}>
      <div class="palette panel" role="dialog" aria-modal="true" aria-label={en_1.t.palette.label}>
        <input ref={box} class="input palette-input" type="text" role="combobox" aria-label={en_1.t.palette.placeholder} aria-expanded="true" aria-controls={LIST_ID} aria-activedescendant={highlighted === undefined ? undefined : optionId(highlighted)} placeholder={en_1.t.palette.placeholder} value={query} onInput={function (event) {
            setQuery(event.target.value);
            setAt(0);
        }}/>
        <ul class="palette-list" id={LIST_ID} role="listbox" aria-label={en_1.t.palette.label}>
          {found.length === 0 && <li class="hint">{en_1.t.palette.empty}</li>}
          {found.map(function (item, i) {
            var _a;
            var isNewSection = ((_a = found[i - 1]) === null || _a === void 0 ? void 0 : _a.section) !== item.section;
            return (<>
                {isNewSection && (<li class="palette-h" role="presentation">
                    {en_1.t.palette.sections[item.section]}
                  </li>)}
                <li key={item.id} id={optionId(item)} class={['palette-item', i === index ? 'on' : '', (0, palette_1.canRun)(item) ? '' : 'dim'].filter(function (c) { return c !== ''; }).join(' ')} role="option" aria-selected={i === index} aria-disabled={!(0, palette_1.canRun)(item)} onMouseEnter={function () { return setAt(i); }} onClick={function () { return run(item); }}>
                  {item.isBusy && <states_1.Spinner />}
                  <span class="palette-label">
                    {item.label}
                    {item.reason !== null && <span class="palette-reason"> · {item.reason}</span>}
                    {item.detail !== null && <span class="palette-detail">{item.detail}</span>}
                  </span>
                  {item.keys !== null && <kbd>{item.keys}</kbd>}
                </li>
              </>);
        })}
        </ul>
        {noNoteMatches && <p class="palette-hint" role="status">{en_1.t.palette.noNoteMatches}</p>}
        <p class="palette-hint">{en_1.t.palette.hint}</p>
      </div>
    </div>);
};
exports.PaletteDialog = PaletteDialog;
