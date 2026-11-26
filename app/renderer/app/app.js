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
exports.App = void 0;
var hooks_1 = require("preact/hooks");
var routes_1 = require("../config/routing/routes");
var constants_1 = require("../core/constants/constants");
var sky_time_1 = require("../core/domain/sky_time");
var art_1 = require("../core/widgets/art");
var states_1 = require("../core/widgets/states");
var toasts_1 = require("../core/widgets/toasts");
var window_keys_1 = require("../core/widgets/window_keys");
var window_width_1 = require("../core/widgets/window_width");
var chronicle_page_1 = require("../features/chronicle/presentation/pages/chronicle_page");
var designs_page_1 = require("../features/designs/presentation/pages/designs_page");
var connect_dialog_1 = require("../features/github/presentation/widgets/connect_dialog");
var github_chip_1 = require("../features/github/presentation/widgets/github_chip");
var guild_page_1 = require("../features/guild/presentation/pages/guild_page");
var hoard_page_1 = require("../features/hoard/presentation/pages/hoard_page");
var home_page_1 = require("../features/home/presentation/pages/home_page");
var calendar_page_1 = require("../features/calendar/presentation/pages/calendar_page");
var library_page_1 = require("../features/library/presentation/pages/library_page");
var mana_page_1 = require("../features/mana/presentation/pages/mana_page");
var palette_dialog_1 = require("../features/palette/presentation/widgets/palette_dialog");
var notes_page_1 = require("../features/notes/presentation/pages/notes_page");
var notes_asks_1 = require("../features/notes/presentation/state_management/notes_asks");
var note_flows_1 = require("../features/notes/presentation/state_management/note_flows");
var branches_page_1 = require("../features/branches/presentation/pages/branches_page");
var quests_page_1 = require("../features/quests/presentation/pages/quests_page");
var quest_edits_1 = require("../features/quests/presentation/state_management/quest_edits");
var quest_flows_1 = require("../features/quests/presentation/state_management/quest_flows");
var quest_keys_1 = require("../features/quests/presentation/state_management/quest_keys");
var finish_sheet_1 = require("../features/quests/presentation/widgets/finish_sheet");
var move_dialog_1 = require("../features/quests/presentation/widgets/move_dialog");
var new_quest_sheet_1 = require("../features/quests/presentation/widgets/new_quest_sheet");
var remove_dialog_1 = require("../features/quests/presentation/widgets/remove_dialog");
var seal_dialog_1 = require("../features/quests/presentation/widgets/seal_dialog");
var victory_panel_1 = require("../features/quests/presentation/widgets/victory_panel");
var settings_page_1 = require("../features/settings/presentation/pages/settings_page");
var momentum_1 = require("../features/workspace/domain/momentum");
var failed_record_1 = require("../features/workspace/presentation/widgets/failed_record");
var first_run_1 = require("../features/workspace/presentation/widgets/first_run");
var hud_1 = require("../features/workspace/presentation/widgets/hud");
var sidebar_1 = require("../features/workspace/presentation/widgets/sidebar");
var sky_dial_1 = require("../features/workspace/presentation/widgets/sky_dial");
var realm_flows_1 = require("../features/workspace/state_management/realm_flows");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var en_1 = require("../l10n/en");
var TABS = [
    { route: routes_1.ROUTES.home, label: en_1.t.nav.home },
    { route: routes_1.ROUTES.quests, label: en_1.t.nav.quests },
    { route: routes_1.ROUTES.designs, label: en_1.t.nav.designs },
    { route: routes_1.ROUTES.branches, label: en_1.t.nav.branches },
    { route: routes_1.ROUTES.chronicle, label: en_1.t.nav.chronicle },
    { route: routes_1.ROUTES.mana, label: en_1.t.nav.mana },
    { route: routes_1.ROUTES.notes, label: en_1.t.nav.notes },
    { route: routes_1.ROUTES.calendar, label: en_1.t.nav.calendar },
];
var MORE_PAGES = [
    { route: routes_1.ROUTES.guild, label: en_1.t.nav.guild },
    { route: routes_1.ROUTES.hoard, label: en_1.t.nav.hoard },
    { route: routes_1.ROUTES.library, label: en_1.t.nav.library },
    { route: routes_1.ROUTES.settings, label: en_1.t.nav.settings },
];
var moodOf = function (session) {
    if (session === 'none')
        return 'm-asleep';
    if (session === 'working')
        return 'm-working';
    return session === 'needsYou' ? 'm-alert' : 'm-awake';
};
var useHour = function () {
    var _a = (0, hooks_1.useState)(function () { return new Date().getHours(); }), hour = _a[0], setHour = _a[1];
    (0, hooks_1.useEffect)(function () {
        var timer = setInterval(function () { return setHour(new Date().getHours()); }, constants_1.SKY_CHECK_MS);
        return function () { return clearInterval(timer); };
    }, []);
    return hour;
};
var Content = function (_a) {
    var _b;
    var state = _a.state, workspace = _a.workspace, engine = _a.engine, route = _a.route, edits = _a.edits, flows = _a.flows, actionsFor = _a.actionsFor, sheet = _a.sheet, isPaletteOpen = _a.isPaletteOpen, onSheet = _a.onSheet, onCopy = _a.onCopy, onPet = _a.onPet, realms = _a.realms, onOpenFolder = _a.onOpenFolder, onConnect = _a.onConnect;
    var branchSelection = (0, hooks_1.useRef)(null);
    (0, hooks_1.useEffect)(function () {
        if (route !== routes_1.ROUTES.branches && route !== routes_1.ROUTES.quests)
            branchSelection.current = null;
    }, [route]);
    var isCovered = sheet !== null || isPaletteOpen;
    var projects = state.projects, project = state.project, game = state.game, selected = state.selected;
    // These don't belong to a realm, so they don't wait for one to be picked.
    if (route === routes_1.ROUTES.guild) {
        var row = projects.status === 'ready' ? projects.data.find(function (p) { return p.key === selected; }) : undefined;
        return <guild_page_1.GuildPage engine={engine} realm={(row === null || row === void 0 ? void 0 : row.kind) === 'readable' ? { key: row.key, name: row.name } : null} onCopy={onCopy}/>;
    }
    if (route === routes_1.ROUTES.hoard)
        return <hoard_page_1.HoardPage engine={engine}/>;
    if (route === routes_1.ROUTES.library)
        return <library_page_1.LibraryPage engine={engine}/>;
    if (route === routes_1.ROUTES.settings) {
        return <settings_page_1.SettingsPage engine={engine} selected={selected} settings={state.settings} onChange={function (patch) { return void workspace.changeSettings(patch); }} onCopy={onCopy} onShow={function (key) { return void realms.show(key); }} onInstall={realms.install} onConnect={onConnect}/>;
    }
    if (projects.status === 'loading')
        return <states_1.Loading line={en_1.t.loading.realms}/>;
    if (projects.status === 'failed')
        return <states_1.Failed message={projects.message} onRetry={function () { return void workspace.refresh(); }}/>;
    if (projects.data.length === 0)
        return <first_run_1.FirstRun onOpenFolder={onOpenFolder} onCopy={onCopy}/>;
    if (selected === null || project.status === 'none')
        return <states_1.Empty title={en_1.t.empty.pickTitle} line={en_1.t.empty.pickLine}/>;
    if (project.status === 'loading')
        return <states_1.Loading line={en_1.t.loading.quests}/>;
    if (project.status === 'failed')
        return <states_1.Failed message={project.message} onRetry={function () { return void workspace.refresh(); }}/>;
    var view = project.data;
    if (view.kind === 'unreadable') {
        return (<failed_record_1.FailedRecord view={view} letterKeys={state.settings.letterKeys} isSheetOpen={isCovered} onRestore={function () { return void realms.restore(view.key); }} onRetry={function () { return void workspace.refresh(); }} onShow={function () { return void realms.show(view.key); }} onCopy={onCopy}/>);
    }
    if (route === routes_1.ROUTES.mana)
        return <mana_page_1.ManaPage engine={engine} realm={view.key}/>;
    if (route === routes_1.ROUTES.notes) {
        return (<notes_page_1.NotesPage 
        // One page per realm, so a save still on its way lands in the realm it came from.
        key={view.key} engine={engine} realm={view} isCovered={isCovered} onProject={function (next) { return workspace.adopt(view.key, next); }} onOpenQuest={function (id) {
                workspace.openQuest(view.key, id);
                window.location.hash = (0, routes_1.hrefOf)(routes_1.ROUTES.quests);
            }} onSay={function (text, tone) {
            if (tone === void 0) { tone = 'success'; }
            return workspace.say({ tone: tone, text: text });
        }}/>);
    }
    if (route === routes_1.ROUTES.calendar) {
        return (<calendar_page_1.CalendarPage key={view.key} engine={engine} realm={view} onOpenQuest={function (id) {
                workspace.openQuest(view.key, id);
                window.location.hash = (0, routes_1.hrefOf)(routes_1.ROUTES.quests);
            }} onSay={function (text, tone) {
            if (tone === void 0) { tone = 'success'; }
            return workspace.say({ tone: tone, text: text });
        }}/>);
    }
    if (route === routes_1.ROUTES.designs)
        return <designs_page_1.DesignsPage engine={engine} realm={view.key} name={view.name} onQuests={function () { return (window.location.hash = (0, routes_1.hrefOf)(routes_1.ROUTES.quests)); }}/>;
    if (route === routes_1.ROUTES.chronicle) {
        return (<chronicle_page_1.ChroniclePage engine={engine} realm={view.key} path={view.path} scope={state.settings.chronicleScope} onScope={function (chronicleScope) { return void workspace.changeSettings({ chronicleScope: chronicleScope }); }} onFollowUp={function (title) { return onSheet({ kind: 'new', parentId: null, title: title }); }}/>);
    }
    var flow = state.flows[view.key];
    var actions = actionsFor(view);
    if (route === routes_1.ROUTES.branches)
        return <branches_page_1.BranchesPage view={view} actions={actions} engine={engine} flow={flow} onOpen={function (id) { branchSelection.current = id; workspace.openQuest(view.key, id); window.location.hash = (0, routes_1.hrefOf)(routes_1.ROUTES.quests); }}/>;
    if (route === routes_1.ROUTES.quests) {
        return (<quests_page_1.QuestsPage engine={engine} view={view} picked={state.openQuests[view.key]} initialDetailOpen={branchSelection.current !== null && branchSelection.current === state.openQuests[view.key]} folded={(_b = state.settings.folds[view.key]) !== null && _b !== void 0 ? _b : []} savedQuest={state.savedQuest} isRefreshing={game.status === 'loading'} isSheetOpen={isCovered} letterKeys={state.settings.letterKeys} edits={edits} flow={flow} actions={actions} questNotes={state.questNotes} board={state.boards[view.key]} onBoard={function (board) { return workspace.setBoard(view.key, board); }} onOpen={function (id) { return workspace.openQuest(view.key, id); }} onFold={function (id) { return void workspace.toggleFold(view.key, id); }} onSheet={onSheet}/>);
    }
    return <home_page_1.HomePage engine={engine} onSwitch={function (branch) { return flows.switchBranch(view.key, branch); }} view={view} game={game} flow={flow} actions={actions} isSheetOpen={isCovered} letterKeys={state.settings.letterKeys} onPet={onPet} onNewQuest={function () { return onSheet({ kind: 'new', parentId: null }); }}/>;
};
var SheetView = function (_a) {
    var sheet = _a.sheet, view = _a.view, engine = _a.engine, edits = _a.edits, flows = _a.flows, onClose = _a.onClose;
    var key = view.key;
    if (sheet.kind === 'new')
        return <new_quest_sheet_1.NewQuestSheet engine={engine} view={view} edits={edits} parentId={sheet.parentId} title={sheet.title} onClose={onClose}/>;
    if (sheet.kind === 'move')
        return <move_dialog_1.MoveDialog engine={engine} realm={key} quest={sheet.quest} preset={sheet.preset} edits={edits} onClose={onClose}/>;
    if (sheet.kind === 'seal')
        return <seal_dialog_1.SealDialog engine={engine} realm={key} quest={sheet.quest} isActive={false} onSeal={function (seal) { return edits.seal(key, sheet.quest, seal); }} onClose={onClose}/>;
    if (sheet.kind === 'sealActive')
        return <seal_dialog_1.SealDialog engine={engine} realm={key} quest={sheet.quest} isActive onSeal={function (seal) { return flows.sealActive(key, sheet.quest, seal); }} onClose={onClose}/>;
    if (sheet.kind === 'finish')
        return <finish_sheet_1.FinishSheet realm={key} realmPath={view.path} quest={sheet.quest} logPath={view.docsLogPath} flows={flows} onClose={onClose}/>;
    return <remove_dialog_1.RemoveDialog realm={view.key} quest={sheet.quest} chapters={sheet.chapters} edits={edits} onClose={onClose}/>;
};
var App = function (_a) {
    var _b, _c, _d;
    var workspace = _a.workspace, engine = _a.engine;
    var state = (0, workspace_store_1.useWorkspace)(workspace);
    var edits = (0, hooks_1.useMemo)(function () { return (0, quest_edits_1.questEdits)(engine, workspace); }, [engine, workspace]);
    var flows = (0, hooks_1.useMemo)(function () { return (0, quest_flows_1.questFlows)(engine, workspace); }, [engine, workspace]);
    var realms = (0, hooks_1.useMemo)(function () { return (0, realm_flows_1.realmFlows)(engine, workspace); }, [engine, workspace]);
    var _e = (0, hooks_1.useState)(null), adding = _e[0], setAdding = _e[1];
    var _f = (0, hooks_1.useState)(null), connecting = _f[0], setConnecting = _f[1];
    var _g = (0, hooks_1.useState)(false), isPaletteOpen = _g[0], setPaletteOpen = _g[1];
    var _h = (0, hooks_1.useState)(false), isSideOpen = _h[0], setSideOpen = _h[1];
    var _j = (0, hooks_1.useState)(null), sheet = _j[0], setSheet = _j[1];
    var route = (0, routes_1.useRoute)();
    var useNarrowTabs = (0, window_width_1.useWindowWidth)() < constants_1.DETAIL_IS_PAGE_BELOW;
    var go = function (to) {
        window.location.hash = (0, routes_1.hrefOf)(to);
    };
    var hour = useHour();
    var _k = (0, hooks_1.useState)(false), isPetted = _k[0], setPetted = _k[1];
    (0, hooks_1.useEffect)(function () {
        if (!isPetted)
            return undefined;
        var timer = setTimeout(function () { return setPetted(false); }, constants_1.PET_MS);
        return function () { return clearTimeout(timer); };
    }, [isPetted]);
    var readable = state.project.status === 'ready' && state.project.data.kind === 'readable' ? state.project.data : null;
    var session = (_b = readable === null || readable === void 0 ? void 0 : readable.session.state) !== null && _b !== void 0 ? _b : 'none';
    // The tabs of a realm that doesn't read all show the same failure. From the
    // rest of the app they're still the way back to it.
    var isBroken = state.project.status === 'ready' && state.project.data.kind === 'unreadable';
    var isTab = TABS.some(function (tab) { return tab.route === route; });
    var actionsFor = function (view) { return ({
        onStart: function (quest, platform) { return void flows.start(view.key, quest, platform); },
        onContinueIn: function (quest, platform) { return void flows.continueIn(view.key, quest, platform); },
        onFinish: function (quest) { return setSheet({ kind: 'finish', quest: quest }); },
        onBack: function (quest) { return void flows.back(view.key, quest); },
        onBackNow: function (quest) { return void flows.backNow(view.key, quest); },
        onSealActive: function (quest) { return setSheet({ kind: 'sealActive', quest: quest }); },
        onNotYet: function (quest) { return void flows.notYet(view.key, quest); },
        onOpenClaude: function (quest) {
            var _a;
            if (quest === void 0) { quest = (_a = view.active) !== null && _a !== void 0 ? _a : undefined; }
            if (quest !== undefined)
                void flows.openClaude(view.key, quest);
        },
        onCheckAgain: function () { return void flows.checkAgain(view.key); },
        onCancel: function () { return flows.cancel(view.key); },
        onCopy: function (text) { return void flows.copy(text); },
        onStepBudget: function () { return void flows.stepBudget(view.key, view.budget); },
    }); };
    var openFolder = function () { return __awaiter(void 0, void 0, void 0, function () {
        var pick;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, realms.openFolder()];
                case 1:
                    pick = _a.sent();
                    if (pick !== null)
                        setAdding({ pick: pick, isDetected: false });
                    return [2 /*return*/];
            }
        });
    }); };
    var connect = function (key, name, login) {
        void workspace.setRealmAccount(key, login);
        workspace.say({ tone: 'success', text: login === null ? en_1.t.github.disconnected(name) : en_1.t.github.connectedTo(login, name) });
    };
    var closeWon = function () {
        workspace.showWon(null);
        workspace.dismissBadges();
    };
    // ⌘N and ⌘Z work from every screen. Inside a text field ⌘Z is the field's,
    // and on Designs it's the editor's.
    (0, window_keys_1.useWindowKeys)(function (event) {
        if (event.key === 'Escape' && state.won !== null)
            closeWon();
        if (!event.metaKey || sheet !== null || isPaletteOpen)
            return;
        var tab = TABS[Number(event.key) - 1];
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            setSideOpen(!isSideOpen);
        }
        else if (tab !== undefined && /^[1-9]$/.test(event.key)) {
            event.preventDefault();
            go(tab.route);
        }
        else if (event.key === ',') {
            event.preventDefault();
            go(routes_1.ROUTES.settings);
        }
        else if (event.key === 'k') {
            event.preventDefault();
            setPaletteOpen(true);
        }
        else if (event.key === 'o') {
            event.preventDefault();
            void openFolder();
        }
        else if (event.key.toLowerCase() === 'n' && (event.shiftKey || event.key === 'N') && readable !== null) {
            // ⇧⌘N, from any screen: Notes opens and makes an Untitled note. The
            // Notes page's own sheets cover it, as the app's do.
            event.preventDefault();
            if (document.querySelector('[role="dialog"]') !== null)
                return;
            newNote();
        }
        else if (event.key === 'n' && readable !== null) {
            event.preventDefault();
            setSheet({ kind: 'new', parentId: null });
        }
        else if (event.key === 'z' && !event.shiftKey && !(0, quest_keys_1.isTyping)(event.target) && route !== routes_1.ROUTES.designs) {
            event.preventDefault();
            void workspace.undo();
        }
    });
    var latestMenu = (0, hooks_1.useRef)(function () { });
    latestMenu.current = function (item) {
        if (item.kind === 'toggleRealms')
            setSideOpen(!isSideOpen);
        else if (item.kind === 'installCommand')
            void realms.install();
        else if (item.kind === 'showRecord') {
            if (state.selected !== null)
                void realms.show(state.selected);
        }
        else
            window.dispatchEvent((0, quest_keys_1.menuKey)(item.key, item.isMeta));
    };
    (0, hooks_1.useEffect)(function () { return engine.onMenu(function (item) { return latestMenu.current(item); }); }, [engine]);
    // What brought the app forward, whether it's listening yet or not.
    (0, hooks_1.useEffect)(function () {
        var arrived = function (opened) { return void realms.arrived(opened, function (pick) { return setAdding({ pick: pick, isDetected: true }); }, function () { return go(routes_1.ROUTES.home); }); };
        var stop = engine.onOpened(arrived);
        void realms.takeWaiting(arrived);
        return stop;
    }, [engine, realms]);
    var pickRealm = function (key) {
        setSideOpen(false);
        void workspace.pick(key);
    };
    var newNote = function () {
        (0, notes_asks_1.askNotes)({ kind: 'new' });
        go(routes_1.ROUTES.notes);
    };
    var openNote = function (id) {
        if (readable === null)
            return;
        var show = function () {
            (0, notes_asks_1.askNotes)({ kind: 'open', id: id });
            go(routes_1.ROUTES.notes);
        };
        // A Jot toast can outlive a realm switch; its note still belongs there.
        if (workspace.getState().selected !== readable.key)
            void workspace.pick(readable.key).then(show);
        else
            show();
    };
    // With Notes on screen, or about to be, the page makes the note so its list
    // stays true; elsewhere the app makes it and you stay where you are.
    var jot = function (words, isOpening) {
        if (readable === null)
            return;
        if (!isOpening && route !== routes_1.ROUTES.notes) {
            void (0, note_flows_1.jotIdea)(engine, workspace, readable.key, words, openNote);
            return;
        }
        (0, notes_asks_1.askNotes)({ kind: 'jot', text: words, isOpening: isOpening });
        go(routes_1.ROUTES.notes);
    };
    var paletteInput = {
        view: readable,
        realms: state.projects.status === 'ready' ? state.projects.data : [],
        selected: state.selected,
        onStart: function (quest) { return readable !== null && void flows.start(readable.key, quest); },
        onOpenQuest: function (id) {
            if (readable === null)
                return;
            workspace.openQuest(readable.key, id);
            go(routes_1.ROUTES.quests);
        },
        onFinish: function () { return (readable === null || readable === void 0 ? void 0 : readable.active) != null && setSheet({ kind: 'finish', quest: readable.active }); },
        onBack: function () { return (readable === null || readable === void 0 ? void 0 : readable.active) != null && void flows.back(readable.key, readable.active); },
        onOpenClaude: function () { return (readable === null || readable === void 0 ? void 0 : readable.active) != null && void flows.openClaude(readable.key, readable.active); },
        onNewQuest: function (title) { return setSheet(__assign({ kind: 'new', parentId: null }, (title === '' ? {} : { title: title }))); },
        onNewNote: newNote,
        onOpenNote: openNote,
        onJot: jot,
        onGo: go,
        onPickRealm: pickRealm,
        onOpenFolder: function () { return void openFolder(); },
    };
    var classes = ['rm', "t-".concat((0, sky_time_1.skyOf)(state.settings.sky, hour)), state.won === null ? moodOf(session) : 'm-cheer', isPetted ? 'pet' : '', state.settings.isCalm ? 'calm' : '', isSideOpen ? 'side-open' : ''].filter(function (c) { return c !== ''; });
    return (<div class={classes.join(' ')} data-testid="root">
      <art_1.Sky />
      <sidebar_1.Sidebar engine={engine} projects={state.projects} selected={state.selected} detected={state.detected} route={route} onPick={pickRealm} onOpenFolder={function () { return void openFolder(); }}/>
      <div class="main">
        <header class="top">
          <button type="button" class="icon-btn big panel side-toggle" aria-label={en_1.t.narrow.showRealms} aria-expanded={isSideOpen} onClick={function () { return setSideOpen(!isSideOpen); }}>
            ☰
          </button>
          {useNarrowTabs && (<select class="chip-select tab-menu" aria-label={en_1.t.narrow.section} value={route} disabled={isBroken && isTab} onChange={function (event) { return go(event.target.value); }}>
              {__spreadArray(__spreadArray([], TABS, true), MORE_PAGES, true).map(function (tab) { return (<option key={tab.route} value={tab.route}>
                  {tab.label}
                </option>); })}
            </select>)}
          {!useNarrowTabs && <nav class="tabs panel" aria-label={en_1.t.nav.sections}>
            {TABS.map(function (tab) {
                return isBroken && isTab ? (<span key={tab.route} class="tab" aria-disabled="true">
                  {tab.label}
                </span>) : (<a key={tab.route} class={tab.route === route ? 'tab on' : 'tab'} href={(0, routes_1.hrefOf)(tab.route)} aria-current={tab.route === route ? 'page' : undefined}>
                  {tab.label}
                </a>);
            })}
          </nav>}
          <hud_1.Hud game={state.game} quest={(0, momentum_1.questAheadOf)(readable)} onRetry={function () { return void workspace.refresh(); }}>
            {readable !== null && <github_chip_1.GithubChip login={(_c = state.settings.realmAccounts[readable.key]) !== null && _c !== void 0 ? _c : null} onOpen={function () { return setConnecting(readable); }}/>}
          </hud_1.Hud>
          <sky_dial_1.SkyDial sky={state.settings.sky} onPick={function (sky) { return void workspace.setSky(sky); }}/>
          {readable !== null && (<button type="button" class="icon-btn big panel" aria-label={en_1.t.actions.newQuest} onClick={function () { return setSheet({ kind: 'new', parentId: null }); }}>
              +
            </button>)}
        </header>
        {state.note !== null && (<p class="note panel" role="status">
            {state.note}
          </p>)}
        <Content state={state} workspace={workspace} engine={engine} route={route} edits={edits} flows={flows} actionsFor={actionsFor} sheet={sheet} isPaletteOpen={isPaletteOpen} onSheet={setSheet} onCopy={function (text) { return void flows.copy(text); }} onPet={function () { return setPetted(true); }} realms={realms} onOpenFolder={function () { return void openFolder(); }} onConnect={setConnecting}/>
      </div>
      {sheet !== null && readable !== null && <SheetView sheet={sheet} view={readable} engine={engine} edits={edits} flows={flows} onClose={function () { return setSheet(null); }}/>}
      {isPaletteOpen && <palette_dialog_1.PaletteDialog key={state.selected} engine={engine} input={paletteInput} onClose={function () { return setPaletteOpen(false); }}/>}
      {adding !== null && <first_run_1.AddRealmDialog engine={engine} pick={adding.pick} isDetected={adding.isDetected} flows={realms} onAccount={function (key, login) { return void workspace.setRealmAccount(key, login); }} onCopy={function (text) { return void flows.copy(text); }} onClose={function () { return setAdding(null); }}/>}
      {connecting !== null && <connect_dialog_1.ConnectDialog engine={engine} realm={connecting.name} connected={(_d = state.settings.realmAccounts[connecting.key]) !== null && _d !== void 0 ? _d : null} onSave={function (login) { return connect(connecting.key, connecting.name, login); }} onCopy={function (text) { return void flows.copy(text); }} onClose={function () { return setConnecting(null); }}/>}
      {state.won !== null && <victory_panel_1.VictoryPanel won={state.won} isCalm={state.settings.isCalm} onClose={closeWon}/>}
      <toasts_1.Toasts toasts={state.toasts} onDismiss={workspace.dismiss}/>
    </div>);
};
exports.App = App;
