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
exports.cut = void 0;
// Cuts a text to `width` cells with an ellipsis.
var cut = function (text, width) {
    var chars = __spreadArray([], text, true);
    if (width <= 0)
        return '';
    return chars.length <= width ? text : "".concat(chars.slice(0, Math.max(0, width - 1)).join(''), "\u2026");
};
exports.cut = cut;
