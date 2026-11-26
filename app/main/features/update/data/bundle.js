"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoredOf = exports.relaunchArgv = exports.commitOfProvenance = exports.versionOfPlist = void 0;
var PLIST_VERSION = /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/;
var versionOfPlist = function (plist) { var _a, _b; return (_b = (_a = PLIST_VERSION.exec(plist)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : null; };
exports.versionOfPlist = versionOfPlist;
var commitOfProvenance = function (text) {
    var value = JSON.parse(text);
    if (value === null || typeof value !== 'object')
        return null;
    var commit = value.commit;
    return typeof commit === 'string' && /^[a-f0-9]{40,64}$/.test(commit) ? commit : null;
};
exports.commitOfProvenance = commitOfProvenance;
// Waits for this app to end, then opens the bundle again. -g keeps it behind
// whatever you're using. Backgrounded, so the run returns at once.
var relaunchArgv = function (pid, bundle, isInFront) { return [
    '/bin/sh',
    '-c',
    "(while kill -0 \"$1\" 2>/dev/null; do sleep 0.2; done; open ".concat(isInFront ? '' : '-g ', "\"$2\") >/dev/null 2>&1 &"),
    'sh',
    String(pid),
    bundle,
]; };
exports.relaunchArgv = relaunchArgv;
var isNumber = function (value) { return typeof value === 'number' && Number.isFinite(value); };
// The file is ours, but it's still read from disk: anything off is ignored and
// the app opens as it always does.
var restoredOf = function (text) {
    var value = JSON.parse(text);
    if (value === null)
        return null;
    if (typeof value !== 'object')
        return undefined;
    var _a = value, hash = _a.hash, bounds = _a.bounds, isInFront = _a.isInFront;
    var box = (bounds !== null && bounds !== void 0 ? bounds : {});
    if (typeof hash !== 'string' || typeof isInFront !== 'boolean' || ![box.x, box.y, box.width, box.height].every(isNumber))
        return undefined;
    return { hash: hash, bounds: { x: box.x, y: box.y, width: box.width, height: box.height }, isInFront: isInFront };
};
exports.restoredOf = restoredOf;
