"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questEdits = void 0;
var en_1 = require("../../../../l10n/en");
var edits_1 = require("../../domain/edits");
// Every edit to a realm, as the screens ask for it. The ones a form makes stay
// quiet on failure, because the form shows the error beside its fields.
var questEdits = function (engine, workspace) { return ({
    setPriority: function (key, quest, priority) {
        return workspace.run({
            key: key,
            questId: quest.id,
            preview: (0, edits_1.withPriority)(quest.id, priority),
            call: function () { return engine.setPriority(key, quest.id, priority); },
            said: en_1.t.edit.priority(en_1.t.priority[quest.priority], en_1.t.priority[priority], quest.title),
            undo: { said: en_1.t.edit.undone, call: function () { return engine.setPriority(key, quest.id, quest.priority); } },
        });
    },
    togglePlayNext: function (key, quest) {
        return workspace.run({
            key: key,
            preview: (0, edits_1.withPlayNext)(quest.id),
            call: function () { return engine.togglePlayNext(key, quest.id); },
            said: quest.isPlayNext ? en_1.t.edit.playNextOff(quest.title) : en_1.t.edit.playNextOn(quest.title),
            undo: { said: en_1.t.edit.undone, call: function () { return engine.togglePlayNext(key, quest.id); } },
        });
    },
    remove: function (key, quest) {
        return workspace.run({
            key: key,
            preview: (0, edits_1.withoutQuest)(quest.id),
            call: function () { return engine.removeQuest(key, quest.id); },
            said: en_1.t.edit.removed(quest.title),
            undo: { said: en_1.t.edit.undone, call: function () { return engine.restoreQuest(key, quest.id); } },
        });
    },
    // A saga's chapters change, so it asks first and has no Undo.
    removeSaga: function (key, quest) {
        return workspace.run({ key: key, call: function () { return engine.removeQuest(key, quest.id); }, said: en_1.t.edit.removed(quest.title), isQuiet: true });
    },
    unseal: function (key, quest) { return workspace.run({ key: key, call: function () { return engine.unsealQuest(key, quest.id); }, said: en_1.t.edit.unsealed(quest.title) }); },
    seal: function (key, quest, seal) {
        return workspace.run({
            key: key,
            call: function () { return engine.sealQuest(key, quest.id, seal); },
            said: en_1.t.edit.sealed(quest.title),
            undo: { said: en_1.t.edit.undone, call: function () { return engine.unsealQuest(key, quest.id); } },
            isQuiet: true,
        });
    },
    move: function (key, quest, parentId, parentTitle) {
        return workspace.run({
            key: key,
            call: function () { return engine.moveQuest(key, quest.id, parentId); },
            said: parentTitle === null ? en_1.t.edit.alone(quest.title) : en_1.t.edit.moved(parentTitle, quest.title),
            undo: { said: en_1.t.edit.undone, call: function () { return engine.moveQuest(key, quest.id, quest.parentId); } },
            isQuiet: true,
        });
    },
    file: function (key, quest, sagaTitle, isQuiet) {
        if (isQuiet === void 0) { isQuiet = true; }
        return workspace.run({
            key: key,
            call: function () { return engine.fileQuest(key, quest); },
            said: en_1.t.edit.queued(quest.title, en_1.t.priority[quest.priority], sagaTitle),
            isQuiet: isQuiet,
        });
    },
    edit: function (key, quest, edit) {
        return workspace.run({ key: key, questId: quest.id, call: function () { return engine.editQuest(key, quest.id, edit); } });
    },
    setActiveSaga: function (key, quest) {
        return workspace.run({
            key: key,
            call: function () { var _a; return engine.setActiveSaga(key, (_a = quest === null || quest === void 0 ? void 0 : quest.id) !== null && _a !== void 0 ? _a : null); },
            said: quest === null ? en_1.t.edit.sagaOff : en_1.t.edit.sagaOn(quest.title),
        });
    },
}); };
exports.questEdits = questEdits;
