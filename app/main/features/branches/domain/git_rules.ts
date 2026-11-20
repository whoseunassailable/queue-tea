import type { CommitProposal } from '../../../../../types'
import { creditsClaude } from '../../../../../hooks/features/commit_guard/domain/services/commit_proposal'
import type { ChangedFile, GraphCommit } from '../../../../shared/branches'

export const isOid = (value: unknown): value is string => typeof value === 'string' && /^[a-f0-9]{40,64}$/.test(value)
export const isBranch = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length < 240 && !value.startsWith('-') && !value.startsWith('/') && !value.endsWith('/') && !/[\s~^:?*\[\\\x00-\x1f]/.test(value) && !value.includes('..') && !value.includes('@{') && !value.includes('//') && value.split('/').every(p => !p.startsWith('.') && !p.endsWith('.') && !p.endsWith('.lock'))
export const isFile = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && !value.startsWith('/') && !value.includes('\0') && !value.split('/').some(p => p === '..' || p.toLowerCase() === '.git')
export const parseLog = (text: string): GraphCommit[] => text.trimEnd().split('\n').filter(Boolean).map(line => {
  const [id = '', parents = '', message = ''] = line.split('\0')
  return { id, parents: parents.split(' ').filter(Boolean), message }
}).filter(c => isOid(c.id))
export const parseStatus = (text: string): ChangedFile[] => {
  const parts = text.split('\0'); const files: ChangedFile[] = []
  for (let i = 0; i < parts.length; i++) {
    const line = parts[i]!
    if (line.length < 4) continue
    const status = line.slice(0, 2)
    files.push({ status, path: line.slice(3), previous: /[RC]/.test(status) ? parts[++i] ?? null : null })
  }
  return files
}
// Claude's proposal as Branches shows it: only when it was made on the commit
// the branch is on now, and only its files that are still changed. The record
// is read from disk, so its shape is checked here.
export const proposalFor = (proposal: unknown, head: string, changed: ChangedFile[]): CommitProposal | null => {
  const p = proposal as Partial<CommitProposal> | null | undefined
  if (!p || typeof p.message !== 'string' || !p.message.trim() || creditsClaude(p.message) || p.head !== head || typeof p.at !== 'string' || !Array.isArray(p.files)) return null
  const files = p.files.filter(f => isFile(f) && changed.some(c => c.path === f))
  return files.length ? { message: p.message, files, head: p.head, at: p.at } : null
}
