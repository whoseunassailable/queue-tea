"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skyOf = exports.skyAt = void 0;
var skyAt = function (hour) {
    if (hour >= 5 && hour < 10)
        return 'morning';
    if (hour >= 10 && hour < 17)
        return 'day';
    return hour >= 17 && hour < 20 ? 'evening' : 'night';
};
exports.skyAt = skyAt;
var skyOf = function (choice, hour) { return (choice === 'auto' ? (0, exports.skyAt)(hour) : choice); };
exports.skyOf = skyOf;
