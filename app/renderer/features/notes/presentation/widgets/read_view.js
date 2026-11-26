"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadView = void 0;
var marked_1 = require("marked");
var notes_1 = require("../../../../../shared/notes");
var note_attachments_1 = require("../../../../../shared/note_attachments");
var note_bookmarks_1 = require("../../../../../shared/note_bookmarks");
var en_1 = require("../../../../l10n/en");
var notes_view_1 = require("../../domain/notes_view");
var note_attachment_1 = require("../../../../core/widgets/note_attachment");
var note_bookmark_1 = require("./note_bookmark");
var CALLOUT = /^\[!(\w+)\][+-]?[ \t]*(.*)$/;
// Read a whole quest link before Markdown splits the written title into tokens.
// This lexer belongs to Notes; the shared Markdown renderer keeps its defaults.
var markdown = new marked_1.Marked({ extensions: [{
            name: 'quest',
            level: 'inline',
            start: function (text) { return text.indexOf('[['); },
            tokenizer: function (text) {
                var _a, _b;
                var raw = (_a = /^\[\[[^\]\n]+\]\]/.exec(text)) === null || _a === void 0 ? void 0 : _a[0];
                if (raw === undefined || ((_b = (0, notes_1.linkPartsOf)(raw)[0]) === null || _b === void 0 ? void 0 : _b.kind) !== 'quest')
                    return undefined;
                return { type: 'quest', raw: raw };
            },
        }] });
