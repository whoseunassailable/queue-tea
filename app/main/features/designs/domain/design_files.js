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
exports.parseComments = exports.parseVersion = exports.parseScene = exports.checkScene = exports.parseJson = exports.lineOf = void 0;
var designs_1 = require("../../../../shared/designs");
var messages_1 = require("../../../core/messages");
var F = messages_1.MESSAGES.designFaults;
var isObject = function (value) { return typeof value === 'object' && value !== null && !Array.isArray(value); };
var isNumberIn = function (value, low, high) { return typeof value === 'number' && Number.isFinite(value) && value >= low && value <= high; };
var isText = function (value, most) { return typeof value === 'string' && value.trim() !== '' && value.length <= most; };
// Where JSON.parse stopped, as a line: newer engines say it, older ones give
// the position, and an unexpected token comes with only the text round it.
var lineOf = function (text, message) {
    // V8 quotes 10 characters either side of the token, with ... where it cut;
    // checked first, since the quoted text could itself say "line 5".
    var near = /, (\.\.\.)?"([\s\S]*)"(\.\.\.)? is not valid JSON$/.exec(message);
    if (near !== null) {
        var cutBefore = near[1], _a = near[2], quoted = _a === void 0 ? '' : _a, cutAfter = near[3];
        // The whole text quoted, which V8 does under 21 characters, says nothing of where.
        if (cutBefore === undefined && cutAfter === undefined)
            return null;
        // shortcut: takes the first place the quoted text appears; a 20-character run repeated before the mistake would name an earlier line.
        var start = text.indexOf(quoted);
        if (start === -1)
            return null;
        return text.slice(0, cutBefore === undefined ? quoted.length - 10 : start + 10).split('\n').length;
    }
    var said = /line (\d+)/.exec(message);
    if (said !== null)
        return Number(said[1]);
    var at = /position (\d+)/.exec(message);
    return at === null ? null : text.slice(0, Number(at[1])).split('\n').length;
};
exports.lineOf = lineOf;
var parseJson = function (text) {
    try {
        return { ok: true, value: JSON.parse(text) };
    }
    catch (err) {
        // The parser's own words never reach the window; only the line does.
        var line = (0, exports.lineOf)(text, err instanceof Error ? err.message : '');
        return { ok: false, detail: line === null ? F.unplacedMistake : F.mistakeNear(line) };
    }
};
exports.parseJson = parseJson;
var fault = F.noUsable;
// The first thing wrong with one layer and what it holds, or null.
var layerFault = function (value, ids, depth, count) {
    if (!isObject(value))
        return F.notALayer;
    count.n += 1;
    if (count.n > designs_1.LIMITS.layers)
        return F.tooManyLayers(designs_1.LIMITS.layers);
    if (depth > designs_1.LIMITS.depth)
        return F.tooDeep(designs_1.LIMITS.depth);
    if (!isText(value.id, 100))
        return F.layerNoId;
    var where = F.theLayer(typeof value.name === 'string' && value.name !== '' ? value.name : value.id);
    if (ids.has(value.id))
        return F.sharedId(where);
    ids.add(value.id);
    if (typeof value.type !== 'string')
        return fault(where, 'type');
    if (typeof value.name !== 'string')
        return fault(where, 'name');
    if (!isNumberIn(value.x, -designs_1.LIMITS.place, designs_1.LIMITS.place))
        return fault(where, 'x');
    if (!isNumberIn(value.y, -designs_1.LIMITS.place, designs_1.LIMITS.place))
        return fault(where, 'y');
    if (!isNumberIn(value.width, 0, designs_1.LIMITS.size))
        return fault(where, 'width');
    if (value.height !== undefined && !isNumberIn(value.height, 0, designs_1.LIMITS.size))
        return fault(where, 'height');
    if (value.type === 'text') {
        if (typeof value.text !== 'string')
            return fault(where, 'text');
        if (typeof value.font !== 'string')
            return fault(where, 'font');
        if (!isNumberIn(value.size, 1, designs_1.LIMITS.fontSize))
            return fault(where, 'size');
        if (!isNumberIn(value.weight, 100, 900))
            return fault(where, 'weight');
        if (!(0, designs_1.isHex)(value.color))
            return fault(where, 'color');
        if (value.align !== undefined && !['left', 'center', 'right'].includes(value.align))
            return fault(where, 'align');
    }
    if (value.type === 'frame') {
        if (!isNumberIn(value.height, 0, designs_1.LIMITS.size))
            return fault(where, 'height');
        if (value.fill !== undefined && !(0, designs_1.isHex)(value.fill))
            return fault(where, 'fill');
        if (value.radius !== undefined && !isNumberIn(value.radius, 0, designs_1.LIMITS.radius))
            return fault(where, 'radius');
        if (value.stroke !== undefined && !(isObject(value.stroke) && (0, designs_1.isHex)(value.stroke.color) && isNumberIn(value.stroke.width, 0, 100)))
            return fault(where, 'stroke');
        if (value.children !== undefined) {
            if (!Array.isArray(value.children))
                return fault(where, 'children');
            for (var _i = 0, _a = value.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var wrong = layerFault(child, ids, depth + 1, count);
                if (wrong !== null)
                    return wrong;
            }
        }
    }
    return null;
};
// A design as read from disk or sent by the window, checked the same way.
var checkScene = function (value) {
    if (!isObject(value))
        return { ok: false, detail: F.notADesign };
    if (!isNumberIn(value.format, 1, 1))
        return { ok: false, detail: F.unknownFormat };
    if (!isText(value.name, designs_1.LIMITS.title))
        return { ok: false, detail: fault(F.theDesign, 'name') };
    if (!isNumberIn(value.width, 1, designs_1.LIMITS.size))
        return { ok: false, detail: fault(F.theDesign, 'width') };
    if (!isNumberIn(value.height, 1, designs_1.LIMITS.size))
        return { ok: false, detail: fault(F.theDesign, 'height') };
    if (!(0, designs_1.isHex)(value.fill))
        return { ok: false, detail: fault(F.theDesign, 'fill') };
    if (!Array.isArray(value.nodes))
        return { ok: false, detail: fault(F.theDesign, 'layers') };
    var ids = new Set();
    var count = { n: 0 };
    for (var _i = 0, _a = value.nodes; _i < _a.length; _i++) {
        var layer = _a[_i];
        var wrong = layerFault(layer, ids, 1, count);
        if (wrong !== null)
            return { ok: false, detail: wrong };
    }
    return { ok: true, value: value };
};
exports.checkScene = checkScene;
var then = function (text, check) {
    var parsed = (0, exports.parseJson)(text);
    return parsed.ok ? check(parsed.value) : parsed;
};
var parseScene = function (text) { return then(text, exports.checkScene); };
exports.parseScene = parseScene;
var nextOf = function (value) {
    if (value === undefined || value === null)
        return null;
    return isObject(value) && isText(value.label, designs_1.LIMITS.label) && isText(value.quest, designs_1.LIMITS.title) ? { label: value.label, quest: value.quest } : undefined;
};
var approvalOf = function (value) {
    if (value === undefined || value === null)
        return null;
    return isObject(value) && isText(value.by, 100) && typeof value.at === 'string' && !Number.isNaN(Date.parse(value.at)) ? { by: value.by, at: value.at } : undefined;
};
var parseVersion = function (text) {
    return then(text, function (value) {
        var _a;
        if (!isObject(value))
            return { ok: false, detail: F.notAVersion };
        if (!isNumberIn(value.format, 1, 1))
            return { ok: false, detail: F.unknownFormat };
        if (!isText(value.label, designs_1.LIMITS.label))
            return { ok: false, detail: fault(F.theVersion, 'label') };
        if (value.designs !== undefined && !(Array.isArray(value.designs) && value.designs.every(designs_1.isDesignId)))
            return { ok: false, detail: fault(F.theVersion, 'list of designs') };
        var next = nextOf(value.next);
        if (next === undefined)
            return { ok: false, detail: fault(F.theVersion, 'next version') };
        var approved = approvalOf(value.approved);
        if (approved === undefined)
            return { ok: false, detail: fault(F.theVersion, 'approval') };
        return {
            ok: true,
            value: __assign(__assign({}, value), { format: value.format, label: value.label, made: typeof value.made === 'string' ? value.made : null, by: value.by === 'claude' || value.by === 'you' ? value.by : null, from: typeof value.from === 'string' ? value.from : null, designs: (_a = value.designs) !== null && _a !== void 0 ? _a : [], next: next, approved: approved }),
        };
    });
};
exports.parseVersion = parseVersion;
var isComment = function (value) {
    return isObject(value) &&
        isText(value.id, 100) &&
        (0, designs_1.isDesignId)(value.design) &&
        (value.on === null || typeof value.on === 'string') &&
        typeof value.text === 'string' &&
        typeof value.by === 'string' &&
        typeof value.at === 'string' &&
        (value.resolved === null || typeof value.resolved === 'string') &&
        (value.sentTo === null || typeof value.sentTo === 'string');
};
var parseComments = function (text) {
    return then(text, function (value) {
        if (!isObject(value) || !Array.isArray(value.comments))
            return { ok: false, detail: F.notComments };
        if (!value.comments.every(isComment))
            return { ok: false, detail: F.commentMissing };
        return { ok: true, value: __assign(__assign({}, value), { format: typeof value.format === 'number' ? value.format : 1, comments: value.comments }) };
    });
};
exports.parseComments = parseComments;
