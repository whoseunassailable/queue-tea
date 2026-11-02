// Every failure main hands the window, in plain words.
export const MESSAGES = {
  listProjects: "Couldn't read your realms. Check that ~/.queue-tea can be read, then try again.",
  readProject: "Couldn't read this realm's quests. Try again.",
  unknownProject: "That realm isn't one Queue-tea knows. Pick one from the list.",
  readGame: "Couldn't work out your level. Your quests are safe. Try again.",
  readSettings: "Couldn't read your settings, so the defaults are in use.",
  saveSettings: "Couldn't save that setting. Try again.",
  badSetting: "That setting isn't one Queue-tea can use. Pick another.",
} as const
