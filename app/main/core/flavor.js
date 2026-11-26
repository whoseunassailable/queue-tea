"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appIdOf = exports.flavorOf = void 0;
// The flavor is set once at start-up and read everywhere from here.
var flavorOf = function (value, isPackaged) {
    return value === 'dev' || value === 'stage' || value === 'prod' ? value : isPackaged ? 'prod' : 'dev';
};
exports.flavorOf = flavorOf;
// Each flavor has its own id and settings, so they install side by side.
var appIdOf = function (flavor) {
    return flavor === 'prod' ? 'dev.queue-tea.app' : "dev.queue-tea.app.".concat(flavor);
};
exports.appIdOf = appIdOf;
