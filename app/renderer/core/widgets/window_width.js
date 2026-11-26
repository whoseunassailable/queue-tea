"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWindowWidth = void 0;
var hooks_1 = require("preact/hooks");
// The window's width, for the layouts CSS can't decide alone.
var useWindowWidth = function () {
    var _a = (0, hooks_1.useState)(function () { return window.innerWidth; }), width = _a[0], setWidth = _a[1];
    (0, hooks_1.useEffect)(function () {
        var heard = function () { return setWidth(window.innerWidth); };
        window.addEventListener('resize', heard);
        return function () { return window.removeEventListener('resize', heard); };
    }, []);
    return width;
};
exports.useWindowWidth = useWindowWidth;
