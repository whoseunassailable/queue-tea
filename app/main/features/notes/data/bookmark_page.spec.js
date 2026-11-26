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
var node_http_1 = require("node:http");
var vitest_1 = require("vitest");
var messages_1 = require("../../../core/messages");
var reply_1 = require("../../../core/reply");
var bookmark_page_1 = require("./bookmark_page");
// Every page here is served on this Mac, so no test reaches the internet.
var servers = [];
var serve = function (handler_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([handler_1], args_1, true), void 0, function (handler, host) {
        var paths, server, port;
        if (host === void 0) { host = '127.0.0.1'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    paths = [];
                    server = (0, node_http_1.createServer)(function (request, response) {
                        var _a;
                        paths.push((_a = request.url) !== null && _a !== void 0 ? _a : '');
                        handler(request, response);
                    });
                    // The reader hangs up once it has enough, which the server may see as an error.
                    server.on('clientError', function (_err, socket) { return socket.destroy(); });
                    servers.push(server);
                    return [4 /*yield*/, new Promise(function (done) { return server.listen(0, host, done); })];
                case 1:
                    _a.sent();
                    port = server.address().port;
                    return [2 /*return*/, { paths: paths, port: port, url: function (path) {
                                if (path === void 0) { path = '/'; }
                                return "http://".concat(host.includes(':') ? "[".concat(host, "]") : host, ":").concat(port).concat(path);
                            } }];
            }
        });
    });
};
var html = function (body, type) {
    if (type === void 0) { type = 'text/html; charset=utf-8'; }
    return function (_, response) {
        response.writeHead(200, { 'content-type': type });
        response.end(body);
    };
};
var anyHost = function () { return true; };
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, _a, server;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _loop_1 = function (server) {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                server.closeAllConnections();
                                return [4 /*yield*/, new Promise(function (done) { return server.close(done); })];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _a = servers.splice(0);
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                server = _a[_i];
                return [5 /*yield**/, _loop_1(server)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
var refusalOf = function (work) { return __awaiter(void 0, void 0, void 0, function () {
    var err;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, work.then(function () { return null; }, function (failure) { return failure; })];
            case 1:
                err = _a.sent();
                (0, vitest_1.expect)(err).toBeInstanceOf(reply_1.Refusal);
                return [2 /*return*/, err.message];
        }
    });
}); };
(0, vitest_1.describe)('which addresses are public', function () {
    (0, vitest_1.it)('refuses this Mac, private networks, link-local, carrier NAT, documentation, multicast and broadcast IPv4', function () {
        for (var _i = 0, _a = ['0.0.0.0', '0.1.2.3', '10.0.0.1', '10.255.255.255', '100.64.0.1', '100.127.255.255', '127.0.0.1', '127.255.255.254', '169.254.169.254', '172.16.0.1', '172.31.255.255', '192.0.0.1', '192.0.2.1', '192.168.1.1', '198.18.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '239.255.255.255', '240.0.0.1', '255.255.255.255']; _i < _a.length; _i++) {
            var address = _a[_i];
            (0, vitest_1.expect)((0, bookmark_page_1.isPublicAddress)(address), address).toBe(false);
        }
    });
    (0, vitest_1.it)('takes the public IPv4 addresses just outside those ranges', function () {
        for (var _i = 0, _a = ['8.8.8.8', '1.1.1.1', '9.255.255.255', '11.0.0.0', '100.63.255.255', '100.128.0.0', '126.255.255.255', '128.0.0.0', '172.15.255.255', '172.32.0.1', '192.167.255.255', '192.169.0.0', '223.255.255.255']; _i < _a.length; _i++) {
            var address = _a[_i];
            (0, vitest_1.expect)((0, bookmark_page_1.isPublicAddress)(address), address).toBe(true);
        }
    });
    (0, vitest_1.it)('refuses every IPv6 address outside global unicast, IPv4-mapped, NAT64, 6to4, Teredo and documentation included', function () {
        for (var _i = 0, _a = ['::', '::1', 'fe80::1', 'FE80::1', 'fc00::1', 'fd00::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:8.8.8.8', '::ffff:7f00:1', '64:ff9b::808:808', '2002::1', '2002:c0a8:101::1', '2001::1', '2001:db8::1', '4000::1', '8000::1']; _i < _a.length; _i++) {
            var address = _a[_i];
            (0, vitest_1.expect)((0, bookmark_page_1.isPublicAddress)(address), address).toBe(false);
        }
    });
    (0, vitest_1.it)('takes public IPv6 addresses', function () {
        for (var _i = 0, _a = ['2606:4700::1', '2606:4700:4700::1111', '2001:4860:4860::8888', '2a00:1450:4001::1']; _i < _a.length; _i++) {
            var address = _a[_i];
            (0, vitest_1.expect)((0, bookmark_page_1.isPublicAddress)(address), address).toBe(true);
        }
    });
    (0, vitest_1.it)('refuses what is not an address at all', function () {
        for (var _i = 0, _a = ['', 'example.com', 'localhost', '127.1', '1.2.3.256']; _i < _a.length; _i++) {
            var address = _a[_i];
            (0, vitest_1.expect)((0, bookmark_page_1.isPublicAddress)(address), address).toBe(false);
        }
    });
});
(0, vitest_1.describe)('reading a page', function () {
    (0, vitest_1.it)('gives the page’s HTML', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(html('<title>Hello</title>'))];
                case 1:
                    page = _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(page.url('/post'), anyHost)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe('<title>Hello</title>');
                    (0, vitest_1.expect)(page.paths).toEqual(['/post']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('decodes the page in the charset its Content-Type names, and as UTF-8 when the name is unknown', function () { return __awaiter(void 0, void 0, void 0, function () {
        var latin, _a, unknown, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, serve(function (_, response) {
                        response.writeHead(200, { 'content-type': 'text/html; charset="ISO-8859-1"' });
                        response.end(Buffer.from([0x43, 0x61, 0x66, 0xe9]));
                    })];
                case 1:
                    latin = _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(latin.url(), anyHost)];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toBe('Café');
                    return [4 /*yield*/, serve(html('Café', 'text/html; charset=no-such-charset'))];
                case 3:
                    unknown = _c.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(unknown.url(), anyHost)];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('Café');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives no preview for a file that is not HTML, or an error status', function () { return __awaiter(void 0, void 0, void 0, function () {
        var json, _a, untyped, _b, missing, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, serve(html('{"title":"no"}', 'application/json'))];
                case 1:
                    json = _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(json.url(), anyHost)];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toBe('');
                    return [4 /*yield*/, serve(function (_, response) { return response.end('<title>no type</title>'); })];
                case 3:
                    untyped = _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(untyped.url(), anyHost)];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe('');
                    return [4 /*yield*/, serve(function (_, response) {
                            response.writeHead(404, { 'content-type': 'text/html' });
                            response.end('<title>Not found</title>');
                        })];
                case 5:
                    missing = _d.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(missing.url(), anyHost)];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('follows up to five redirects, relative ones included', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(function (request, response) {
                        var left = Number(request.url.slice(1));
                        if (left === 0)
                            return html('<title>Arrived</title>')(request, response);
                        response.writeHead(302, { location: String(left - 1) });
                        response.end();
                    })];
                case 1:
                    page = _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(page.url('/5'), anyHost)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe('<title>Arrived</title>');
                    (0, vitest_1.expect)(page.paths).toEqual(['/5', '/4', '/3', '/2', '/1', '/0']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives no preview after the sixth redirect, and stops asking', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(function (_, response) {
                        response.writeHead(301, { location: '/again' });
                        response.end();
                    })];
                case 1:
                    page = _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(page.url('/again'), anyHost)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe('');
                    (0, vitest_1.expect)(page.paths).toHaveLength(6);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives no preview for a redirect to a scheme other than http or https', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(function (_, response) {
                        response.writeHead(302, { location: 'file:///etc/passwd' });
                        response.end();
                    })];
                case 1:
                    page = _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(page.url(), anyHost)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads at most 512 KB of a page', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, serve(html('a'.repeat(600 * 1024)))];
                case 1:
                    page = _d.sent();
                    _a = vitest_1.expect;
                    _c = (_b = Buffer).byteLength;
                    return [4 /*yield*/, (0, bookmark_page_1.readPage)(page.url(), anyHost)];
                case 2:
                    _a.apply(void 0, [_c.apply(_b, [_d.sent()])]).toBe(512 * 1024);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the private-address guard', function () {
    (0, vitest_1.it)('refuses this Mac by address or by name before asking it anything', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _i, _a, url, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, serve(html('<title>Secret</title>'))];
                case 1:
                    page = _c.sent();
                    _i = 0, _a = [page.url(), "http://localhost:".concat(page.port, "/"), "http://127.1:".concat(page.port, "/"), "http://0x7f000001:".concat(page.port, "/")];
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    url = _a[_i];
                    _b = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)(url))];
                case 3:
                    _b.apply(void 0, [_c.sent(), url]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    (0, vitest_1.expect)(page.paths).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses an IPv6 literal on this Mac', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(html('<title>Secret</title>'), '::1')];
                case 1:
                    page = _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)(page.url()))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    (0, vitest_1.expect)(page.paths).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('checks every redirect again, so a public page cannot send the reader inwards', function () { return __awaiter(void 0, void 0, void 0, function () {
        var inside, outside, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(html('<title>Secret</title>'), '::1')];
                case 1:
                    inside = _b.sent();
                    return [4 /*yield*/, serve(function (_, response) {
                            response.writeHead(302, { location: inside.url() });
                            response.end();
                        })
                        // Here 127.0.0.1 stands for a public address and ::1 for a private one.
                    ];
                case 2:
                    outside = _b.sent();
                    // Here 127.0.0.1 stands for a public address and ::1 for a private one.
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)(outside.url(), function (address) { return address === '127.0.0.1'; }))];
                case 3:
                    // Here 127.0.0.1 stands for a public address and ::1 for a private one.
                    _a.apply(void 0, [_b.sent()]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    (0, vitest_1.expect)(outside.paths).toEqual(['/']);
                    (0, vitest_1.expect)(inside.paths).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a name when any of its answers is private', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(html('<title>Secret</title>'))
                    // localhost answers 127.0.0.1 and ::1 here; refusing either refuses the name.
                ];
                case 1:
                    page = _b.sent();
                    // localhost answers 127.0.0.1 and ::1 here; refusing either refuses the name.
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)("http://localhost:".concat(page.port, "/"), function (address) { return address !== '127.0.0.1'; }))];
                case 2:
                    // localhost answers 127.0.0.1 and ::1 here; refusing either refuses the name.
                    _a.apply(void 0, [_b.sent()]).toBe(messages_1.MESSAGES.bookmarkPrivate);
                    (0, vitest_1.expect)(page.paths).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('a slow page', function () {
    (0, vitest_1.it)('that never answers gives up after five seconds', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, started, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(function () { })];
                case 1:
                    page = _b.sent();
                    started = Date.now();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)(page.url(), anyHost))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(messages_1.MESSAGES.bookmarkSlow);
                    (0, vitest_1.expect)(Date.now() - started).toBeGreaterThanOrEqual(4900);
                    (0, vitest_1.expect)(Date.now() - started).toBeLessThan(7000);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('that stops halfway through its body gives up after five seconds in all', function () { return __awaiter(void 0, void 0, void 0, function () {
        var page, started, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, serve(function (_, response) {
                        response.writeHead(200, { 'content-type': 'text/html' });
                        response.write('<title>Half');
                    })];
                case 1:
                    page = _b.sent();
                    started = Date.now();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, refusalOf((0, bookmark_page_1.readPage)(page.url(), anyHost))];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(messages_1.MESSAGES.bookmarkSlow);
                    (0, vitest_1.expect)(Date.now() - started).toBeLessThan(7000);
                    return [2 /*return*/];
            }
        });
    }); });
});
