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
exports.handlesOf = exports.stepFrom = exports.duplicateLayer = exports.removeLayer = exports.resizeBox = exports.moveBy = exports.updateLayer = exports.placeOf = exports.parentOf = exports.layerOf = exports.pathTo = exports.DESIGN_FRAME = void 0;
var designs_1 = require("../../../../shared/designs");
// The design frame itself, when it's what is selected.
exports.DESIGN_FRAME = '#design';
var clamp = function (value, low, high) { return Math.min(high, Math.max(low, Math.round(value))); };
// The layer and the layers it sits in, outermost first; null when it's gone.
var pathTo = function (nodes, id) {
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var layer = nodes_1[_i];
        if (layer.id === id)
            return [layer];
        var inner = (0, exports.pathTo)((0, designs_1.childrenOf)(layer), id);
        if (inner !== null)
            return __spreadArray([layer], inner, true);
    }
    return null;
};
exports.pathTo = pathTo;
var layerOf = function (scene, id) { var _a, _b; return (_b = (_a = (0, exports.pathTo)(scene.nodes, id)) === null || _a === void 0 ? void 0 : _a.at(-1)) !== null && _b !== void 0 ? _b : null; };
exports.layerOf = layerOf;
var parentOf = function (scene, id) {
    var path = (0, exports.pathTo)(scene.nodes, id);
    return path === null || path.length < 2 ? null : path.at(-2).id;
};
exports.parentOf = parentOf;
// Where a layer's top-left corner sits in the design frame.
var placeOf = function (scene, id) {
    var path = (0, exports.pathTo)(scene.nodes, id);
    return path === null ? null : path.reduce(function (at, layer) { return ({ x: at.x + layer.x, y: at.y + layer.y }); }, { x: 0, y: 0 });
};
exports.placeOf = placeOf;
var mapLayers = function (nodes, id, change) {
    return nodes.flatMap(function (layer) {
        if (layer.id === id) {
            var changed = change(layer);
            return changed === null ? [] : [changed];
        }
        var children = (0, designs_1.childrenOf)(layer);
        return children.length === 0 ? [layer] : [__assign(__assign({}, layer), { children: mapLayers(children, id, change) })];
    });
};
// A layer with some fields changed, and every other field just as it was.
var updateLayer = function (scene, id, patch) {
    if (id === exports.DESIGN_FRAME)
        return __assign(__assign({}, scene), patch);
    return __assign(__assign({}, scene), { nodes: mapLayers(scene.nodes, id, function (layer) { return (__assign(__assign({}, layer), patch)); }) });
};
exports.updateLayer = updateLayer;
var moveBy = function (scene, id, dx, dy) {
    var layer = (0, exports.layerOf)(scene, id);
    if (layer === null)
        return scene;
    return (0, exports.updateLayer)(scene, id, { x: clamp(layer.x + dx, -designs_1.LIMITS.place, designs_1.LIMITS.place), y: clamp(layer.y + dy, -designs_1.LIMITS.place, designs_1.LIMITS.place) });
};
exports.moveBy = moveBy;
// The box after dragging one handle by dx, dy. With keepRatio, the side that
// moved least follows the one that moved most.
var resizeBox = function (start, handle, dx, dy, keepRatio) {
    var west = handle.includes('w');
    var north = handle.includes('n');
    var sideways = handle.includes('e') || west;
    var upright = handle.includes('s') || north;
    var width = sideways ? start.width + (west ? -dx : dx) : start.width;
    var height = upright ? start.height + (north ? -dy : dy) : start.height;
    if (keepRatio && start.width > 0 && start.height > 0) {
        var ratio = start.width / start.height;
        if (sideways && (!upright || Math.abs(width / start.width) >= Math.abs(height / start.height)))
            height = width / ratio;
        else
            width = height * ratio;
    }
    width = clamp(width, 1, designs_1.LIMITS.size);
    height = clamp(height, 1, designs_1.LIMITS.size);
    return { x: west ? start.x + start.width - width : start.x, y: north ? start.y + start.height - height : start.y, width: width, height: height };
};
exports.resizeBox = resizeBox;
var removeLayer = function (scene, id) { return (__assign(__assign({}, scene), { nodes: mapLayers(scene.nodes, id, function () { return null; }) })); };
exports.removeLayer = removeLayer;
var copyWithIds = function (layer, taken) {
    var id = (0, designs_1.freeId)(layer.name === '' ? layer.id : layer.name, taken);
    taken.add(id);
    var children = (0, designs_1.childrenOf)(layer);
    return __assign(__assign(__assign({}, structuredClone(layer)), { id: id }), (children.length === 0 ? {} : { children: children.map(function (child) { return copyWithIds(child, taken); }) }));
};
// A copy just below and right of the layer, above it, with ids of its own.
var duplicateLayer = function (scene, id) {
    var layer = (0, exports.layerOf)(scene, id);
    if (layer === null)
        return null;
    var taken = new Set((0, designs_1.layersOf)(scene.nodes).map(function (l) { return l.id; }));
    var copy = __assign(__assign({}, copyWithIds(layer, taken)), { x: clamp(layer.x + 16, -designs_1.LIMITS.place, designs_1.LIMITS.place), y: clamp(layer.y + 16, -designs_1.LIMITS.place, designs_1.LIMITS.place) });
    var after = function (nodes) {
        return nodes.flatMap(function (each) {
            if (each.id === id)
                return [each, copy];
            var children = (0, designs_1.childrenOf)(each);
            return children.length === 0 ? [each] : [__assign(__assign({}, each), { children: after(children) })];
        });
    };
    return { scene: __assign(__assign({}, scene), { nodes: after(scene.nodes) }), id: copy.id };
};
exports.duplicateLayer = duplicateLayer;
// Tab's order: every layer, parents before what they hold.
var stepFrom = function (scene, id, back) {
    var ids = (0, designs_1.layersOf)(scene.nodes).map(function (l) { return l.id; });
    if (ids.length === 0)
        return null;
    var at = id === null ? -1 : ids.indexOf(id);
    if (at === -1)
        return back ? ids.at(-1) : ids[0];
    return ids[(at + (back ? ids.length - 1 : 1)) % ids.length];
};
exports.stepFrom = stepFrom;
// A text grows with what it says, so only its width has handles.
var handlesOf = function (selected, layer) {
    if (selected === exports.DESIGN_FRAME)
        return ['e', 's', 'se'];
    if (layer !== null && (0, designs_1.isText)(layer))
        return ['e', 'w'];
    return ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
};
exports.handlesOf = handlesOf;
