"use strict";
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
exports.bookmarkOf = void 0;
var note_bookmarks_1 = require("../../../../shared/note_bookmarks");
var ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
// Plain text from the page, shown as text and never as HTML.
var textOf = function (raw, limit) {
    var text = (raw !== null && raw !== void 0 ? raw : '')
        .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, function (whole, name) {
        var _a;
        if (name[0] !== '#')
            return (_a = ENTITIES[name.toLowerCase()]) !== null && _a !== void 0 ? _a : whole;
        var code = /^#x/i.test(name) ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
        return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
    })
        .replace(/[\s\x00-\x1f\x7f]+/g, ' ')
        .trim();
    if (text === '')
        return null;
    return text.length > limit ? "".concat(text.slice(0, limit - 1), "\u2026") : text;
};
// A page's own title and description, from its Open Graph tags first.
// shortcut: reads meta tags with patterns, not an HTML parser; a page that
// hides them in odd markup just shows no preview.
var bookmarkOf = function (url, html) {
    var _a, _b, _c, _d;
    var metas = new Map();
    for (var _i = 0, _e = html.matchAll(/<meta\b[^>]*>/gi); _i < _e.length; _i++) {
        var tag = _e[_i][0];
        var attrs = new Map(__spreadArray([], tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g), true).map(function (found) { var _a, _b, _c; return [found[1].toLowerCase(), (_c = (_b = (_a = found[2]) !== null && _a !== void 0 ? _a : found[3]) !== null && _b !== void 0 ? _b : found[4]) !== null && _c !== void 0 ? _c : '']; }));
        var key = (_b = ((_a = attrs.get('property')) !== null && _a !== void 0 ? _a : attrs.get('name'))) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        var content = attrs.get('content');
        if (key !== undefined && content !== undefined && !metas.has(key))
            metas.set(key, content);
    }
    var first = function (keys, limit) { var _a; return (_a = keys.map(function (key) { return textOf(metas.get(key), limit); }).find(function (text) { return text !== null; })) !== null && _a !== void 0 ? _a : null; };
    return {
        url: url,
        title: (_c = first(['og:title', 'twitter:title'], note_bookmarks_1.BOOKMARK_LIMITS.title)) !== null && _c !== void 0 ? _c : textOf((_d = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)) === null || _d === void 0 ? void 0 : _d[1], note_bookmarks_1.BOOKMARK_LIMITS.title),
        description: first(['og:description', 'twitter:description', 'description'], note_bookmarks_1.BOOKMARK_LIMITS.description),
        site: first(['og:site_name'], note_bookmarks_1.BOOKMARK_LIMITS.site),
    };
};
exports.bookmarkOf = bookmarkOf;
