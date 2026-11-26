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
exports.calendarApi = void 0;
var calendar_1 = require("../../../../shared/calendar");
var notes_1 = require("../../../../shared/notes");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var projects_api_1 = require("../../projects/api/projects_api");
var calendar_file_1 = require("../domain/calendar_file");
var viewOf = function (file) { return ({ events: file.events, unreadable: file.kept.length }); };
// A realm's calendar lives in its notes folder, beside Canvas.canvas, so the
// notes' export and restore carry it too.
var calendarApi = function (d) {
    var folderOf = function (key) { return "".concat(d.home, "/").concat(notes_1.NOTES_FOLDER, "/").concat(key); };
    var pathOf = function (key) { return "".concat(folderOf(key), "/").concat(calendar_1.CALENDAR_FILE); };
    var realmOf = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = !(0, projects_api_1.isProjectKey)(key);
                    if (_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, d.host.exists("".concat((0, constants_1.projectsFolder)(d.home), "/").concat(key, ".json"))];
                case 1:
                    _a = !(_b.sent());
                    _b.label = 2;
                case 2:
                    if (_a)
                        throw new reply_1.Refusal(messages_1.MESSAGES.unknownProject);
                    return [2 /*return*/, key];
            }
        });
    }); };
    // Nothing to read before the first event. A file that doesn't read is
    // refused and never written over: it holds Rohan's plans.
    var load = function (key) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = pathOf(key);
                    return [4 /*yield*/, d.host.exists(path)];
                case 1:
                    if (!(_a.sent()))
                        return [2 /*return*/, (0, calendar_file_1.emptyCalendar)()];
                    return [4 /*yield*/, d.host.read(path)];
                case 2:
                    text = _a.sent();
                    d.log.debug("calendar read: ".concat(path));
                    file = text.length > calendar_1.CALENDAR_LIMITS.bytes ? 'unreadable' : (0, calendar_file_1.parseCalendar)(text);
                    if (file === 'unreadable')
                        throw new reply_1.Refusal(messages_1.MESSAGES.badCalendarFile(path));
                    if (file === 'newer')
                        throw new reply_1.Refusal(messages_1.MESSAGES.newerCalendar(path));
                    return [2 /*return*/, file];
            }
        });
    }); };
    var save = function (key, file) { return __awaiter(void 0, void 0, void 0, function () {
        var path, text, made, _a, _b, _c, moved;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    path = pathOf(key);
                    text = (0, calendar_file_1.calendarText)(file);
                    if (text.length > calendar_1.CALENDAR_LIMITS.bytes)
                        throw new reply_1.Refusal(messages_1.MESSAGES.tooManyEvents);
                    return [4 /*yield*/, d.host.makeDirs(folderOf(key))];
                case 1:
                    made = _d.sent();
                    if (made.exitCode !== 0)
                        throw new Error(made.stderr);
                    return [4 /*yield*/, d.host.write("".concat(path, ".tmp"), text)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, d.host.exists(path)];
                case 3:
                    if (!_d.sent()) return [3 /*break*/, 6];
                    _b = (_a = d.host).write;
                    _c = ["".concat(path, ".bak")];
                    return [4 /*yield*/, d.host.read(path)];
                case 4: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, d.host.move("".concat(path, ".tmp"), path)];
                case 7:
                    moved = _d.sent();
                    if (moved.exitCode !== 0)
                        throw new Error(moved.stderr);
                    d.log.debug("calendar written: ".concat(path));
                    return [2 /*return*/];
            }
        });
    }); };
    // One change at a time, so two quick saves can't lose each other.
    var queue = Promise.resolve();
    var change = function (failure, key, work) {
        var run = queue.then(function () {
            return (0, reply_1.reply)(d.log, failure, function () { return __awaiter(void 0, void 0, void 0, function () {
                var realm, next, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, realmOf(key)];
                        case 1:
                            realm = _b.sent();
                            _a = work;
                            return [4 /*yield*/, load(realm)];
                        case 2:
                            next = _a.apply(void 0, [_b.sent()]);
                            return [4 /*yield*/, save(realm, next)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, viewOf(next)];
                    }
                });
            }); });
        });
        queue = run;
        return run;
    };
    var newIdIn = function (file) {
        var _loop_1 = function (tries) {
            var id = d.newId();
            if (!file.events.some(function (e) { return e.id === id; }))
                return { value: id };
        };
        for (var tries = 0; tries < 5; tries += 1) {
            var state_1 = _loop_1(tries);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        throw new Error('no free event id');
    };
    return {
        readCalendar: function (key) { return (0, reply_1.reply)(d.log, messages_1.MESSAGES.readCalendar, function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = viewOf;
                    _b = load;
                    return [4 /*yield*/, realmOf(key)];
                case 1: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
                case 2: return [2 /*return*/, _a.apply(void 0, [_c.sent()])];
            }
        }); }); }); },
        // id null adds an event; an id changes that one, which must still be there.
        saveCalendarEvent: function (key, id, input) {
            return change(messages_1.MESSAGES.saveCalendarEvent, key, function (file) {
                var event = (0, calendar_file_1.eventInputOf)(input);
                if (id === null) {
                    if (file.events.length >= calendar_1.CALENDAR_LIMITS.events)
                        throw new reply_1.Refusal(messages_1.MESSAGES.tooManyEvents);
                    return (0, calendar_file_1.withEvent)(file, __assign({ id: newIdIn(file) }, event));
                }
                if (!(0, calendar_file_1.isEventId)(id) || !file.events.some(function (e) { return e.id === id; }))
                    throw new reply_1.Refusal(messages_1.MESSAGES.eventGone);
                return (0, calendar_file_1.withEvent)(file, __assign({ id: id }, event));
            });
        },
        removeCalendarEvent: function (key, id) {
            return change(messages_1.MESSAGES.removeCalendarEvent, key, function (file) {
                if (!(0, calendar_file_1.isEventId)(id) || !file.events.some(function (e) { return e.id === id; }))
                    throw new reply_1.Refusal(messages_1.MESSAGES.eventGone);
                return (0, calendar_file_1.withoutEvent)(file, id);
            });
        },
    };
};
exports.calendarApi = calendarApi;
