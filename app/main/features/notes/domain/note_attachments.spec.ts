import { describe, expect, it } from 'vitest'

import { attachmentError, attachmentMarkdown, noteFilePath, noteFileUrl } from '../../../../shared/note_attachments'
import { linksOf, renameLinks } from '../../../../shared/notes'

describe('note attachments', () => {
  it('accepts an image or PDF below 10 MB, including files whose picker omits the type', () => {
    expect(attachmentError({ name: 'photo.png', type: 'image/png', size: 100 })).toBeUndefined()
    expect(attachmentError({ name: 'report.pdf', type: '', size: 100 })).toBeUndefined()
    expect(attachmentError({ name: 'Pasted image', type: 'image/png', size: 100 })).toBeUndefined()
    expect(attachmentError({ name: 'a.txt', type: 'text/plain', size: 100 })).toBe('type')
    expect(attachmentError({ name: 'photo.png', type: 'image/png', size: 10 * 1024 * 1024 })).toBe('size')
  })

  it('reads only relative files in the vault root or its attachments folder', () => {
    expect(noteFilePath('attachments/report%20one.pdf#page=2')).toBe('attachments/report one.pdf')
    expect(noteFilePath('data.csv')).toBe('data.csv')
    for (const value of ['../secret.pdf', 'attachments/../../secret.pdf', '/tmp/a.png', 'file:///tmp/a.png', 'https://a/b.png', 'attachments/%2e%2e/a.png', 'attachments/a%2fb.png', '.secret.pdf', 'attachments/.secret.pdf', 'note.md', 'a\\b.png']) expect(noteFilePath(value)).toBeNull()
  })

  it('writes portable Markdown and escapes the file label', () => {
    expect(attachmentMarkdown({ path: 'attachments/a.png', kind: 'image' }, 'a [draft].png')).toBe('![a \\[draft\\].png](<attachments/a.png>)')
    expect(attachmentMarkdown({ path: 'attachments/a.pdf', kind: 'pdf' }, 'report.pdf')).toBe('[report.pdf](<attachments/a.pdf>)')
    expect(noteFileUrl('demo-abc123', 'attachments/a b.png')).toBe('note-file://realm/demo-abc123/attachments/a%20b.png')
  })

  it('keeps dotted note titles linkable while leaving attachment embeds out of renames', () => {
    expect(linksOf('[[Release 1.2]] ![[photo.png]] [[attachments/report.pdf]]')).toEqual(['Release 1.2'])
    expect(renameLinks('[[Release 1.2]]', 'Release 1.2', 'Release 1.3')).toBe('[[Release 1.3]]')
    expect(renameLinks('![[photo.png]]', 'photo.png', 'Other')).toBe('![[photo.png]]')
  })
})
