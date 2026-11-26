"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageArt = exports.EggArt = exports.Coins = exports.Dragon = exports.Sky = void 0;
var en_1 = require("../../l10n/en");
var constants_1 = require("../constants/constants");
var dragon_svg_html_raw_1 = require("./art/dragon.svg.html?raw");
var egg_svg_html_raw_1 = require("./art/egg.svg.html?raw");
var hoard_svg_html_raw_1 = require("./art/hoard.svg.html?raw");
var island_svg_html_raw_1 = require("./art/island.svg.html?raw");
var sky_html_raw_1 = require("./art/sky.html?raw");
// The art is the mockups' own, bundled with the app and never built from data.
var Sky = function () { return <div class="sky" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sky_html_raw_1.default }}/>; };
exports.Sky = Sky;
var Dragon = function (_a) {
    var stage = _a.stage, onPet = _a.onPet;
    return (<>
    <div class="lair-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: island_svg_html_raw_1.default }}/>
    <button type="button" class="dragon" aria-label={en_1.t.dragon.pet(en_1.t.stage[stage])} onClick={onPet}>
      <span class="dragon-size" style={{ transform: "scale(".concat(constants_1.STAGE_SCALE[stage], ")") }} dangerouslySetInnerHTML={{ __html: dragon_svg_html_raw_1.default }}/>
    </button>
  </>);
};
exports.Dragon = Dragon;
var Coins = function () { return <div class="pile" dangerouslySetInnerHTML={{ __html: hoard_svg_html_raw_1.default }}/>; };
exports.Coins = Coins;
var EggArt = function () { return <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: egg_svg_html_raw_1.default }}/>; };
exports.EggArt = EggArt;
var StageArt = function (_a) {
    var stage = _a.stage;
    return <span class={"stage-dragon ".concat(stage)} aria-hidden="true" dangerouslySetInnerHTML={{ __html: dragon_svg_html_raw_1.default }}/>;
};
exports.StageArt = StageArt;
