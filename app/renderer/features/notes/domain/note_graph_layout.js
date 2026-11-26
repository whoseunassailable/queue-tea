"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextNode = exports.nodeAt = exports.layoutOf = void 0;
var d3_force_1 = require("d3-force");
var constants_1 = require("../../../core/constants/constants");
var layoutOf = function (input, onProgress) {
    var bodies = input.ids.map(function (id) {
        var start = input.start.get(id);
        var body = start === undefined ? { id: id } : { id: id, x: start.x, y: start.y };
        if (id === input.centre) {
            body.fx = 0;
            body.fy = 0;
        }
        return body;
    });
    var kept = input.ids.filter(function (id) { return input.start.has(id); }).length;
    var simulation = (0, d3_force_1.forceSimulation)(bodies)
        .stop()
        .force('link', (0, d3_force_1.forceLink)(input.edges.map(function (edge) { return ({ source: edge.a, target: edge.b }); })).id(function (body) { return body.id; }).distance(constants_1.GRAPH_LINK_DISTANCE))
        .force('charge', (0, d3_force_1.forceManyBody)().strength(constants_1.GRAPH_CHARGE).theta(constants_1.GRAPH_THETA))
        .force('x', (0, d3_force_1.forceX)(0).strength(constants_1.GRAPH_GRAVITY))
        .force('y', (0, d3_force_1.forceY)(0).strength(constants_1.GRAPH_GRAVITY))
        .alpha(input.ids.length > 0 && kept * 2 >= input.ids.length ? constants_1.GRAPH_WARM_ALPHA : 1);
    // A cold layout settles in GRAPH_TICKS steps.
    simulation.alphaDecay(1 - Math.pow(simulation.alphaMin(), 1 / constants_1.GRAPH_TICKS));
    var total = Math.max(1, Math.ceil(Math.log(simulation.alphaMin() / simulation.alpha()) / Math.log(1 - simulation.alphaDecay())));
    for (var ticks = 1; simulation.alpha() >= simulation.alphaMin(); ticks++) {
        simulation.tick();
        if (ticks % constants_1.GRAPH_PROGRESS_TICKS === 0)
            onProgress === null || onProgress === void 0 ? void 0 : onProgress(Math.min(1, ticks / total));
    }
    onProgress === null || onProgress === void 0 ? void 0 : onProgress(1);
    return new Map(bodies.map(function (body) { var _a, _b; return [body.id, { x: (_a = body.x) !== null && _a !== void 0 ? _a : 0, y: (_b = body.y) !== null && _b !== void 0 ? _b : 0 }]; }));
};
exports.layoutOf = layoutOf;
// The nearest shown node within reach of a point, if any.
var nodeAt = function (points, shown, at, reach) {
    var best = null;
    var bestDistance = reach * reach;
    for (var _i = 0, shown_1 = shown; _i < shown_1.length; _i++) {
        var id = shown_1[_i];
        var point = points.get(id);
        if (point === undefined)
            continue;
        var distance = Math.pow((point.x - at.x), 2) + Math.pow((point.y - at.y), 2);
        if (distance <= bestDistance) {
            best = id;
            bestDistance = distance;
        }
    }
    return best;
};
exports.nodeAt = nodeAt;
var AXES = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
// The closest shown node in the 90° cone around a direction, for the arrow keys.
var nextNode = function (points, shown, from, direction) {
    var origin = points.get(from);
    if (origin === undefined)
        return null;
    var axis = AXES[direction];
    var best = null;
    var bestDistance = Infinity;
    for (var _i = 0, shown_2 = shown; _i < shown_2.length; _i++) {
        var id = shown_2[_i];
        var point = points.get(id);
        if (id === from || point === undefined)
            continue;
        var dx = point.x - origin.x;
        var dy = point.y - origin.y;
        var along = dx * axis.x + dy * axis.y;
        var across = Math.abs(dx * axis.y - dy * axis.x);
        var distance = dx * dx + dy * dy;
        if (along > 0 && along >= across && distance < bestDistance) {
            best = id;
            bestDistance = distance;
        }
    }
    return best;
};
exports.nextNode = nextNode;
