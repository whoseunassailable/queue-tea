"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkUrlOf = exports.BOOKMARK_LIMITS = exports.BOOKMARK_URL_LIMIT = void 0;
exports.BOOKMARK_URL_LIMIT = 2048;
// A preview reads only a page's head: these keep a slow or huge page from
// holding the Read view, and the cache keeps turning to Read from fetching again.
exports.BOOKMARK_LIMITS = { timeoutMs: 5000, bytes: 512 * 1024, redirects: 5, cache: 200, title: 200, description: 300, site: 80 };
var bookmarkUrlOf = function (text) {
    var url = text.trim();
    if (url === '' || url.length > exports.BOOKMARK_URL_LIMIT || /\s/.test(url))
        return null;
    try {
        return ['http:', 'https:'].includes(new URL(url).protocol) ? url : null;
    }
    catch (_a) {
        // Text that isn't a URL is no bookmark.
        return null;
    }
};
exports.bookmarkUrlOf = bookmarkUrlOf;
