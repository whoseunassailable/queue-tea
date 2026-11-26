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
exports.QuestsPage = void 0;
var hooks_1 = require("preact/hooks");
var format_1 = require("../../../../core/domain/format");
var states_1 = require("../../../../core/widgets/states");
var window_keys_1 = require("../../../../core/widgets/window_keys");
var window_width_1 = require("../../../../core/widgets/window_width");
var en_1 = require("../../../../l10n/en");
var board_1 = require("../../domain/board");
var constants_1 = require("../../../../core/constants/constants");
var search_1 = require("../../domain/search");
var flow_keys_1 = require("../state_management/flow_keys");
var quest_keys_1 = require("../state_management/quest_keys");
var active_card_1 = require("../widgets/active_card");
var active_detail_1 = require("../widgets/active_detail");
var add_chapter_1 = require("../widgets/add_chapter");
var board_tools_1 = require("../widgets/board_tools");
var empty_board_1 = require("../widgets/empty_board");
var flow_card_1 = require("../widgets/flow_card");
var judgement_card_1 = require("../widgets/judgement_card");
var quest_detail_1 = require("../widgets/quest_detail");
var quest_row_1 = require("../widgets/quest_row");
var QuestsPage = function (_a) {
    var _b, _c, _d;
    var engine = _a.engine, view = _a.view, picked = _a.picked, initialDetailOpen = _a.initialDetailOpen, folded = _a.folded, savedQuest = _a.savedQuest, isRefreshing = _a.isRefreshing, isSheetOpen = _a.isSheetOpen, letterKeys = _a.letterKeys, edits = _a.edits, flow = _a.flow, actions = _a.actions, questNotes = _a.questNotes, board = _a.board, onBoard = _a.onBoard, onOpen = _a.onOpen, onFold = _a.onFold, onSheet = _a.onSheet;
    var shown = board !== null && board !== void 0 ? board : search_1.EMPTY_BOARD;
    var filters = shown.filters;
    var isNarrowed = (0, search_1.isFiltering)(shown);
    // While it's narrowed a fold can't hide a match.
    var foldsNow = isNarrowed ? [] : folded;
    var narrow = function (entries) { return (0, board_1.withWholeSagas)((0, board_1.rowsOf)((0, search_1.filterEntries)(entries, shown, view.activeSaga, view.budget), foldsNow), view); };
    var ready = (0, search_1.showsSection)(filters, 'ready') ? narrow(view.ready) : [];
    var sealed = (0, search_1.showsSection)(filters, 'sealed') ? narrow(view.sealed) : [];
    var rows = __spreadArray(__spreadArray([], ready, true), sealed, true);
    var open = (0, board_1.openRow)(rows, picked);
    var isEmpty = view.ready.length === 0 && view.sealed.length === 0;
    // The pane shows the quest in hand once it's picked, and while it stays so.
    var activeOpen = (_b = view.activeQuests.find(function (quest) { return quest.id === picked; })) !== null && _b !== void 0 ? _b : null;
    var search = shown.search.trim();
    var searchBox = (0, hooks_1.useRef)(null);
    var width = (0, window_width_1.useWindowWidth)();
    var isFloating = width < constants_1.DETAIL_FLOATS_BELOW;
    var isPaged = width < constants_1.DETAIL_IS_PAGE_BELOW;
    var _e = (0, hooks_1.useState)(initialDetailOpen), isDetailOpen = _e[0], setDetailOpen = _e[1];
    var wasFloating = (0, hooks_1.useRef)(isFloating);
    (0, hooks_1.useEffect)(function () {
        if (wasFloating.current !== isFloating)
            setDetailOpen(false);
        wasFloating.current = isFloating;
    }, [isFloating]);
    var showDetail = !isFloating || isDetailOpen;
    var openDetail = function (id) {
        onOpen(id);
        setDetailOpen(true);
    };
    var _f = (0, hooks_1.useState)(null), dragged = _f[0], setDragged = _f[1];
    var _g = (0, hooks_1.useState)(null), overId = _g[0], setOverId = _g[1];
    var endDrag = function () {
        setDragged(null);
        setOverId(null);
    };
    var dragOver = function (row, event) {
        if (dragged === null || dragged.quest.id === row.quest.id)
            return;
        // Only a row that takes the drop cancels the event.
        event.preventDefault();
        setOverId(row.quest.id);
    };
    var drop = function (row) {
        var from = dragged;
        endDrag();
        if (from !== null && from.quest.id !== row.quest.id)
            onSheet({ kind: 'move', quest: from.quest, preset: { id: row.quest.id, title: row.quest.title } });
    };
    (0, window_keys_1.useWindowKeys)(function (event) {
        var _a;
        if (event.key === 'f' && event.metaKey) {
            event.preventDefault();
            (_a = searchBox.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    });
    var last = (_d = (_c = view.victories[0]) === null || _c === void 0 ? void 0 : _c.finished) !== null && _d !== void 0 ? _d : null;
    var remove = function (row) {
        if (row.sagaOf !== null)
            onSheet({ kind: 'remove', quest: row.quest, chapters: row.sagaOf.chapters.length });
        else
            void edits.remove(view.key, row.quest);
    };
    var unseal = function (row) {
        if (row.quest.sealedBecause !== null)
            void edits.unseal(view.key, row.quest);
    };
    var toggleActiveSaga = function (row) { return void edits.setActiveSaga(view.key, view.activeSagaId === row.quest.id ? null : row.quest); };
    var canStart = function (row) { return row !== null && row.quest.sealedBecause === null && (flow === null || flow === void 0 ? void 0 : flow.kind) !== 'working'; };
    (0, quest_keys_1.useQuestKeys)(!isSheetOpen, letterKeys, function (key) {
        if (key.kind === 'cancel' && isFloating && isDetailOpen) {
            setDetailOpen(false);
            return;
        }
        if (key.kind === 'detail') {
            if (open !== null)
                openDetail(open.quest.id);
            return;
        }
        if ((0, flow_keys_1.runFlowKey)(key, activeOpen === null ? view : __assign(__assign({}, view), { active: activeOpen }), flow, actions))
            return;
        if (key.kind === 'start') {
            if (canStart(open))
                actions.onStart(open.quest);
            return;
        }
        if (key.kind === 'up' || key.kind === 'down') {
            var next = (0, board_1.stepFrom)(rows, open === null || open === void 0 ? void 0 : open.quest.id, key.kind === 'up' ? -1 : 1);
            if (next !== null)
                onOpen(next.quest.id);
            return;
        }
        if (open === null)
            return;
        if (key.kind === 'fold' || key.kind === 'unfold') {
            if (open.sagaOf !== null && (key.kind === 'fold') !== open.isFolded)
                onFold(open.quest.id);
            else if (key.kind === 'fold' && open.quest.parentId !== null)
                onOpen(open.quest.parentId);
        }
        else if (key.kind === 'priority') {
            if (key.priority !== open.quest.priority)
                void edits.setPriority(view.key, open.quest, key.priority);
        }
        else if (key.kind === 'playNext')
            void edits.togglePlayNext(view.key, open.quest);
        else if (key.kind === 'seal')
            onSheet({ kind: 'seal', quest: open.quest });
        else if (key.kind === 'unseal')
            unseal(open);
        else if (key.kind === 'partOf')
            onSheet({ kind: 'move', quest: open.quest });
        else if (key.kind === 'activeSaga')
            toggleActiveSaga(open);
        else
            remove(open);
    });
    var rowOf = function (row) { return (<quest_row_1.QuestRowView key={row.quest.id} row={row} isOpen={activeOpen === null && row.quest.id === (open === null || open === void 0 ? void 0 : open.quest.id)} isSaved={row.quest.id === savedQuest} onOpen={openDetail} onFold={onFold} onAddChild={function (id) { return onSheet({ kind: 'new', parentId: id }); }} onPriority={function (r, priority) { return void edits.setPriority(view.key, r.quest, priority); }} search={search} isDropTarget={row.quest.id === overId} onDragStart={setDragged} onDragEnd={endDrag} onDragOver={dragOver} onDrop={drop}/>); };
    // Each unfolded saga ends with its Add a chapter row.
    var withAdds = function (list) {
        return list.flatMap(function (row, i) {
            var next = list[i + 1];
            var saga = row.isChapter ? __spreadArray([], list.slice(0, i), true).reverse().find(function (r) { return r.sagaOf !== null; }) : row;
            var endsSaga = (saga === null || saga === void 0 ? void 0 : saga.sagaOf) != null && !saga.isFolded && (next === null || next === void 0 ? void 0 : next.isChapter) !== true;
            return endsSaga ? [rowOf(row), <add_chapter_1.AddChapter key={"add-".concat(saga.quest.id)} realm={view.key} saga={saga.quest} edits={edits}/>] : [rowOf(row)];
        });
    };
    return (<main class={isFloating ? 'quests floating' : 'quests'}>
      {!(isPaged && isDetailOpen) && <div class="qlist">
        {flow !== undefined && <flow_card_1.FlowCard flow={flow} actions={actions}/>}
        {flow === undefined && view.activeQuests.map(function (active) {
                var _a;
                return active.review !== null
                    ? (0, search_1.showsSection)(filters, 'judgement') && <judgement_card_1.JudgementCard key={active.id} active={active} actions={actions} kind="compact"/>
                    : (0, search_1.showsSection)(filters, 'active') && <active_card_1.ActiveCard key={active.id} active={active} session={(_a = active.session) !== null && _a !== void 0 ? _a : view.session} actions={actions} kind="compact" onDetail={function () { return openDetail(active.id); }}/>;
            })}
        <board_tools_1.SearchAndFilters view={shown} hasTime={view.budget !== null} searchBox={searchBox} onChange={function (patch) { return onBoard(__assign(__assign({}, shown), patch)); }} onClear={function () { return onBoard(__assign(__assign({}, shown), { filters: search_1.EMPTY_BOARD.filters })); }}/>
        {(0, search_1.showsSection)(filters, 'ready') && <section class="board-list panel" aria-labelledby="qb-h">
          <div class="sec-row">
            <h2 id="qb-h">{en_1.t.board.title}</h2>
            <span class="sec-sub">{en_1.t.board.counts(view.canStart, view.sealedCount)}</span>
            <board_tools_1.TimeControl budget={view.budget} onStep={actions.onStepBudget}/>
            {isRefreshing && (<span class="sec-sub" role="status">
                <states_1.Spinner />
                {en_1.t.loading.stillReading}
              </span>)}
          </div>
          {view.activeSaga !== null && <p class="saga-line">{en_1.t.board.activeSaga(view.activeSaga)}</p>}
          {isEmpty && <empty_board_1.EmptyBoard onNewQuest={function () { return onSheet({ kind: 'new', parentId: null }); }}/>}
          {!isEmpty && ready.length === 0 && !isNarrowed && <p class="hint">{en_1.t.empty.allSealed}</p>}
          {isNarrowed && rows.length === 0 && (<p class="hint">
              {en_1.t.filters.noMatch(search)}{' '}
              {/* With only filters on, the chips above are the way out. */}
              {search !== '' && (<button type="button" class="link-btn" onClick={function () { return onBoard(__assign(__assign({}, shown), { search: '' })); }}>
                  {en_1.t.filters.clearSearch}
                </button>)}
            </p>)}
          {ready.length > 0 && <ul class="rows">{withAdds(ready)}</ul>}
          <button type="button" class="add-row" onClick={function () { return onSheet({ kind: 'new', parentId: null }); }}>
            + {en_1.t.actions.newQuest}
          </button>
        </section>}
        {(0, search_1.showsSection)(filters, 'sealed') && (<section class="fold panel" aria-label={en_1.t.board.sealed}>
            <h2>{en_1.t.board.sealed}</h2>
            <span class="sec-sub">{sealed.length === 0 ? "0 \u00B7 ".concat(en_1.t.board.sealedNone) : view.sealedCount}</span>
            {sealed.length > 0 && <ul class="rows sealed-rows">{sealed.map(rowOf)}</ul>}
          </section>)}
        {(0, search_1.showsSection)(filters, 'victories') && (<section class="fold panel" aria-label={en_1.t.board.victories}>
            <h2>{en_1.t.board.victories}</h2>
            <span class="sec-sub">{en_1.t.board.victoriesLine(view.victoryCount, last === null ? null : (0, format_1.dayOf)(last))}</span>
          </section>)}
      </div>}
      {isFloating && isDetailOpen && (<button type="button" class={isPaged ? 'link-btn detail-back' : 'icon-btn detail-close'} aria-label={isPaged ? en_1.t.narrow.back : en_1.t.narrow.closeDetail} onClick={function () { return setDetailOpen(false); }}>
          {isPaged ? en_1.t.narrow.back : '✕'}
        </button>)}
      {showDetail && activeOpen !== null && <active_detail_1.ActiveDetail engine={engine} realm={view.key} active={activeOpen} isSaved={activeOpen.id === savedQuest} edits={edits}/>}
      {showDetail && activeOpen === null && <quest_detail_1.QuestDetail engine={engine} realm={view.key} row={open} isBusy={(flow === null || flow === void 0 ? void 0 : flow.kind) === 'working'} note={open === null ? undefined : questNotes[open.quest.id]} onStart={function (platform) { return canStart(open) && actions.onStart(open.quest, platform); }} allowance={view.session.allowance} isActiveSaga={open !== null && view.activeSagaId === open.quest.id} isSaved={open !== null && open.quest.id === savedQuest} edits={edits} onSeal={function () { return open !== null && onSheet({ kind: 'seal', quest: open.quest }); }} onUnseal={function () { return open !== null && unseal(open); }} onPartOf={function () { return open !== null && onSheet({ kind: 'move', quest: open.quest }); }} onRemove={function () { return open !== null && remove(open); }} onPlayNext={function () { return open !== null && void edits.togglePlayNext(view.key, open.quest); }} onActiveSaga={function () { return open !== null && toggleActiveSaga(open); }}/>}
    </main>);
};
exports.QuestsPage = QuestsPage;