markdown.use({ extensions: [{ name: 'noteFile', level: 'inline', start: function (text) { return text.search(/!?\[\[/); }, tokenizer: function (text) {
                var found = /^(!?)\[\[([^\[\]|\n]+)(?:\|([^\]\n]*))?\]\]/.exec(text);
                if (found === null || (0, note_attachments_1.noteFilePath)(found[2]) === null)
                    return undefined;
                return { type: 'noteFile', raw: found[0], href: found[2], text: found[3] || found[2].split('/').at(-1), embedded: found[1] === '!' };
            } }] });
// A web link alone on its line is a bookmark card. start ends the paragraph
// above at such a line, so it needn't have a blank line before it. It looks
// only as far as the paragraph's end: scanning the whole rest of the note for
// every paragraph made a long note read 15 times slower.
var BOOKMARK_LINE = /^https?:\/\/[^\s<>]+[ \t]*(?:\n|$)/;
markdown.use({ extensions: [{ name: 'bookmark', level: 'block', start: function (text) {
                var end = text.indexOf('\n\n');
                var found = /(?:^|\n)https?:\/\/[^\s<>]+[ \t]*(?:\n|$)/.exec(end === -1 ? text : text.slice(0, end + 1));
                return found === null ? undefined : found.index + (found[0].startsWith('\n') ? 1 : 0);
            }, tokenizer: function (text) {
                var _a;
                var raw = (_a = BOOKMARK_LINE.exec(text)) === null || _a === void 0 ? void 0 : _a[0];
                var href = raw === undefined ? null : (0, note_bookmarks_1.bookmarkUrlOf)(raw);
                return href === null ? undefined : { type: 'bookmark', raw: raw, href: href };
            } }] });
// A note as it reads. marked only cuts the Markdown into tokens; every token
// becomes an element here, so nothing in a note is ever run as HTML: a tag in
// the text shows as the text it is.
var ReadView = function (_a) {
    var engine = _a.engine, realm = _a.realm, body = _a.body, notes = _a.notes, quests = _a.quests, isLive = _a.isLive, onToggle = _a.onToggle, onOpenNote = _a.onOpenNote, onOpenQuest = _a.onOpenQuest, onOpenLink = _a.onOpenLink;
    // The boxes are numbered in the order they're drawn, which is the order
    // toggleTaskAt counts the lines in.
    var box = -1;
    // A quest link shows the quest as it is now. Only one in play opens, since
    // Quests can't open a done one.
    var quest = function (id, written, key) {
        var _a;
        var line = (0, notes_view_1.questLineOf)(quests, id);
        var said = en_1.t.notebook.questStateSaid[line.state];
        var chip = (<span class={"nt-state ".concat(line.state)} aria-hidden="true">
        {en_1.t.notebook.questState[line.state]}
      </span>);
        return line.title !== null && (0, notes_view_1.isInPlay)(quests, id) ? (<span key={key} class="nt-md-quest">
        <button type="button" class="nt-link nt-md-wiki" aria-label={en_1.t.notebook.openQuestLink(line.title, said)} onClick={function () { return onOpenQuest(id); }}>
          {line.title}
        </button>
        {chip}
      </span>) : (<span key={key} class="nt-md-quest">
        <span class={line.title === null ? 'nt-md-broken' : undefined}>{(_a = line.title) !== null && _a !== void 0 ? _a : written}</span>
        {chip}
        <span class="sr">, {said}</span>
      </span>);
    };
    var wiki = function (text) {
        return (0, notes_1.linkPartsOf)(text).map(function (part, i) {
            if (part.kind === 'text')
                return part.text;
            if (part.kind === 'quest')
                return quest(part.id, part.shown, i);
            var target = (0, notes_1.noteTitled)(notes, part.title);
            return target === undefined ? (<span key={i} class="nt-md-broken" title={en_1.t.notebook.broken(part.title)}>
          {part.shown}
        </span>) : (<button key={i} type="button" class="nt-link nt-md-wiki" onClick={function () { return onOpenNote(target.id); }}>
          {part.shown}
        </button>);
        });
    };
    var external = function (href, children, key, title) {
        if (title === void 0) { title = href; }
        return (<a key={key} href={href} title={title} class="nt-md-link" onClick={function (event) {
                event.preventDefault();
                onOpenLink(href);
            }}>
      {children}
    </a>);
    };
    var inline = function (tokens) {
        return (tokens !== null && tokens !== void 0 ? tokens : []).map(function (token, i) {
            switch (token.type) {
                case 'quest':
                    return wiki(token.raw);
                case 'text':
                    return 'tokens' in token && token.tokens !== undefined ? inline(token.tokens) : wiki(token.text);
                case 'escape':
                    return token.text;
                case 'strong':
                    return <strong key={i}>{inline(token.tokens)}</strong>;
                case 'em':
                    return <em key={i}>{inline(token.tokens)}</em>;
                case 'del':
                    return <del key={i}>{inline(token.tokens)}</del>;
                case 'codespan':
                    return <code key={i}>{token.text}</code>;
                case 'br':
                    return <br key={i}/>;
                case 'link':
                    if ((0, note_attachments_1.noteFilePath)(token.href) !== null)
                        return <note_attachment_1.NoteAttachment key={"".concat(realm, ":").concat(token.href, ":").concat(i)} engine={engine} realm={realm} path={token.href} name={token.text} embedded={false}/>;
                    return external(token.href, inline(token.tokens), i);
                case 'image':
                    if ((0, note_attachments_1.noteFilePath)(token.href) !== null)
                        return <note_attachment_1.NoteAttachment key={"".concat(realm, ":").concat(token.href, ":").concat(i)} engine={engine} realm={realm} path={token.href} name={token.text || en_1.t.notebook.image} embedded/>;
                    return external(token.href, "\uD83D\uDDBC ".concat(token.text === '' ? en_1.t.notebook.image : token.text), i);
                case 'noteFile':
                    if (!token.embedded && (0, notes_1.noteTitled)(notes, token.href.split('#')[0]) !== undefined)
                        return wiki(token.raw);
                    return <note_attachment_1.NoteAttachment key={"".concat(realm, ":").concat(token.href, ":").concat(i)} engine={engine} realm={realm} path={token.href} name={token.text} embedded={token.embedded}/>;
                case 'checkbox':
                    return null;
                default:
                    return token.raw;
            }
        });
    };
    var item = function (entry, i) {
        if (!entry.task)
            return <li key={i}>{blocks(entry.tokens)}</li>;
        box += 1;
        var index = box;
        return (<li key={i} class="nt-md-task">
        <input type="checkbox" checked={entry.checked === true} disabled={!isLive} aria-label={en_1.t.notebook.taskBox(entry.text.split('\n')[0])} onChange={function () { return onToggle(index); }}/>
        <div>{blocks(entry.tokens)}</div>
      </li>);
    };
    var callout = function (quote, i) {
        var _a = quote.text.split('\n'), first = _a[0], rest = _a.slice(1);
        var found = CALLOUT.exec(first !== null && first !== void 0 ? first : '');
        if (found === null)
            return <blockquote key={i}>{blocks(quote.tokens)}</blockquote>;
        var kind = found[1].toLowerCase();
        return (<aside key={i} class={"nt-md-callout ".concat(kind)} aria-label={found[2] || kind}>
        <p class="nt-md-callout-title">{found[2] === '' ? kind.charAt(0).toUpperCase() + kind.slice(1) : wiki(found[2])}</p>
        {blocks(markdown.lexer(rest.join('\n')))}
      </aside>);
    };
    // marked reads a list item's or a quote's contents as blocks of their own, so
    // only the note's top level knows a lone link there is a bookmark.
    var blocks = function (tokens, isTop) {
        if (isTop === void 0) { isTop = false; }
        return (tokens !== null && tokens !== void 0 ? tokens : []).map(function (token, i) {
            switch (token.type) {
                case 'space':
                case 'def':
                case 'checkbox':
                    return null;
                case 'heading': {
                    var Heading = "h".concat(Math.min(6, token.depth + 1));
                    return (<Heading key={i} class="nt-md-h" data-depth={token.depth}>
              {inline(token.tokens)}
            </Heading>);
                }
                case 'paragraph':
                    return <p key={i}>{inline(token.tokens)}</p>;
                case 'bookmark':
                    return isTop ? <note_bookmark_1.NoteBookmark key={"".concat(token.href, ":").concat(i)} engine={engine} url={token.href} onOpenLink={onOpenLink}/> : external(token.href, token.href, i);
                case 'text':
                    return 'tokens' in token && token.tokens !== undefined ? <span key={i}>{inline(token.tokens)}</span> : <span key={i}>{wiki(token.text)}</span>;
                case 'code':
                    return (<pre key={i} class="nt-md-code">
              <code>{token.text}</code>
            </pre>);
                case 'blockquote':
                    return callout(token, i);
                case 'list': {
                    var list = token;
                    var items = list.items.map(item);
                    return list.ordered ? (<ol key={i} start={typeof list.start === 'number' ? list.start : undefined}>
              {items}
            </ol>) : (<ul key={i}>{items}</ul>);
                }
                case 'table': {
                    var table_1 = token;
                    return (<div key={i} class="nt-md-table">
              <table_1>
                <thead>
                  <tr>
                    {table_1.header.map(function (cell, c) {
                            var _a;
                            return (<th key={c} style={{ textAlign: (_a = table_1.align[c]) !== null && _a !== void 0 ? _a : undefined }}>
                        {inline(cell.tokens)}
                      </th>);
                        })}
                  </tr>
                </thead>
                <tbody>
                  {table_1.rows.map(function (row, r) { return (<tr key={r}>
                      {row.map(function (cell, c) {
                                var _a;
                                return (<td key={c} style={{ textAlign: (_a = table_1.align[c]) !== null && _a !== void 0 ? _a : undefined }}>
                          {inline(cell.tokens)}
                        </td>);
                            })}
                    </tr>); })}
                </tbody>
              </table_1>
            </div>);
                }
                case 'hr':
                    return <hr key={i}/>;
                // Raw HTML is shown as the text it is, never run.
                case 'html':
                    return (<p key={i} class="nt-md-raw">
              {token.raw}
            </p>);
                default:
                    return <p key={i}>{token.raw}</p>;
            }
        });
    };
    var tokens = markdown.lexer(body);
    return <article class="nt-read">{body.trim() === '' ? <p class="hint">{en_1.t.notebook.readEmpty}</p> : blocks(tokens, true)}</article>;
};
exports.ReadView = ReadView;
