"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignCard = exports.BrokenFile = void 0;
var hooks_1 = require("preact/hooks");
var designs_1 = require("../../../../../shared/designs");
var engine_client_1 = require("../../../../core/api/engine_client");
var use_engine_read_1 = require("../../../../core/api/use_engine_read");
var constants_1 = require("../../../../core/constants/constants");
var states_1 = require("../../../../core/widgets/states");
var en_1 = require("../../../../l10n/en");
var scene_view_1 = require("./scene_view");
// A file that doesn't read: which, where, and the ways to mend it.
var BrokenFile = function (_a) {
    var title = _a.title, problem = _a.problem, onRetry = _a.onRetry, onRestore = _a.onRestore;
    var _b = (0, hooks_1.useState)(null), failure = _b[0], setFailure = _b[1];
    return (<div class="dz-broken" role="alert">
      <h3>{title}</h3>
      <p>{en_1.t.designs.brokenLine(problem.file, problem.detail)}</p>
      <div class="dz-broken-acts">
        <button type="button" class="btn" onClick={onRetry}>
          {en_1.t.failed.tryAgain}
        </button>
        {problem.backupAt !== null && (<button type="button" class="btn" onClick={function () { return void onRestore().then(setFailure); }}>
            {en_1.t.designs.useLastGood}
          </button>)}
      </div>
      {failure !== null && <p class="field-error">{failure}</p>}
    </div>);
};
exports.BrokenFile = BrokenFile;
var DesignCard = function (_a) {
    var engine = _a.engine, realm = _a.realm, folder = _a.folder, id = _a.id, comments = _a.comments, onOpen = _a.onOpen, onRead = _a.onRead;
    var read = (0, use_engine_read_1.useEngineRead)(engine, function () { return engine.readDesign(realm, folder, id); }, [realm, folder, id]);
    var load = read.load;
    (0, hooks_1.useEffect)(function () {
        if (load.status === 'loading')
            return;
        if (load.status === 'failed')
            onRead(id, 'failed', null);
        else if (load.data.kind === 'broken')
            onRead(id, 'broken', null);
        else
            onRead(id, 'ready', { name: load.data.scene.name, layers: Object.fromEntries((0, designs_1.layersOf)(load.data.scene.nodes).map(function (l) { return [l.id, l.name]; })) });
    }, [load]);
    if (load.status === 'loading') {
        return (<div class="dz-card panel" role="status">
        <div class="dz-thumb dz-thumb-wait" style={{ width: "".concat(constants_1.THUMB_BOX.width, "px"), height: "".concat(constants_1.THUMB_BOX.height, "px") }}>
          <states_1.Spinner />
        </div>
        <p class="sub">{en_1.t.designs.readingDesign(id)}</p>
      </div>);
    }
    if (load.status === 'failed') {
        return (<div class="dz-card panel" role="alert">
        <p class="state-line">{load.message}</p>
        <button type="button" class="btn" onClick={read.retry}>
          {en_1.t.failed.tryAgain}
        </button>
      </div>);
    }
    if (load.data.kind === 'broken') {
        return (<div class="dz-card panel">
        <exports.BrokenFile title={en_1.t.designs.brokenTitle(id)} problem={load.data.problem} onRetry={read.retry} onRestore={function () { return __awaiter(void 0, void 0, void 0, function () {
                var answer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, engine_client_1.ask)(engine, function () { return engine.restoreDesignFile(realm, folder, id); })];
                        case 1:
                            answer = _a.sent();
                            if (answer.ok)
                                read.retry();
                            return [2 /*return*/, answer.ok ? null : answer.message];
                    }
                });
            }); }}/>
      </div>);
    }
    var scene = load.data.scene;
    var open = comments.filter(function (c) { return c.design === id && (0, designs_1.isOpen)(c); }).length;
    return (<button type="button" class="dz-card panel" onClick={onOpen}>
      <scene_view_1.SceneThumb scene={scene} width={constants_1.THUMB_BOX.width} height={constants_1.THUMB_BOX.height}/>
      <span class="dz-card-h">
        <b>{scene.name}</b>
        <span class={open > 0 ? 'dz-badge open' : 'sub'}>{open > 0 ? en_1.t.designs.cardOpen(open) : en_1.t.designs.noComments}</span>
      </span>
      <span class="sub">{en_1.t.designs.cardMeta(scene.width, scene.height, scene.edited, Date.now())}</span>
    </button>);
};
exports.DesignCard = DesignCard;
