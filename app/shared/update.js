"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changedBuild = void 0;
var changedBuild = function (running, installed) { return installed !== null &&
    (running.version !== installed.version || (running.commit !== null && installed.commit !== null && running.commit !== installed.commit)); };
exports.changedBuild = changedBuild;
