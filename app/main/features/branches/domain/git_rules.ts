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
