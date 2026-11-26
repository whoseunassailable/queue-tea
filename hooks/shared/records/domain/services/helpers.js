"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyHelpers = exports.readHelpers = exports.defaultHelpers = exports.isHelperId = exports.HELPER_IDS = void 0;
// One list that the mod, the app's main-process check and the Guild Hall all read.
exports.HELPER_IDS = ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd'];
var isHelperId = function (value) {
    return exports.HELPER_IDS.includes(value);
};
exports.isHelperId = isHelperId;
var defaultHelpers = function () { return ({ on: ['tea-dd'], ran: [], reminded: false }); };
exports.defaultHelpers = defaultHelpers;
// Reads a hand-edited helpers field: anything that isn't a list falls back.
var readHelpers = function (value) {
    var h = (value !== null && value !== void 0 ? value : {});
    var list = function (v, fallback) { return (Array.isArray(v) ? (0, exports.onlyHelpers)(v.filter(exports.isHelperId)) : fallback); };
    return { on: list(h.on, (0, exports.defaultHelpers)().on), ran: list(h.ran, []), reminded: h.reminded === true };
};
exports.readHelpers = readHelpers;
var onlyHelpers = function (ids) {
    return exports.HELPER_IDS.filter(function (id) { return ids.includes(id); });
};
exports.onlyHelpers = onlyHelpers;
