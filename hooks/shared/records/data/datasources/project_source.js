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
exports.readProjectPlace = void 0;
var time_1 = require("../../../time/domain/services/time");
var record_source_1 = require("./record_source");
// The repository's top folder (or the working directory outside one), its
// record file, and the local time offset.
var readProjectPlace = function (host, cwd, home, log) { return __awaiter(void 0, void 0, void 0, function () {
    var top, workingPath, projectPath, common, dir, err_1, offsetMinutes, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, host.run(['git', 'rev-parse', '--show-toplevel'], cwd)];
            case 1:
                top = _b.sent();
                workingPath = top.exitCode === 0 && top.stdout.trim() !== '' ? top.stdout.trim() : cwd;
                projectPath = workingPath;
                if (!(top.exitCode === 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, host.run(['git', 'rev-parse', '--path-format=absolute', '--git-common-dir'], cwd)];
            case 2:
                common = _b.sent();
                dir = common.stdout.trim();
                if (common.exitCode === 0 && dir.endsWith('/.git'))
                    projectPath = dir.slice(0, -5);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, record_source_1.carryOverRecords)(host, home)];
            case 4:
                _b.sent();
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                // The old folder is left as it was, so the session goes on without them.
                log("carrying over the Queue-tie records failed: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                return [3 /*break*/, 6];
            case 6:
                _a = time_1.parseOffset;
                return [4 /*yield*/, host.run(['date', '+%z'], cwd)];
            case 7:
                offsetMinutes = _a.apply(void 0, [(_b.sent()).stdout]);
                return [2 /*return*/, { projectPath: projectPath, workingPath: workingPath, file: (0, record_source_1.recordPath)(home, (0, record_source_1.projectKey)(projectPath)), offsetMinutes: offsetMinutes }];
        }
    });
}); };
exports.readProjectPlace = readProjectPlace;
