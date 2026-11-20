import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { DESIGNS_FOLDER, folderOf, isDesignId, isFolderName, LIMITS } from '../../../../shared/designs'
import { parseComments, parseScene, parseVersion } from './design_files'
import type { Parsed } from './design_files'

// This repository's own docs/designs/, read the way the Designs tab reads it,
// so a committed file that doesn't read fails here instead of only in the app.
const DESIGNS = resolve(__dirname, '../../../../..', DESIGNS_FOLDER)
const DESIGN = '.design.json'

const read = (folder: string, file: string): string => readFileSync(join(DESIGNS, folder, file), 'utf8')
const value = <T>(parsed: Parsed<T>): T => {
  if (!parsed.ok) throw new Error(`should read: ${parsed.detail}`)

  return parsed.value
}

// The tab skips any folder whose name doesn't fit the pattern, so these do too.
const folders = readdirSync(DESIGNS, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && isFolderName(entry.name))
  .map(entry => entry.name)
  .sort()

describe('the designs committed in this repository', () => {
  it('has at least one version folder to check', () => {
    expect(folders.length).toBeGreaterThan(0)
  })

  for (const folder of folders) {
    const files = readdirSync(join(DESIGNS, folder)).sort()
    const designFiles = files.filter(name => name.endsWith(DESIGN))

    describe(`docs/designs/${folder}`, () => {
      it('has a version.json that reads and whose label names this folder', () => {
        const version = value(parseVersion(read(folder, 'version.json')))

        expect(folderOf(version.label)).toBe(folder)
      })

      it('has a file for every design its version.json lists', () => {
        const version = value(parseVersion(read(folder, 'version.json')))

        expect(version.designs.filter(id => !files.includes(`${id}${DESIGN}`))).toEqual([])
      })

      // parseScene already refuses a layer id used twice anywhere in the file.
      for (const file of designFiles) {
        it(`has ${file} named with a design id, small enough and reading as a design`, () => {
          const text = read(folder, file)

          expect(isDesignId(file.slice(0, -DESIGN.length))).toBe(true)
          expect(text.length).toBeLessThanOrEqual(LIMITS.bytes)
          expect(parseScene(text)).toMatchObject({ ok: true })
        })
      }

      if (files.includes('comments.json')) {
        it('has a comments.json that reads', () => {
          expect(parseComments(read(folder, 'comments.json'))).toMatchObject({ ok: true })
        })
      }
    })
  }
})

// Notes section task: the Notes designs drawn in Pen and exported as version "1".
// Fails until that export is committed to docs/designs/1/.
describe('Notes section task: the Pen export in docs/designs/1', () => {
  it('has a version.json labelled "1", drafted by Claude from no earlier version, listing at least one design', () => {
    const path = join(DESIGNS, '1', 'version.json')

    expect(existsSync(path), `${path} is not there yet`).toBe(true)
    const version = value(parseVersion(readFileSync(path, 'utf8')))
    expect(version).toMatchObject({ label: '1', by: 'claude', from: null })
    expect(version.designs.length).toBeGreaterThan(0)
  })
})
