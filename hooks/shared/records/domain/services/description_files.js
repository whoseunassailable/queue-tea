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
exports.notesFolderOf = exports.withFilePaths = exports.descriptionFiles = exports.NOTES_FOLDER = void 0;
// Files a quest's description links. The app saves them in the realm's notes
// folder and writes the link Notes writes; only the first message to Claude
// turns them into paths on this machine.
exports.NOTES_FOLDER = '.queue-tea/notes';
// Only content-hashed attachments Queue-tea saved, never a hand-typed path.
var LINK = /(!?)\[((?:\\.|[^\\\]])*)\]\(<?(attachments\/[0-9a-f]{64}\.[a-z0-9]{1,10})>?\)/g;
var descriptionFiles = function (text) {
    return __spreadArray([], (text !== null && text !== void 0 ? text : '').matchAll(LINK), true).map(function (_a) {
        var bang = _a[1], label = _a[2], path = _a[3];
        return ({ name: label.replace(/\\(.)/g, '$1'), path: path, isImage: bang === '!' });
    });
};
exports.descriptionFiles = descriptionFiles;
var withFilePaths = function (text, folder) {
    return text.replace(LINK, function (_, bang, label, path) { return "".concat(bang, "[").concat(label, "](<").concat(folder, "/").concat(path, ">)"); });
};
exports.withFilePaths = withFilePaths;
// The realm's notes folder, named by the same key as its record file.
var notesFolderOf = function (ctx) {
    return "".concat(ctx.home, "/").concat(exports.NOTES_FOLDER, "/").concat(ctx.file.split('/').at(-1).replace(/\.json$/, ''));
};
exports.notesFolderOf = notesFolderOf;
