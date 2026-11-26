// What the filing band says, above the prompt.
export const FILE_BAND_TEXT = {
  newTask: (title: string) => `New task: ${title}`,
  partOf: 'Part of ',
  onItsOwn: 'On its own',
  newFeature: 'New feature…',
  featureLabel: 'New feature',
  featurePlaceholder: 'its name, then Enter',
  featureSet: 'Set',
  askParent: 'Is it part of a feature? Pick one, or On its own.',
  save: 'Save',
  sameTask: 'Same task',
  cancel: 'Cancel',
  // The task it looks like, so the same work isn't filed twice.
  alikeQueued: (title: string) => `Already waiting: "${title}". Add this message to it, or Save it as a task of its own.`,
  alikeCurrent: (title: string) => `Looks like the task under way: "${title}". Same task sends it there.`,
  alikeDone: (title: string, day: string) => `Looks done already: "${title}", finished ${day}. Save only if this is more work.`,
  addToIt: 'Add to it',
  added: (title: string) => `Added to: ${title}`,
  notWaiting: "That task isn't waiting any more, so nothing was added. Save it as a task of its own, or Cancel.",
  addFailed: "Couldn't add the message to that task. Try Add to it again.",
} as const
