"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchGraph = void 0;
var hooks_1 = require("preact/hooks");
var en_1 = require("../../../../l10n/en");
var graph_layout_1 = require("../../domain/graph_layout");
var BranchGraph = function (_a) {
    var graph = _a.graph, onSelect = _a.onSelect;
    var layout = (0, hooks_1.useMemo)(function () { return (0, graph_layout_1.graphLayout)(graph); }, [graph]);
    var _b = (0, hooks_1.useState)(1), zoom = _b[0], setZoom = _b[1];
    var scroller = (0, hooks_1.useRef)(null);
    (0, hooks_1.useLayoutEffect)(function () { var _a; setZoom(Math.max(.3, Math.min(1, (((_a = scroller.current) === null || _a === void 0 ? void 0 : _a.clientWidth) || layout.width) / layout.width))); }, [layout.width]);
    return <section class="panel history-graph" aria-label={en_1.t.branches.graph}>
    <div class="graph-tools">
      <strong>{en_1.t.branches.graph}</strong>
      <button class="btn" type="button" onClick={function () { return setZoom(Math.max(.5, zoom - .2)); }} aria-label={en_1.t.branches.zoomOut}>−</button>
      <button class="btn" type="button" onClick={function () { return setZoom(Math.min(2, zoom + .2)); }} aria-label={en_1.t.branches.zoomIn}>+</button>
      <button class="btn" type="button" onClick={function () { var _a, _b; return setZoom(Math.max(.3, Math.min(1, ((_b = (_a = scroller.current) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : layout.width) / layout.width))); }}>{en_1.t.branches.fit}</button>
      <button class="btn" type="button" onClick={function () {
            var _a;
            var task = graph.tasks.find(function (q) { return q.state === 'working'; });
            var node = layout.nodes.find(function (n) { return n.id === (task === null || task === void 0 ? void 0 : task.head); });
            if (node)
                (_a = scroller.current) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: Math.max(0, node.y * zoom - 80), left: Math.max(0, node.x * zoom - 80) });
            if (task)
                onSelect(task.id);
        }}>{en_1.t.branches.focus}</button>
    </div>
    <div class="graph-scroll" ref={scroller} tabIndex={0} aria-label={en_1.t.branches.pan}>
      <svg width={layout.width * zoom} height={layout.height * zoom} viewBox={"0 0 ".concat(layout.width, " ").concat(layout.height)} role="img" aria-label={en_1.t.branches.graphHint}>
        {layout.edges.map(function (edge) { return <path key={"".concat(edge.from.id, "-").concat(edge.to.id)} class="commit-edge" d={"M ".concat(edge.from.x, " ").concat(edge.from.y, " C ").concat(edge.from.x, " ").concat(edge.from.y + 24, ", ").concat(edge.to.x, " ").concat(edge.to.y - 24, ", ").concat(edge.to.x, " ").concat(edge.to.y)}/>; })}
        {layout.nodes.map(function (node) {
            var task = graph.tasks.find(function (q) { return q.head === node.id; });
            return <g key={node.id} transform={"translate(".concat(node.x, ",").concat(node.y, ")")}>
            <circle r="7" class={"commit-dot ".concat((task === null || task === void 0 ? void 0 : task.state) === 'working' ? 'observed-working' : '')}/>
            <title>{"".concat(node.id, " \u00B7 ").concat(node.message)}</title>
            {node.branches.length > 0 ? <g role={task ? 'button' : undefined} tabIndex={task ? 0 : undefined} aria-label={task ? en_1.t.branches.reviewNamed(task.title) : undefined} onClick={function () { return task && onSelect(task.id); }} onKeyDown={function (e) { if (task && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelect(task.id);
                } }}>
              <rect x="14" y="-16" width="330" height="32" rx="8" class="commit-label-bg"/>
              <text x="24" y="5" class="commit-label">{node.branches.join(', ').slice(0, 45)}</text>
            </g> : <text x="14" y="4" class="commit-caption">{node.id.slice(0, 7)} · {node.message.slice(0, 38)}</text>}
          </g>;
        })}
      </svg>
    </div>
    <p class="hint">{en_1.t.branches.graphHint} {graph.limited ? en_1.t.branches.limited : ''}</p>
  </section>;
};
exports.BranchGraph = BranchGraph;
