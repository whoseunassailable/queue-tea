"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderName = exports.orderError = void 0;
var engine_api_1 = require("../../../../shared/engine_api");
var en_1 = require("../../../l10n/en");
// The order field's error, or undefined when the order can go.
var orderError = function (order) {
    var text = order.trim();
    if (text === '')
        return en_1.t.guild.orderRequired;
    return text.length > engine_api_1.HELPER_ORDER_CHARS ? en_1.t.guild.orderLong(engine_api_1.HELPER_ORDER_CHARS) : undefined;
};
exports.orderError = orderError;
var folderName = function (path) { var _a; return (_a = path.split('/').filter(Boolean).pop()) !== null && _a !== void 0 ? _a : path; };
exports.folderName = folderName;
