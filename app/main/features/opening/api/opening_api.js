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
exports.installCommand = exports.openedFromUrl = void 0;
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var realms_api_1 = require("../../realms/api/realms_api");
var command_file_1 = require("../data/command_file");
var command_script_1 = require("../data/command_script");
var open_url_1 = require("../domain/open_url");
// What a link comes to. It can only select a realm or ask about a folder: this
// writes nothing, because a link can come from any web page.
var openedFromUrl = function (d, url) { return __awaiter(void 0, void 0, void 0, function () {
    var path, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                path = (0, open_url_1.pathFromUrl)(url);
                if (path === null)
                    return [2 /*return*/, { kind: 'failed', message: messages_1.MESSAGES.badLink }];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, d.host.exists(path)];
            case 2:
                if (!(_b.sent()))
                    return [2 /*return*/, { kind: 'failed', message: messages_1.MESSAGES.noFolder(path) }];
                _a = { kind: 'folder' };
                return [4 /*yield*/, (0, realms_api_1.placeOf)(d, path)];
            case 3: return [2 /*return*/, (_a.pick = _b.sent(), _a)];
            case 4:
                err_1 = _b.sent();
                d.log.error('opening a link failed', err_1);
                return [2 /*return*/, { kind: 'failed', message: messages_1.MESSAGES.openFolder }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.openedFromUrl = openedFromUrl;
var canWrite = function (d, dir) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, d.host.run(['test', '-d', dir, '-a', '-w', dir])];
        case 1: return [2 /*return*/, (_a.sent()).exitCode === 0];
    }
}); }); };
var installCommand = function (d) {
    return (0, reply_1.reply)(d.log, messages_1.MESSAGES.installCommand, function () { return __awaiter(void 0, void 0, void 0, function () {
        var lastResort, _i, _a, dir, file, _b, made;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    lastResort = d.commandDirs.at(-1);
                    if (!(lastResort !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, d.host.makeDirs(lastResort)];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    _i = 0, _a = d.commandDirs;
                    _c.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    dir = _a[_i];
                    return [4 /*yield*/, canWrite(d, dir)];
                case 4:
                    if (!(_c.sent()))
                        return [3 /*break*/, 10];
                    file = (0, command_file_1.commandFileIn)(dir);
                    return [4 /*yield*/, d.host.exists(file)];
                case 5:
                    _b = (_c.sent());
                    if (!_b) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, command_file_1.isOurs)(d.host, file)];
                case 6:
                    _b = !(_c.sent());
                    _c.label = 7;
                case 7:
                    if (_b)
                        throw new reply_1.Refusal(messages_1.MESSAGES.commandTaken(file));
                    return [4 /*yield*/, d.host.write(file, command_script_1.COMMAND_SCRIPT)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, d.host.run(['chmod', '755', file])];
                case 9:
                    made = _c.sent();
                    if (made.exitCode !== 0)
                        throw new Error(made.stderr);
                    return [2 /*return*/, { path: file, needsPath: (0, command_file_1.needsPath)(d.commandDirs, dir) }];
                case 10:
                    _i++;
                    return [3 /*break*/, 3];
                case 11: throw new reply_1.Refusal(messages_1.MESSAGES.noCommandFolder);
            }
        });
    }); });
};
exports.installCommand = installCommand;
