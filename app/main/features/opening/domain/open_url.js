"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathFromUrl = void 0;
var SCHEME = 'queue-tea:';
var ACTION = 'open';
// The folder a link names, or null when it isn't a link we made. A link can come
// from anywhere, so this is the whole of what it can say.
var pathFromUrl = function (url) {
    var parsed;
    try {
        parsed = new URL(url);
    }
    catch (_a) {
        // Not a URL at all, which is what the null says.
        return null;
    }
    if (parsed.protocol !== SCHEME || parsed.hostname !== ACTION)
        return null;
    var path = parsed.searchParams.get('path');
    if (path === null || !path.startsWith('/') || path.includes('\0'))
        return null;
    return path.length > 1 ? path.replace(/\/+$/, '') : path;
};
exports.pathFromUrl = pathFromUrl;
