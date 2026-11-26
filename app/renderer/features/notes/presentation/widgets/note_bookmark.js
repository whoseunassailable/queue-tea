"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteBookmark = void 0;
var hooks_1 = require("preact/hooks");
var engine_client_1 = require("../../../../core/api/engine_client");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
// The link opens in every state; the preview only adds the page's own words.
var NoteBookmark = function (_a) {
    var _b;
    var engine = _a.engine, url = _a.url, onOpenLink = _a.onOpenLink;
    var _c = (0, hooks_1.useState)({ kind: 'loading' }), state = _c[0], setState = _c[1];
    var _d = (0, hooks_1.useState)(0), attempt = _d[0], setAttempt = _d[1];
    (0, hooks_1.useEffect)(function () {
        var isCurrent = true;
        setState({ kind: 'loading' });
        void (0, engine_client_1.ask)(engine, function () { return engine.readBookmark(url); }).then(function (answer) {
            if (isCurrent)
                setState(answer.ok ? { kind: 'ready', bookmark: answer.data } : { kind: 'failed', message: answer.message });
        });
        return function () { isCurrent = false; };
    }, [url, attempt]);
    // The Read view passes only links bookmarkUrlOf accepted, so this parses.
    var host = new URL(url).host;
    var shown = state.kind === 'ready' ? state.bookmark : null;
    var title = (_b = shown === null || shown === void 0 ? void 0 : shown.title) !== null && _b !== void 0 ? _b : host;
    return <div class="nt-bookmark">
    <a href={url} class="nt-bookmark-title" title={url} aria-label={en_1.t.notebook.openBookmark(title, host)} onClick={function (event) {
            event.preventDefault();
            onOpenLink(url);
        }}>{title}</a>
    {(shown === null || shown === void 0 ? void 0 : shown.description) != null && <p class="nt-bookmark-text">{shown.description}</p>}
    <span class="nt-bookmark-site">{(shown === null || shown === void 0 ? void 0 : shown.site) != null && shown.site !== host ? "".concat(shown.site, " \u00B7 ").concat(host) : host}</span>
    {state.kind === 'loading' && <span class="nt-file-status" role="status"><states_1.Spinner /> {en_1.t.notebook.readingBookmark}</span>}
    {shown !== null && shown.title === null && shown.description === null && <span class="nt-file-status">{en_1.t.notebook.noBookmarkPreview}</span>}
    {state.kind === 'failed' && <span class="nt-file-status" role="alert">{state.message}{' '}<button type="button" class="chip-btn" onClick={function () { return setAttempt(attempt + 1); }}>{en_1.t.failed.tryAgain}</button></span>}
  </div>;
};
exports.NoteBookmark = NoteBookmark;
