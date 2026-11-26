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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var notes_1 = require("../../../../../shared/notes");
var en_1 = require("../../../../l10n/en");
var test_support_1 = require("../../../../test_support");
var read_view_1 = require("./read_view");
(0, vitest_1.afterEach)(preact_1.cleanup);
var line = function (title, state) { return ({ title: title, state: state, priority: 'mid', difficulty: 'medium' }); };
var callbacks = function () { return ({ engine: (0, test_support_1.fakeEngine)().engine, realm: 'demo-abc123', isLive: true, notes: [], onToggle: vitest_1.vi.fn(), onOpenNote: vitest_1.vi.fn(), onOpenQuest: vitest_1.vi.fn(), onOpenLink: vitest_1.vi.fn() }); };
(0, vitest_1.describe)('quest links in Read', function () {
    (0, vitest_1.it)('opens the linked id and redraws the title and state when the quest changes', function () {
        var props = __assign(__assign({}, callbacks()), { body: 'See [[quest:t-abc|Original title]].' });
        var rerender = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line('Current title', 'waiting')]])}/>).rerender;
        preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.notebook.openQuestLink('Current title', 'waiting') }));
        (0, vitest_1.expect)(props.onOpenQuest).toHaveBeenCalledWith('t-abc');
        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.questState.waiting)).toBeTruthy();
        rerender(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line('Renamed quest', 'active')]])}/>);
        (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.openQuestLink('Renamed quest', 'in progress') })).toBeTruthy();
        (0, vitest_1.expect)(preact_1.screen.queryByText('Current title')).toBeNull();
        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.questState.active)).toBeTruthy();
    });
    (0, vitest_1.it)('renders done and missing quests as text, preserving the written title when missing', function () {
        var props = __assign(__assign({}, callbacks()), { body: '[[quest:t-abc|Old]] and [[quest:t-def|Missing quest]]' });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line('Finished quest', 'done')]])}/>).container;
        (0, vitest_1.expect)(preact_1.screen.queryByRole('button')).toBeNull();
        (0, vitest_1.expect)(preact_1.screen.getByText('Finished quest')).toBeTruthy();
        (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.notebook.questState.done)).toBeTruthy();
        (0, vitest_1.expect)(preact_1.screen.getByText('Missing quest').classList.contains('nt-md-broken')).toBe(true);
        (0, vitest_1.expect)(container.textContent).toContain(en_1.t.notebook.questState.gone);
    });
    (0, vitest_1.it)('keeps a quest link whole when its written title contains Markdown or HTML', function () {
        var title = 'Fix `input` and **output** <img src=x> & café';
        var props = __assign(__assign({}, callbacks()), { body: "Before [[".concat((0, notes_1.questLinkOf)('t-abc', title), "]] after.") });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line(title, 'sealed')]])}/>).container;
        (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.openQuestLink(title, 'sealed') }).textContent).toBe(title);
        (0, vitest_1.expect)(container.querySelector('img')).toBeNull();
        (0, vitest_1.expect)(container.textContent).toContain('Before ');
        (0, vitest_1.expect)(container.textContent).toContain(' after.');
    });
    (0, vitest_1.it)('leaves quest syntax inside code as code', function () {
        var props = __assign(__assign({}, callbacks()), { body: '`[[quest:t-abc|Example]]`\n\n```md\n[[quest:t-abc|Example]]\n```' });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line('Example', 'waiting')]])}/>).container;
        (0, vitest_1.expect)(preact_1.screen.queryByRole('button')).toBeNull();
        (0, vitest_1.expect)(__spreadArray([], container.querySelectorAll('code'), true).map(function (code) { return code.textContent; })).toEqual(['[[quest:t-abc|Example]]', '[[quest:t-abc|Example]]']);
    });
});
(0, vitest_1.it)('renders a quest link beside image and PDF attachments in the same note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var props, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                props = __assign(__assign({}, callbacks()), { body: '[[quest:t-abc|Fix **image**]]\n\n![[attachments/photo.png|Screenshot]]\n\n[Report](attachments/report.pdf)\n\n`[[quest:t-abc|Example]]`' });
                (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map([['t-abc', line('Fix image', 'active')]])}/>);
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: en_1.t.notebook.openQuestLink('Fix image', 'in progress') })).toBeTruthy();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByAltText('Screenshot')];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBeTruthy();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Preview PDF: Report' })];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('[[quest:t-abc|Example]]').tagName).toBe('CODE');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('bookmarks in Read', function () {
    var URL_ = 'https://example.com/post';
    var cards = function (container) { return container.querySelectorAll('.nt-bookmark'); };
    (0, vitest_1.it)('turns a link alone on its line into a card with the page’s title, description and site', function () { return __awaiter(void 0, void 0, void 0, function () {
        var props, container, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    props = __assign(__assign({}, callbacks()), { body: URL_ });
                    container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>).container;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('link', { name: en_1.t.notebook.openBookmark('Example page', 'example.com') })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('What the page is about.')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Example · example.com')).toBeTruthy();
                    (0, vitest_1.expect)(cards(container)).toHaveLength(1);
                    (0, vitest_1.expect)(props.engine.readBookmark).toHaveBeenCalledWith(URL_);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('makes a card of a link on the line right after a text line, keeping the text around it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    container = (0, preact_1.render)(<read_view_1.ReadView {...callbacks()} body={"Read this:\n".concat(URL_, "\nThen reply.")} quests={new Map()}/>).container;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('link', { name: en_1.t.notebook.openBookmark('Example page', 'example.com') })];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(__spreadArray([], container.querySelectorAll('p'), true).map(function (p) { return p.textContent; })).toContain('Read this:');
                    (0, vitest_1.expect)(container.textContent).toContain('Then reply.');
                    (0, vitest_1.expect)(cards(container)).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves a link inside a sentence and links in code as they are', function () {
        var props = __assign(__assign({}, callbacks()), { body: "See ".concat(URL_, " today.\n\n    ").concat(URL_, "\n\n```\n").concat(URL_, "\n```") });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>).container;
        (0, vitest_1.expect)(cards(container)).toHaveLength(0);
        (0, vitest_1.expect)(preact_1.screen.getByRole('link', { name: URL_ }).classList.contains('nt-md-link')).toBe(true);
        (0, vitest_1.expect)(__spreadArray([], container.querySelectorAll('pre code'), true).map(function (code) { var _a; return (_a = code.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })).toEqual([URL_, URL_]);
        (0, vitest_1.expect)(props.engine.readBookmark).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('leaves a link alone in a list item as a plain link that opens', function () {
        var props = __assign(__assign({}, callbacks()), { body: "- ".concat(URL_, "\n- [ ] ").concat(URL_, "\n1. ").concat(URL_) });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>).container;
        (0, vitest_1.expect)(cards(container)).toHaveLength(0);
        var links = preact_1.screen.getAllByRole('link', { name: URL_ });
        (0, vitest_1.expect)(links).toHaveLength(3);
        for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
            var link = links_1[_i];
            (0, vitest_1.expect)(link.classList.contains('nt-md-link')).toBe(true);
            (0, vitest_1.expect)(link.closest('li')).not.toBeNull();
            preact_1.fireEvent.click(link);
        }
        (0, vitest_1.expect)(props.onOpenLink.mock.calls).toEqual([[URL_], [URL_], [URL_]]);
        (0, vitest_1.expect)(props.engine.readBookmark).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('leaves a link alone in a quote as a plain link that opens', function () {
        var props = __assign(__assign({}, callbacks()), { body: "> ".concat(URL_) });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>).container;
        (0, vitest_1.expect)(cards(container)).toHaveLength(0);
        var link = preact_1.screen.getByRole('link', { name: URL_ });
        (0, vitest_1.expect)(link.classList.contains('nt-md-link')).toBe(true);
        (0, vitest_1.expect)(link.closest('blockquote')).not.toBeNull();
        preact_1.fireEvent.click(link);
        (0, vitest_1.expect)(props.onOpenLink).toHaveBeenCalledWith(URL_);
        (0, vitest_1.expect)(props.engine.readBookmark).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('leaves a link alone in a callout’s body as a plain link that opens', function () {
        var _a;
        var props = __assign(__assign({}, callbacks()), { body: "> [!note] Reading\n> ".concat(URL_) });
        var container = (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>).container;
        (0, vitest_1.expect)(cards(container)).toHaveLength(0);
        var link = preact_1.screen.getByRole('link', { name: URL_ });
        (0, vitest_1.expect)(link.classList.contains('nt-md-link')).toBe(true);
        (0, vitest_1.expect)((_a = link.closest('aside.nt-md-callout')) === null || _a === void 0 ? void 0 : _a.getAttribute('aria-label')).toBe('Reading');
        preact_1.fireEvent.click(link);
        (0, vitest_1.expect)(props.onOpenLink).toHaveBeenCalledWith(URL_);
        (0, vitest_1.expect)(props.engine.readBookmark).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('says it is reading the page, and the title opens the link while it waits', function () {
        var props = __assign(__assign({}, callbacks()), { engine: (0, test_support_1.fakeEngine)({ readBookmark: function () { return new Promise(function () { }); } }).engine, body: URL_ });
        (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>);
        (0, vitest_1.expect)(preact_1.screen.getByRole('status').textContent).toContain(en_1.t.notebook.readingBookmark);
        preact_1.fireEvent.click(preact_1.screen.getByRole('link', { name: en_1.t.notebook.openBookmark('example.com', 'example.com') }));
        (0, vitest_1.expect)(props.onOpenLink).toHaveBeenCalledWith(URL_);
    });
    (0, vitest_1.it)('says there is no preview for a page with no title or description, and names it by its host', function () { return __awaiter(void 0, void 0, void 0, function () {
        var props, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    props = __assign(__assign({}, callbacks()), { engine: (0, test_support_1.fakeEngine)({ readBookmark: function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: { url: url, title: null, description: null, site: null } })];
                            }); }); } }).engine, body: URL_ });
                    (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByText(en_1.t.notebook.noBookmarkPreview)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('status')).toBeNull();
                    preact_1.fireEvent.click(preact_1.screen.getByRole('link', { name: en_1.t.notebook.openBookmark('example.com', 'example.com') }));
                    (0, vitest_1.expect)(props.onOpenLink).toHaveBeenCalledWith(URL_);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('shows the host once when the site name is the host', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, preact_1.render)(<read_view_1.ReadView {...callbacks()} engine={(0, test_support_1.fakeEngine)({ readBookmark: function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: { url: url, title: 'Post', description: null, site: 'example.com' } })];
                        }); }); } }).engine} body={URL_} quests={new Map()}/>);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('link', { name: en_1.t.notebook.openBookmark('Post', 'example.com') })];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)((_b = document.querySelector('.nt-bookmark-site')) === null || _b === void 0 ? void 0 : _b.textContent).toBe('example.com');
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.notebook.noBookmarkPreview)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why a read failed, still opens the link, and Try again reads the page anew', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine, props, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    engine = (0, test_support_1.fakeEngine)().engine;
                    vitest_1.vi.mocked(engine.readBookmark).mockResolvedValueOnce({ ok: false, error: { message: 'That page took too long to answer. Try again.' } });
                    props = __assign(__assign({}, callbacks()), { engine: engine, body: URL_ });
                    (0, preact_1.render)(<read_view_1.ReadView {...props} quests={new Map()}/>);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 1:
                    _a.apply(void 0, [(_c.sent()).textContent]).toContain('That page took too long to answer.');
                    preact_1.fireEvent.click(preact_1.screen.getByRole('link', { name: en_1.t.notebook.openBookmark('example.com', 'example.com') }));
                    (0, vitest_1.expect)(props.onOpenLink).toHaveBeenCalledWith(URL_);
                    preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: en_1.t.failed.tryAgain }));
                    _b = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('link', { name: en_1.t.notebook.openBookmark('Example page', 'example.com') })];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.queryByRole('alert')).toBeNull();
                    (0, vitest_1.expect)(engine.readBookmark).toHaveBeenCalledTimes(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
