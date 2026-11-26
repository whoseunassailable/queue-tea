// What the menu says about a record that can't be read. A reason is shown with
// a capital and a full stop; a fix takes the place of the usual line under it.
export const RECORD_TEXT = {
  failed: "Couldn't read your task record",
  leftAsItIs: (canRestore: boolean) =>
    `It is left as it is. ${canRestore ? 'Use the last good copy, try again,' : 'Try again,'} or look at the file in ~/.queue-tea/projects.`,
  restore: 'Use the last good copy',
  retry: 'Try again',
  cannotOpen: 'Claude Code could not open the file',
  cannotOpenFix: (file: string) =>
    `Check that ${file} is there and that you can read it, then try again. The debug log has the details.`,
} as const
