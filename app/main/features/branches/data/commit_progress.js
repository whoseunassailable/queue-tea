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
exports.readCommitProgress = exports.writeReceipt = void 0;
var node_crypto_1 = require("node:crypto");
var constants_1 = require("../domain/constants");
var writeReceipt = function (d, file, data) { return __awaiter(void 0, void 0, void 0, function () {
    var temp, moved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                temp = "".concat(file, ".").concat((0, node_crypto_1.randomUUID)(), ".tmp");
                return [4 /*yield*/, d.host.write(temp, JSON.stringify(data))];
            case 1:
                _a.sent();
                return [4 /*yield*/, d.host.move(temp, file)];
            case 2:
                moved = _a.sent();
                if (moved.exitCode)
                    throw new Error("Saving commit progress failed: ".concat(moved.stderr));
                return [2 /*return*/];
        }
    });
}); };
exports.writeReceipt = writeReceipt;
var readCommitProgress = function (d, key, taskId) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, latest, _i, _a, file, receipt, _b, _c, progress;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                folder = (0, constants_1.operationsFolder)(d.home, key);
                latest = null;
                _i = 0;
                return [4 /*yield*/, d.host.list(folder)];
            case 1:
                _a = (_d.sent()).filter(function (f) { return /^commit-[a-f0-9]{64}\.json$/.test(f); });
                _d.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                file = _a[_i];
                _c = (_b = JSON).parse;
                return [4 /*yield*/, d.host.read("".concat(folder, "/").concat(file))];
            case 3:
                receipt = _c.apply(_b, [_d.sent()]);
                progress = receipt.progress;
                if (receipt.taskId !== taskId || !progress || latest && latest.at > progress.at)
                    return [3 /*break*/, 4];
                if (progress.status === 'running' && progress.owner !== process.pid) {
                    try {
                        if (progress.owner)
                            process.kill(progress.owner, 0);
                    }
                    catch (err) {
                        if (err.code === 'ESRCH')
                            progress.status = 'interrupted';
                        else
                            d.log.warn("Commit owner could not be inspected: ".concat(String(err)));
                    }
                }
                latest = progress;
                _d.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, latest];
        }
    });
}); };
exports.readCommitProgress = readCommitProgress;
