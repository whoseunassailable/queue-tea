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
exports.SceneThumb = exports.SceneView = exports.textStyle = void 0;
var designs_1 = require("../../../../../shared/designs");
var en_1 = require("../../../../l10n/en");
var LINE_HEIGHT = 1.25;
var textStyle = function (layer) {
    var _a;
    return (0, designs_1.isText)(layer)
        ? {
            fontFamily: "\"".concat(layer.font, "\", \"Nunito Sans\", system-ui, sans-serif"),
            fontSize: "".concat(layer.size, "px"),
            fontWeight: layer.weight,
            color: layer.color,
            textAlign: (_a = layer.align) !== null && _a !== void 0 ? _a : 'left',
            lineHeight: typeof layer.lineHeight === 'number' ? layer.lineHeight : LINE_HEIGHT,
        }
        : {};
};
exports.textStyle = textStyle;
// editing: the text being typed into, hidden so its editor shows in its place.
var LayerView = function (_a) {
    var layer = _a.layer, editing = _a.editing;
    var place = { left: "".concat(layer.x, "px"), top: "".concat(layer.y, "px"), width: "".concat(layer.width, "px") };
    if ((0, designs_1.isText)(layer)) {
        return (<div class="dz-text" data-layer={layer.id} style={__assign(__assign(__assign({}, place), (0, exports.textStyle)(layer)), { visibility: editing === layer.id ? 'hidden' : undefined })}>
        {layer.text === '' ? ' ' : layer.text}
      </div>);
    }
    if ((0, designs_1.isFrame)(layer)) {
        var stroke = layer.stroke === undefined ? undefined : "inset 0 0 0 ".concat(layer.stroke.width, "px ").concat(layer.stroke.color);
        return (<div class="dz-box" data-layer={layer.id} style={__assign(__assign({}, place), { height: "".concat(layer.height, "px"), background: layer.fill, borderRadius: layer.radius === undefined ? undefined : "".concat(layer.radius, "px"), boxShadow: stroke })}>
        {(0, designs_1.childrenOf)(layer).map(function (child) { return (<LayerView key={child.id} layer={child} editing={editing}/>); })}
      </div>);
    }
    return (<div class="dz-unknown" data-layer={layer.id} style={__assign(__assign({}, place), { height: "".concat(typeof layer.height === 'number' ? layer.height : 40, "px") })}>
      {en_1.t.designs.unknownLayer}
    </div>);
};
var SceneView = function (_a) {
    var scene = _a.scene, _b = _a.editing, editing = _b === void 0 ? null : _b;
    return (<div class="dz-scene" style={{ width: "".concat(scene.width, "px"), height: "".concat(scene.height, "px"), background: scene.fill }}>
    {scene.nodes.map(function (layer) { return (<LayerView key={layer.id} layer={layer} editing={editing}/>); })}
  </div>);
};
exports.SceneView = SceneView;
// A design shrunk to fit a box, for a card. It never takes a click.
var SceneThumb = function (_a) {
    var scene = _a.scene, width = _a.width, height = _a.height;
    var scale = Math.min(width / scene.width, height / scene.height);
    return (<div class="dz-thumb" style={{ width: "".concat(width, "px"), height: "".concat(height, "px") }} aria-hidden="true">
      <div style={{ width: "".concat(scene.width * scale, "px"), height: "".concat(scene.height * scale, "px"), overflow: 'hidden' }}>
        <div style={{ transform: "scale(".concat(scale, ")"), transformOrigin: '0 0' }}>
          <exports.SceneView scene={scene}/>
        </div>
      </div>
    </div>);
};
exports.SceneThumb = SceneThumb;
