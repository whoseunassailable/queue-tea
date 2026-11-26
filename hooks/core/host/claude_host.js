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
exports.hostOf = hostOf;
var host_1 = require("./host");
var host_limits_1 = require("./host_limits");
var bytesOf = function (base64) { return Uint8Array.from(atob(base64), function (c) { return c.charCodeAt(0); }); };
// A file past what Claude Code reads at once, read in ranges of bytes, which
// $.fs.read answers as base64, and joined as bytes, so a character split
// between two ranges stays whole.
function readInRanges($, path, size) {
    return __awaiter(this, void 0, void 0, function () {
        var whole, filled, range, part, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    whole = new Uint8Array(size);
                    filled = 0;
                    _b.label = 1;
                case 1:
                    if (!(filled < size)) return [3 /*break*/, 3];
                    range = { as: 'bytes', offset: filled, length: Math.min(host_limits_1.ENGINE_FILE_LIMIT, size - filled) };
                    _a = bytesOf;
                    return [4 /*yield*/, $.fs.read(path, range)];
                case 2:
                    part = _a.apply(void 0, [(_b.sent()).base64]);
                    // The file got shorter since it was measured: what was read is all of it.
                    if (part.length === 0)
                        return [3 /*break*/, 3];
                    whole.set(part.subarray(0, size - filled), filled);
                    filled += part.length;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, new TextDecoder().decode(whole.subarray(0, filled))];
            }
        });
    });
}
function hostOf($) {
    var _this = this;
    var run = function (argv, cwd) { return $.process.run(argv, cwd === undefined ? undefined : { cwd: cwd }); };
    return __assign(__assign({ exists: function (path) { return $.fs.exists(path); }, read: function (path) { return __awaiter(_this, void 0, void 0, function () {
            var size;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, $.fs.stat(path)];
                    case 1:
                        size = (_a.sent()).size;
                        return [2 /*return*/, size > host_limits_1.ENGINE_FILE_LIMIT ? readInRanges($, path, size) : $.fs.read(path)];
                }
            });
        }); }, write: function (path, text) { return __awaiter(_this, void 0, void 0, function () {
            var bytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bytes = new TextEncoder().encode(text).length;
                        if (bytes > host_limits_1.ENGINE_FILE_LIMIT)
                            throw new host_1.FileTooLarge(path, bytes, host_limits_1.ENGINE_FILE_LIMIT);
                        return [4 /*yield*/, $.fs.write(path, text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, run: run, list: function (dir) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, $.fs.exists(dir)];
                case 1:
                    if (!(_b.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, $.fs.list(dir)];
                case 2:
                    _a = (_b.sent()).filter(function (e) { return e.kind === 'file'; }).map(function (e) { return e.name; });
                    return [3 /*break*/, 4];
                case 3:
                    _a = [];
                    _b.label = 4;
                case 4: return [2 /*return*/, (_a)];
            }
        }); }); }, sleep: function (ms) { return $.clock.sleep(ms); } }, (0, host_1.unixFiles)(run)), { modifiedAt: function (path) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, $.fs.stat(path)];
                    case 1: return [2 /*return*/, (_b.sent()).mtimeMs];
                    case 2:
                        _a = _b.sent();
                        // A file that isn't there has no time, and that is the answer asked for.
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, open: function (url) { return run(['open', url]); } });
}
