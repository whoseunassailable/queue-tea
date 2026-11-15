// Files a quest's description links. The app saves them in the realm's notes
// folder and writes the link Notes writes; only the first message to Claude
// turns them into paths on this machine.
export const NOTES_FOLDER = '.queue-tea/notes'

export type DescriptionFile = { name: string; path: string; isImage: boolean }

// Only content-hashed attachments Queue-tea saved, never a hand-typed path.
const LINK = /(!?)\[((?:\\.|[^\\\]])*)\]\(<?(attachments\/[0-9a-f]{64}\.[a-z0-9]{1,10})>?\)/g

export const descriptionFiles = (text: string | null): DescriptionFile[] =>
  [...(text ?? '').matchAll(LINK)].map(([, bang, label, path]) => ({ name: label!.replace(/\\(.)/g, '$1'), path: path!, isImage: bang === '!' }))

export const withFilePaths = (text: string, folder: string): string =>
  text.replace(LINK, (_, bang: string, label: string, path: string) => `${bang}[${label}](<${folder}/${path}>)`)

// The realm's notes folder, named by the same key as its record file.
export const notesFolderOf = (ctx: { home: string; file: string }): string =>
  `${ctx.home}/${NOTES_FOLDER}/${ctx.file.split('/').at(-1)!.replace(/\.json$/, '')}`
