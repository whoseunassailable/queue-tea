"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestRowView = void 0;
var tags_1 = require("../../../../core/widgets/tags");
var en_1 = require("../../../../l10n/en");
var board_1 = require("../../domain/board");
var search_1 = require("../../domain/search");
var priority_control_1 = require("./priority_control");
var Title = function (_a) {
    var title = _a.title, search = _a.search;
    return (<span class="qc-title">{(0, search_1.partsOf)(title, search).map(function (part) { return (part.isMatch ? <mark key={part.text}>{part.text}</mark> : part.text); })}</span>);
};
var QuestRowView = function (_a) {
    var row = _a.row, isOpen = _a.isOpen, isSaved = _a.isSaved, onOpen = _a.onOpen, onFold = _a.onFold, onAddChild = _a.onAddChild, onPriority = _a.onPriority, search = _a.search, isDropTarget = _a.isDropTarget, onDragStart = _a.onDragStart, onDragEnd = _a.onDragEnd, onDragOver = _a.onDragOver, onDrop = _a.onDrop;
    var quest = row.quest, isChapter = row.isChapter, sagaOf = row.sagaOf, isFolded = row.isFolded, foldedStar = row.foldedStar;
    var parts = ['qrow', isChapter ? 'child' : '', isOpen ? 'sel' : '', quest.sealedBecause === null ? '' : 'sealed', isDropTarget ? 'drop' : ''].filter(function (part) { return part !== ''; });
    return (<li>
      <div class={parts.join(' ')} draggable onDragStart={function () { return onDragStart(row); }} onDragEnd={onDragEnd} onDragOver={function (event) { return onDragOver(row, event); }} onDrop={function (event) {
            event.preventDefault();
            onDrop(row);
        }}>
        <span class="qr-mark" role={quest.isStar ? 'img' : undefined} aria-label={quest.isStar ? en_1.t.board.mainQuest : undefined}>
          {quest.isStar ? '★' : quest.isPlayNext ? '↥' : ''}
        </span>
        {sagaOf !== null && (<button type="button" class="fold-btn" aria-expanded={isFolded ? 'false' : 'true'} aria-label={isFolded ? en_1.t.actions.unfold(quest.title) : en_1.t.actions.fold(quest.title)} onClick={function () { return onFold(quest.id); }}>
            {isFolded ? '▸' : '▾'}
          </button>)}
        <button type="button" class="qrow-open" aria-pressed={isOpen ? 'true' : 'false'} onClick={function () { return onOpen(quest.id); }}>
          <span class="qc-body">
            <Title title={quest.title} search={search}/>
            <span class="qc-sub">{(0, board_1.metaOf)(row)}</span>
            {quest.why !== null && <span class="qc-sub">★ {quest.why}</span>}
            {foldedStar !== null && (<span class="qc-sub">
                ★ {foldedStar.title} · {foldedStar.why}
              </span>)}
          </span>
        </button>
        <span class="qc-side">
          <priority_control_1.PriorityControl title={quest.title} priority={quest.priority} isSaved={isSaved} onPick={function (priority) { return onPriority(row, priority); }}/>
          <tags_1.XpReward xp={quest.xp}/>
        </span>
        {!isChapter && (<button type="button" class="icon-btn quest-add-child" aria-label={en_1.t.actions.addChildTask(quest.title)} title={en_1.t.actions.addChildTask(quest.title)} onClick={function () { return onAddChild(quest.id); }}>
            +
          </button>)}
      </div>
    </li>);
};
exports.QuestRowView = QuestRowView;
