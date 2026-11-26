"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@fontsource/marcellus/400.css");
require("@fontsource/nunito-sans/400.css");
require("@fontsource/nunito-sans/600.css");
require("@fontsource/nunito-sans/700.css");
require("@fontsource/nunito-sans/800.css");
require("./core/theme/jade_peaks.css");
require("./core/theme/app.css");
var preact_1 = require("preact");
var app_1 = require("./app/app");
var workspace_store_1 = require("./features/workspace/state_management/workspace_store");
// Whatever slips through is logged, so nothing fails silently.
window.addEventListener('error', function (event) { return window.engine.log('error', "window error: ".concat(event.message)); });
window.addEventListener('unhandledrejection', function (event) { return window.engine.log('error', "window rejection: ".concat(String(event.reason))); });
var workspace = (0, workspace_store_1.createWorkspace)(window.engine);
(0, preact_1.render)(<app_1.App workspace={workspace} engine={window.engine}/>, document.getElementById('root'));
workspace.start().catch(function (err) { return window.engine.log('error', "starting failed: ".concat(String(err))); });
