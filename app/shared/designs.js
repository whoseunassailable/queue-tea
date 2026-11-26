"use strict";
// A realm's designs, as main reads them from <realm>/docs/designs/ and the
// window shows and edits them. docs/design-tab.md has the file format.
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
exports.freeId = exports.suggestLabel = exports.isHex = exports.isDesignId = exports.isFolderName = exports.folderOf = exports.isOpen = exports.layersOf = exports.childrenOf = exports.isText = exports.isFrame = exports.LIMITS = exports.DESIGN_FORMAT = exports.DESIGNS_FOLDER = void 0;
exports.DESIGNS_FOLDER = 'docs/designs';
exports.DESIGN_FORMAT = 1;
exports.LIMITS = { label: 40, comment: 2000, title: 200, size: 10000, place: 10000, radius: 1000, fontSize: 400, layers: 2000, depth: 20, bytes: 2 * 1024 * 1024 };
var isFrame = function (layer) { return layer.type === 'frame'; };
exports.isFrame = isFrame;
var isText = function (layer) { return layer.type === 'text'; };
exports.isText = isText;
var childrenOf = function (layer) { return ((0, exports.isFrame)(layer) && Array.isArray(layer.children) ? layer.children : []); };
exports.childrenOf = childrenOf;
// Every layer, parents before children, in drawing order.
var layersOf = function (nodes) { return nodes.flatMap(function (layer) { return __spreadArray([layer], (0, exports.layersOf)((0, exports.childrenOf)(layer)), true); }); };
exports.layersOf = layersOf;
// Open: not resolved, and not sent to a next version yet.
var isOpen = function (c) { return c.resolved === null && c.sentTo === null; };
exports.isOpen = isOpen;
// A version's folder: its label, lower-cased, every run of other characters one -.
var folderOf = function (label) {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/\.{2,}/g, '.')
        .replace(/^[-.]+|[-.]+$/g, '')
        .slice(0, 60);
};
exports.folderOf = folderOf;
var isFolderName = function (value) { return typeof value === 'string' && /^[a-z0-9]([a-z0-9.-]{0,58}[a-z0-9])?$/.test(value) && !value.includes('..'); };
exports.isFolderName = isFolderName;
var isDesignId = function (value) { return typeof value === 'string' && /^[a-z0-9]([a-z0-9-]{0,58}[a-z0-9])?$/.test(value); };
exports.isDesignId = isDesignId;
var isHex = function (value) { return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value); };
exports.isHex = isHex;
// The label after this one: its last number plus one, or " 2" when it has
// none, skipping any already taken.
var suggestLabel = function (label, taken) {
    var used = new Set(taken.map(exports.folderOf));
    var match = /^(.*?)(\d+)(\D*)$/.exec(label);
    var at = function (n) { return (match === null ? "".concat(label, " ").concat(n) : "".concat(match[1]).concat(n).concat(match[3])); };
    var n = match === null ? 2 : Number(match[2]) + 1;
    while (used.has((0, exports.folderOf)(at(n))))
        n += 1;
    return at(n);
};
exports.suggestLabel = suggestLabel;
// An id for a design or layer that isn't taken: the name in folder form, then -2, -3…
var freeId = function (name, taken) {
    var base = (0, exports.folderOf)(name).replace(/\./g, '-').slice(0, 55).replace(/-+$/, '') || 'layer';
    if (!taken.has(base))
        return base;
    var n = 2;
    while (taken.has("".concat(base, "-").concat(n)))
        n += 1;
    return "".concat(base, "-").concat(n);
};
exports.freeId = freeId;
