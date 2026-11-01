// What the assistant said, or why it said nothing.
export type Reply = { isAnswered: true; text: string } | { isAnswered: false; reason: string }
