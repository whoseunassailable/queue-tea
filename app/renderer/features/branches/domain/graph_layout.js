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
exports.graphLayout = void 0;
var GAP_X = 100;
var GAP_Y = 48;
var graphLayout = function (graph) {
    var heads = __spreadArray([], graph.heads, true).sort(function (a, b) { return a.branch === graph.integration ? -1 : b.branch === graph.integration ? 1 : a.branch.localeCompare(b.branch); });
    var lanes = new Map();
    heads.forEach(function (h, lane) { if (!lanes.has(h.head))
        lanes.set(h.head, lane); });
    var next = heads.length;
    var nodes = graph.commits.map(function (commit, row) {
        var _a;
        var lane = (_a = lanes.get(commit.id)) !== null && _a !== void 0 ? _a : next++;
        commit.parents.forEach(function (id, i) { if (!lanes.has(id))
            lanes.set(id, i === 0 ? lane : next++); });
        return __assign(__assign({}, commit), { x: 32 + lane * GAP_X, y: 32 + row * GAP_Y, branches: heads.filter(function (h) { return h.head === commit.id; }).map(function (h) { return h.branch; }) });
    });
    var byId = new Map(nodes.map(function (n) { return [n.id, n]; }));
    var edges = nodes.flatMap(function (n) { return n.parents.flatMap(function (p) {
        var parent = byId.get(p);
        return parent ? [{ from: n, to: parent }] : [];
    }); });
    return { nodes: nodes, edges: edges, width: Math.max.apply(Math, __spreadArray([640], nodes.map(function (n) { return n.x + 380; }), false)), height: Math.max(120, nodes.length * GAP_Y + 32) };
};
exports.graphLayout = graphLayout;
