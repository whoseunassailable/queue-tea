// Every failure main hands the window, in plain words.
export const MESSAGES = {
  listProjects: "Couldn't read your realms. Check that ~/.queue-tea can be read, then try again.",
  readProject: "Couldn't read this realm's quests. Try again.",
  unknownProject: "That realm isn't one Queue-tea knows. Pick one from the list.",
  readGame: "Couldn't work out your level. Your quests are safe. Try again.",
  readSettings: "Couldn't read your settings, so the defaults are in use.",
  saveSettings: "Couldn't save that setting. Try again.",
  badSetting: "That setting isn't one Queue-tea can use. Pick another.",
  unreadableRealm: "This realm's record can't be read, so nothing was changed.",
  readChoices: "Couldn't read what's on the board. Try again.",
  badQuest: "That quest isn't one Queue-tea knows. Pick it again.",
  titleRequired: 'Title is required.',
  titleTooLong: 'Title must be 200 characters or fewer.',
  reasonRequired: 'Pick a quest to wait for, or write a reason.',
  sealActive: 'Put the active quest back on the board first, then seal it.',
  badValue: "That value isn't one Queue-tea can use. Pick another.",
  setPriority: "Couldn't save the priority. Try again.",
  togglePlayNext: "Couldn't save Play next. Try again.",
  fileQuest: "Couldn't save the quest. Try Save again.",
  moveQuest: "Couldn't move the quest. Try again.",
  sealQuest: "Couldn't seal the quest. Try again.",
  unsealQuest: "Couldn't unseal the quest. Try again.",
  removeQuest: "Couldn't remove the quest. Try again.",
  restoreQuest: "Couldn't bring the quest back. Try again.",
  editQuest: "Couldn't save your change. Try again.",
  setActiveSaga: "Couldn't change the active saga. Try again.",
} as const

// The engine's refusals, in the screens' words. Whole phrases only, so a quest
// that happens to have "task" in its title keeps it.
const GAME_WORDS: readonly (readonly [string, string])[] = [
  ['That feature is no longer open.', 'That saga is no longer open.'],
  ["A task can't be part of itself.", "A quest can't be part of itself."],
  ['so its tasks go under that.', 'so its chapters go under that.'],
  ["has tasks of its own, so it can't be part of another.", "has chapters of its own, so it can't be part of another saga."],
  ['That would make the two tasks wait for each other.', 'That would make the two quests wait for each other.'],
]

export const inGameWords = (sentence: string): string => GAME_WORDS.reduce((text, [engine, game]) => text.replace(engine, game), sentence)
