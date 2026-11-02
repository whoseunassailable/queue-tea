import { t } from '../../../l10n/en'

// Bundled at build time from the helpers themselves, so the page can't drift
// from what they really are.
const FILES = import.meta.glob('../../../../../agents/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const LOGOS = import.meta.glob('../../../../../.claude-plugin/helpers/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>

const ORDER = ['commit-chai-n', 'mocha-mockup', 'chai-pter', 'tea-dd'] as const
const KINDS: Record<string, string> = { 'commit-chai-n': 'git', 'mocha-mockup': 'design', 'chai-pter': 'docs', 'tea-dd': 'tests' }

export type Helper = { id: string; name: string; role: string; kind: string; summary: string; skills: string[]; mention: string; logo: string }

const fileNamed = (files: Record<string, string>, name: string): string => Object.entries(files).find(([path]) => path.endsWith(`/${name}`))?.[1] ?? ''

// "name: value" lines and a "skills:" list, which is all the frontmatter holds.
const frontmatter = (text: string): { description: string; skills: string[] } => {
  const head = text.split('---')[1] ?? ''
  const description = head.match(/^description:\s*(.*)$/m)?.[1] ?? ''
  const skills = [...head.matchAll(/^\s+-\s+(?:[\w-]+:)?([\w-]+)\s*$/gm)].map(match => match[1]!)

  return { description, skills }
}

const helperOf = (id: string): Helper => {
  const { description, skills } = frontmatter(fileNamed(FILES, `${id}.md`))
  const end = description.indexOf('. ')
  const lead = end === -1 ? description : description.slice(0, end)

  return {
    id,
    name: lead.split(',')[0] ?? id,
    role: t.guild.roles[id] ?? '',
    kind: KINDS[id] ?? '',
    // The first sentence only says who it is, and the card already does.
    summary: end === -1 ? description : description.slice(end + 2),
    skills,
    mention: `@queue-tea:${id}`,
    logo: fileNamed(LOGOS, `${id}.svg`),
  }
}

export const HELPERS: readonly Helper[] = ORDER.map(helperOf)
