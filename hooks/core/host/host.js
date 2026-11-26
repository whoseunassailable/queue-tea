"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.unixFiles = exports.FileTooLarge = void 0;
// A file too large for the host to write at once. The mod's host throws it
// before Claude Code would refuse the write, so a caller can tell this apart.
var FileTooLarge = /** @class */ (function (_super) {
    __extends(FileTooLarge, _super);
    function FileTooLarge(path, bytes, limit) {
        var _this = _super.call(this, "".concat(path, " is ").concat(bytes, " bytes, over the ").concat(limit, "-byte limit")) || this;
        _this.path = path;
        _this.bytes = bytes;
        _this.limit = limit;
        _this.name = 'FileTooLarge';
        return _this;
    }
    return FileTooLarge;
}(Error));
exports.FileTooLarge = FileTooLarge;
// The file moves, as commands. Mac only for now: Windows gets its own here.
var unixFiles = function (run) { return ({
    move: function (from, to) { return run(['mv', '-f', from, to]); },
    makeDir: function (path) { return run(['mkdir', path]); },
    makeDirs: function (path) { return run(['mkdir', '-p', path]); },
    removeDir: function (path) { return run(['rmdir', path]); },
    remove: function (path) { return run(['rm', '-f', path]); },
}); };
exports.unixFiles = unixFiles;
