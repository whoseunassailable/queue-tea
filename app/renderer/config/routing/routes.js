"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoute = exports.hrefOf = exports.routeOf = exports.ROUTES = void 0;
var hooks_1 = require("preact/hooks");
// Every route in the app. A path is lowercase words naming the screen.
exports.ROUTES = { home: '/home', quests: '/quests', designs: '/designs', branches: '/branches', chronicle: '/chronicle', mana: '/mana', notes: '/notes', calendar: '/calendar', hoard: '/hoard', guild: '/guild', library: '/library', settings: '/settings' };
var ALL = Object.values(exports.ROUTES);
var routeOf = function (hash) { var _a; return (_a = ALL.find(function (route) { return route === hash.slice(1); })) !== null && _a !== void 0 ? _a : exports.ROUTES.home; };
exports.routeOf = routeOf;
var hrefOf = function (route) { return "#".concat(route); };
exports.hrefOf = hrefOf;
var useRoute = function () {
    var _a = (0, hooks_1.useState)(function () { return (0, exports.routeOf)(window.location.hash); }), route = _a[0], setRoute = _a[1];
    (0, hooks_1.useEffect)(function () {
        var heard = function () { return setRoute((0, exports.routeOf)(window.location.hash)); };
        window.addEventListener('hashchange', heard);
        return function () { return window.removeEventListener('hashchange', heard); };
    }, []);
    return route;
};
exports.useRoute = useRoute;
