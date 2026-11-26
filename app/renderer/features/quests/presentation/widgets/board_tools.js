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
exports.SearchAndFilters = exports.TimeControl = void 0;
var hooks_1 = require("preact/hooks");
var ranking_1 = require("../../../../../../hooks/shared/backlog/domain/services/ranking");
var en_1 = require("../../../../l10n/en");
var PRIORITIES = ['urgent', 'high', 'mid', 'okay', 'low'];
var DIFFICULTIES = ['light', 'medium', 'hard'];
var SECTIONS = ['ready', 'active', 'judgement', 'sealed', 'victories'];
// Time I have steps through its choices, as the terminal's t key does.
var TimeControl = function (_a) {
    var budget = _a.budget, onStep = _a.onStep;
    return (<button type="button" class="chip-btn" aria-label={en_1.t.board.timeLabel((0, ranking_1.budgetLabel)(budget))} onClick={onStep}>
    {en_1.t.board.time((0, ranking_1.budgetLabel)(budget))}
  </button>);
};
exports.TimeControl = TimeControl;
var toggled = function (list, item) { return (list.includes(item) ? list.filter(function (x) { return x !== item; }) : __spreadArray(__spreadArray([], list, true), [item], false)); };
var Check = function (_a) {
    var label = _a.label, isOn = _a.isOn, onToggle = _a.onToggle;
    return (<label class="check">
    <input type="checkbox" checked={isOn} onChange={onToggle}/>
    <span>{label}</span>
  </label>);
};
var FiltersPopover = function (_a) {
    var filters = _a.filters, hasTime = _a.hasTime, onChange = _a.onChange;
    return (<div class="filters panel" role="group" aria-label={en_1.t.filters.title}>
    <p class="filters-h">{en_1.t.form.priority}</p>
    <div class="filters-row">
      {PRIORITIES.map(function (priority) { return (<Check key={priority} label={en_1.t.priority[priority]} isOn={filters.priorities.includes(priority)} onToggle={function () { return onChange({ priorities: toggled(filters.priorities, priority) }); }}/>); })}
    </div>
    <p class="filters-h">{en_1.t.form.difficulty}</p>
    <div class="filters-row">
      {DIFFICULTIES.map(function (difficulty) { return (<Check key={difficulty} label={en_1.t.difficulty[difficulty]} isOn={filters.difficulties.includes(difficulty)} onToggle={function () { return onChange({ difficulties: toggled(filters.difficulties, difficulty) }); }}/>); })}
    </div>
    <p class="filters-h">{en_1.t.filters.state}</p>
    <div class="filters-row">
      {SECTIONS.map(function (section) { return (<Check key={section} label={en_1.t.filters.sections[section]} isOn={filters.sections.includes(section)} onToggle={function () { return onChange({ sections: toggled(filters.sections, section) }); }}/>); })}
    </div>
    <div class="filters-row">
      <Check label={en_1.t.filters.onlySaga} isOn={filters.onlySaga} onToggle={function () { return onChange({ onlySaga: !filters.onlySaga }); }}/>
      {hasTime && <Check label={en_1.t.filters.fitsTime} isOn={filters.fitsTime} onToggle={function () { return onChange({ fitsTime: !filters.fitsTime }); }}/>}
    </div>
  </div>);
};
// Each filter that's on, with what turning it off leaves.
var chipsOf = function (f) { return __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], f.priorities.map(function (p) { return ({ key: "p-".concat(p), label: en_1.t.priority[p], drop: { priorities: toggled(f.priorities, p) } }); }), true), f.difficulties.map(function (d) { return ({ key: "d-".concat(d), label: en_1.t.difficulty[d], drop: { difficulties: toggled(f.difficulties, d) } }); }), true), f.sections.map(function (s) { return ({ key: "s-".concat(s), label: en_1.t.filters.sections[s], drop: { sections: toggled(f.sections, s) } }); }), true), (f.onlySaga ? [{ key: 'saga', label: en_1.t.filters.onlySaga, drop: { onlySaga: false } }] : []), true), (f.fitsTime ? [{ key: 'time', label: en_1.t.filters.fitsTime, drop: { fitsTime: false } }] : []), true); };
var Funnel = function () { return (<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2 3h12l-4.5 5.5V13l-3 1.5v-6z"/>
  </svg>); };
var SearchAndFilters = function (_a) {
    var view = _a.view, hasTime = _a.hasTime, searchBox = _a.searchBox, onChange = _a.onChange, onClear = _a.onClear;
    var _b = (0, hooks_1.useState)(false), isOpen = _b[0], setOpen = _b[1];
    var filters = view.filters;
    var chips = chipsOf(filters);
    return (<div class="board-tools">
      <div class="board-tools-row">
        <input ref={searchBox} class="input grow" type="search" aria-label={en_1.t.filters.search} placeholder={en_1.t.filters.search} value={view.search} onInput={function (event) { return onChange({ search: event.target.value }); }} onKeyDown={function (event) {
            if (event.key === 'Escape') {
                event.stopPropagation();
                onChange({ search: '' });
            }
        }}/>
        <button type="button" class={chips.length > 0 ? 'chip-btn on' : 'chip-btn'} aria-expanded={isOpen} aria-label={en_1.t.filters.buttonLabel(chips.length)} onClick={function () { return setOpen(!isOpen); }}>
          <Funnel />
          {en_1.t.filters.button(chips.length)}
        </button>
      </div>
      {chips.length > 0 && (<div class="board-tools-row wrap" role="group" aria-label={en_1.t.filters.on}>
          {chips.map(function (chip) { return (<button key={chip.key} type="button" class="chip-btn" aria-label={en_1.t.filters.remove(chip.label)} onClick={function () { return onChange({ filters: __assign(__assign({}, filters), chip.drop) }); }}>
              {chip.label}
              <span aria-hidden="true">✕</span>
            </button>); })}
          <button type="button" class="chip-btn" onClick={onClear}>
            {en_1.t.filters.clearAll}
          </button>
        </div>)}
      {isOpen && <FiltersPopover filters={filters} hasTime={hasTime} onChange={function (patch) { return onChange({ filters: __assign(__assign({}, filters), patch) }); }}/>}
    </div>);
};
exports.SearchAndFilters = SearchAndFilters;
