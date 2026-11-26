"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Every frame lasts a whole number of these.
var TICK_MS = 250;
var look = function (seg) { return (__assign(__assign(__assign({}, (seg.color === undefined ? {} : { color: seg.color })), (seg.backgroundColor === undefined ? {} : { backgroundColor: seg.backgroundColor })), (seg.bold === true ? { bold: true } : {}))); };
// The tea cup above the prompt, drawn on the surface: it plays the frames it
// is handed on the surface's own clock, so the steam moves with no work in
// the hooks module and nothing written. Pointing at it winks; a click goes to
// the hooks module, which opens or closes the menu.
var TeaCup = function (props, surface) {
    var _a, _b;
    var art = props;
    var _c = surface.elements, Box = _c.Box, Text = _c.Text;
    if (surface.state === undefined) {
        surface.setState({ tick: 0, isPointedAt: false });
        surface.every(TICK_MS, function () {
            var s = surface.state;
            if (s !== undefined)
                surface.setState(__assign(__assign({}, s), { tick: s.tick + 1 }));
        });
        surface.onPointer(function (e) {
            var s = surface.state;
            if (s !== undefined && (e.type === 'enter' || e.type === 'leave')) {
                surface.setState(__assign(__assign({}, s), { isPointedAt: e.type === 'enter' }));
            }
            if (e.type === 'down' && e.button === 'left')
                surface.post({ kind: 'press' });
        });
    }
    var s = (_a = surface.state) !== null && _a !== void 0 ? _a : { tick: 0, isPointedAt: false };
    var step = Math.max(1, Math.round(art.ms / TICK_MS));
    var shown = s.isPointedAt ? art.wink : ((_b = art.frames[Math.floor(s.tick / step) % art.frames.length]) !== null && _b !== void 0 ? _b : art.wink);
    return (<Box flexDirection="column">
      {shown.map(function (row) { return (<Text>
          {row.map(function (seg) { return (<Text {...look(seg)}>{seg.text}</Text>); })}
        </Text>); })}
    </Box>);
};
exports.default = TeaCup;
