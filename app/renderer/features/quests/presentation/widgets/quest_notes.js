"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestNotes = void 0;
var format_1 = require("../../../../core/domain/format");
var en_1 = require("../../../../l10n/en");
var task_activity_1 = require("./task_activity");
// A list item's own text: the engine marks points with "- " for the terminal.
var lineOf = function (line) { return line.replace(/^- /, ''); };
var Note = function (_a) {
    var note = _a.note;
    return (<details class="notes" open>
    <summary>{en_1.t.notes.note(note.title, (0, format_1.dayAndTime)(note.written))}</summary>
    {note.sections === null ? (<p class="card-note notes-text">{note.text}</p>) : (note.sections.map(function (section) { return (<div key={section.heading} class="notes-section">
          <h4>{section.heading}</h4>
          <ul>
            {section.lines.map(function (line) { return (<li key={line}>{lineOf(line)}</li>); })}
          </ul>
        </div>); }))}
  </details>);
};
var Filed = function (_a) {
    var messages = _a.messages;
    return (<details class="notes">
    <summary>{en_1.t.notes.filed(messages.length)}</summary>
    {messages.map(function (message) { return (<p key={message} class="card-note notes-text">
        {message}
      </p>); })}
  </details>);
};
// What a quest carries with it, on either kind of detail pane.
var QuestNotes = function (_a) {
    var facts = _a.facts;
    return (<>
    <task_activity_1.TaskActivity activity={facts.activity}/>
    {facts.note !== null && <Note note={facts.note}/>}
    {facts.messages.length > 0 && <Filed messages={facts.messages}/>}
  </>);
};
exports.QuestNotes = QuestNotes;
