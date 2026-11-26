// A step is one line: its subject is the first line of the command or the
// file's path, at most this many characters.
export const STEP_SUBJECT_LIMIT = 200

// Background shells a task waits on at once. Past this the oldest is
// forgotten: its check's time is then not counted, and nothing else changes.
export const WAITING_LIMIT = 10
