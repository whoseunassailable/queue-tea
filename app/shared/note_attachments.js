"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentMarkdown = exports.noteFileUrl = exports.noteFilePath = exports.attachmentError = exports.extensionOf = exports.NOTE_IMAGE_EXTENSIONS = exports.NOTE_FILE_ACCEPT = exports.NOTE_FILE_LIMIT = exports.NOTE_ATTACHMENTS = exports.NOTE_FILE_SCHEME = void 0;
// Files stay portable: Markdown holds a relative vault path, never a machine's
// absolute path or the private URL the app uses to show a preview.
exports.NOTE_FILE_SCHEME = 'note-file';
exports.NOTE_ATTACHMENTS = 'attachments';
exports.NOTE_FILE_LIMIT = 10 * 1024 * 1024;
exports.NOTE_FILE_ACCEPT = 'image/*,application/pdf';
exports.NOTE_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'avif', 'svg'];
var extensionOf = function (name) { var _a, _b; return (_b = (_a = name.split('.').at(-1)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : ''; };
exports.extensionOf = extensionOf;
var attachmentError = function (file) {
    var extension = (0, exports.extensionOf)(file.name);
    var hasType = file.type.startsWith('image/') || file.type === 'application/pdf';
    var hasExtension = exports.NOTE_IMAGE_EXTENSIONS.includes(extension) || extension === 'pdf';
    if (!hasType && !(file.type === '' && hasExtension))
        return 'type';
    if (file.size >= exports.NOTE_FILE_LIMIT)
        return 'size';
    return undefined;
};
exports.attachmentError = attachmentError;
var noteFilePath = function (href) {
    // Decode components separately: an encoded slash may never add a folder.
    var parts = href.split('#')[0].split('/');
    if (parts.length > 2 || (parts.length === 2 && parts[0] !== exports.NOTE_ATTACHMENTS))
        return null;
    try {
        var names = parts.map(function (part) { return decodeURIComponent(part); });
        if (names.some(function (name) { return name === '' || name.startsWith('.') || name.includes('..') || /[\\/:\x00-\x1f\x7f?<>]/.test(name); }))
            return null;
        var leaf = names.at(-1);
        if (!/\.[a-z0-9]{1,10}$/i.test(leaf) || (0, exports.extensionOf)(leaf) === 'md')
            return null;
        return names.join('/');
    }
    catch (_a) {
        // A malformed percent escape is text, not a file link.
        return null;
    }
};
exports.noteFilePath = noteFilePath;
var noteFileUrl = function (realm, path) { return "".concat(exports.NOTE_FILE_SCHEME, "://realm/").concat(encodeURIComponent(realm), "/").concat(path.split('/').map(encodeURIComponent).join('/')); };
exports.noteFileUrl = noteFileUrl;
var attachmentMarkdown = function (file, name) {
    var label = name.replace(/[\r\n]/g, ' ').replace(/[\\[\]]/g, '\\$&');
    return "".concat(file.kind === 'image' ? '!' : '', "[").concat(label, "](<").concat(file.path.split('/').map(encodeURIComponent).join('/'), ">)");
};
exports.attachmentMarkdown = attachmentMarkdown;
