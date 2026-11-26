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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPage = exports.isPublicAddress = void 0;
var node_dns_1 = require("node:dns");
var node_http_1 = require("node:http");
var node_https_1 = require("node:https");
var node_net_1 = require("node:net");
var note_bookmarks_1 = require("../../../../shared/note_bookmarks");
var constants_1 = require("../../../core/constants");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
// A note's link reaches only the public internet: never this Mac, the local
// network or a cloud metadata service, whatever the link or its redirects say.
// One list per family: a BlockList checks IPv4 against IPv6 rules too, as
// ::ffff:a.b.c.d, and ::/3 below would then refuse every IPv4 address.
var PRIVATE = { ipv4: new node_net_1.BlockList(), ipv6: new node_net_1.BlockList() };
var RANGES = {
    ipv4: '0.0.0.0/8 10.0.0.0/8 100.64.0.0/10 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.0.0.0/24 192.0.2.0/24 192.168.0.0/16 198.18.0.0/15 198.51.100.0/24 203.0.113.0/24 224.0.0.0/3',
    // Everything outside global unicast (2000::/3), which takes in loopback,
    // IPv4-mapped and NAT64 addresses, then Teredo, documentation and 6to4.
    ipv6: '::/3 4000::/2 8000::/1 2001::/23 2001:db8::/32 2002::/16',
};
for (var _i = 0, _a = ['ipv4', 'ipv6']; _i < _a.length; _i++) {
    var family = _a[_i];
    for (var _b = 0, _c = RANGES[family].split(' '); _b < _c.length; _b++) {
        var range = _c[_b];
        var _d = range.split('/'), net = _d[0], bits = _d[1];
        PRIVATE[family].addSubnet(net, Number(bits), family);
    }
}
var isPublicAddress = function (address) {
    var family = (0, node_net_1.isIP)(address) === 6 ? 'ipv6' : 'ipv4';
    return (0, node_net_1.isIP)(address) !== 0 && !PRIVATE[family].check(address, family);
};
exports.isPublicAddress = isPublicAddress;
var PrivateHost = /** @class */ (function (_super) {
    __extends(PrivateHost, _super);
    function PrivateHost() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PrivateHost;
}(Error));
// The guard sits in the lookup the connection itself uses, so a name can't
// answer one address to a check and another to the connection.
var lookupOf = function (isPublic) { return function (hostname, options, done) {
    return (0, node_dns_1.lookup)(hostname, __assign(__assign({}, options), { all: true }), function (error, found) {
        if (error !== null)
            return done(error, '', 0);
        // One private answer refuses the name, so no record can steer a retry inwards.
        if (found.length === 0 || found.some(function (one) { return !isPublic(one.address); }))
            return done(new PrivateHost(hostname), '', 0);
        if (options.all === true)
            return done(null, found);
        done(null, found[0].address, found[0].family);
    });
}; };
var getOnce = function (url, isPublic, signal) {
    return new Promise(function (done, fail) {
        var host = url.hostname.replace(/^\[(.*)\]$/, '$1');
        // A literal address skips the lookup, so it is checked here.
        if ((0, node_net_1.isIP)(host) !== 0 && !isPublic(host))
            return fail(new PrivateHost(host));
        var get = url.protocol === 'https:' ? node_https_1.get : node_http_1.get;
        get(url, { lookup: lookupOf(isPublic), signal: signal, agent: false, headers: { accept: 'text/html,application/xhtml+xml', 'accept-encoding': 'identity', 'user-agent': constants_1.BOOKMARK_AGENT } }, done).on('error', fail);
    });
};
var textOf = function (response, type) { return __awaiter(void 0, void 0, void 0, function () {
    var chunks, size, _a, _b, _c, chunk, e_1_1, bytes, charset;
    var _d, e_1, _e, _f;
    var _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                chunks = [];
                size = 0;
                _j.label = 1;
            case 1:
                _j.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(response);
                _j.label = 2;
            case 2: return [4 /*yield*/, _b.next()];
            case 3:
                if (!(_c = _j.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                chunk = _f;
                chunks.push(chunk);
                size += chunk.length;
                // The head is all a preview needs; leaving the loop closes the rest.
                if (size >= note_bookmarks_1.BOOKMARK_LIMITS.bytes)
                    return [3 /*break*/, 5];
                _j.label = 4;
            case 4:
                _a = true;
                return [3 /*break*/, 2];
            case 5: return [3 /*break*/, 12];
            case 6:
                e_1_1 = _j.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 7:
                _j.trys.push([7, , 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
            case 8:
                _j.sent();
                _j.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 11: return [7 /*endfinally*/];
            case 12:
                bytes = Buffer.concat(chunks).subarray(0, note_bookmarks_1.BOOKMARK_LIMITS.bytes);
                charset = (_h = (_g = /charset=["']?([\w-]+)/i.exec(type)) === null || _g === void 0 ? void 0 : _g[1]) !== null && _h !== void 0 ? _h : 'utf-8';
                try {
                    return [2 /*return*/, new TextDecoder(charset).decode(bytes)];
                }
                catch (_k) {
                    // An unknown charset reads as UTF-8, which most pages are.
                    return [2 /*return*/, new TextDecoder().decode(bytes)];
                }
                return [2 /*return*/];
        }
    });
}); };
// The page's HTML, or '' when it has no preview to give: an error status, a
// file that isn't HTML, or too many redirects.
var readPage = function (address_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([address_1], args_1, true), void 0, function (address, isPublic) {
        var signal, url, hop, response, status_1, location_1, type, err_1;
        var _a, _b;
        if (isPublic === void 0) { isPublic = exports.isPublicAddress; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    signal = AbortSignal.timeout(note_bookmarks_1.BOOKMARK_LIMITS.timeoutMs);
                    url = new URL(address);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    hop = 0;
                    _c.label = 2;
                case 2: return [4 /*yield*/, getOnce(url, isPublic, signal)];
                case 3:
                    response = _c.sent();
                    status_1 = (_a = response.statusCode) !== null && _a !== void 0 ? _a : 0;
                    location_1 = response.headers.location;
                    if (status_1 >= 300 && status_1 < 400 && location_1 !== undefined) {
                        response.destroy();
                        if (hop >= note_bookmarks_1.BOOKMARK_LIMITS.redirects)
                            return [2 /*return*/, ''];
                        url = new URL(location_1, url);
                        if (url.protocol !== 'http:' && url.protocol !== 'https:')
                            return [2 /*return*/, ''];
                        return [3 /*break*/, 5];
                    }
                    type = (_b = response.headers['content-type']) !== null && _b !== void 0 ? _b : '';
                    if (status_1 < 200 || status_1 >= 300 || !/html/i.test(type)) {
                        response.destroy();
                        return [2 /*return*/, ''];
                    }
                    return [4 /*yield*/, textOf(response, type)];
                case 4: return [2 /*return*/, _c.sent()];
                case 5:
                    hop += 1;
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _c.sent();
                    if (err_1 instanceof PrivateHost)
                        throw new reply_1.Refusal(messages_1.MESSAGES.bookmarkPrivate);
                    if (signal.aborted)
                        throw new reply_1.Refusal(messages_1.MESSAGES.bookmarkSlow);
                    throw err_1;
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.readPage = readPage;
