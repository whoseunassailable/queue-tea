import { describe, expect, it } from 'vitest'
import { makeTask } from '../../tasks/api/fixtures'
import { buildFoldersIn, holdOf } from './space_rules'

describe('the build folders in an ignored listing', () => {
  it('keeps listed build folders, outermost first, wherever they sit', () => {
    expect(buildFoldersIn('node_modules/\0packages/app/node_modules/\0dist/\0.dart_tool/\0ios/Pods/\0')).toEqual(['.dart_tool', 'dist', 'ios/Pods', 'node_modules', 'packages/app/node_modules'])
  })
  it('skips entries git lists without a slash: files and symlinks named like a build folder', () => {
    expect(buildFoldersIn('node_modules\0apps/web/node_modules\0build\0.env\0')).toEqual([])
  })
  it('skips ignored folders that are not build output', () => {
    expect(buildFoldersIn('logs/\0secrets/\0node_modules_old/\0my-build/\0.venv/\0')).toEqual([])
  })
  it('drops a build folder inside one already kept, but not a sibling sharing its prefix', () => {
    expect(buildFoldersIn('build/\0build/cache/node_modules/\0build-tools/node_modules/\0')).toEqual(['build', 'build-tools/node_modules'])
  })
  it('keeps names with spaces, unicode and newlines exactly as git wrote them', () => {
    expect(buildFoldersIn('apps/my app/node_modules/\0приложение/dist/\0odd\nname/target/\0')).toEqual(['apps/my app/node_modules', 'odd\nname/target', 'приложение/dist'])
  })
  it('refuses paths that leave the folder or reach into .git', () => {
    expect(buildFoldersIn('../node_modules/\0/abs/node_modules/\0a/../dist/\0x/.git/node_modules/\0')).toEqual([])
  })
  it('finds nothing in an empty listing', () => {
    expect(buildFoldersIn('')).toEqual([])
  })
})

describe('who holds a quest folder', () => {
  const PROJECT = '/realm'; const FOLDER = '/quests/one'
  const own = makeTask({ id: 'one', state: 'done', worktreePath: FOLDER })

  it('its own quest, when that quest is current', () => {
    const task = { ...own, state: 'current' as const }
    expect(holdOf([task], task, FOLDER, PROJECT, true)).toBe('current')
  })
  it('another current quest working in the same folder', () => {
    const other = makeTask({ id: 'two', state: 'current', worktreePath: FOLDER })
    expect(holdOf([own, other], own, FOLDER, PROJECT, false)).toBe('current')
  })
  it('a current quest in the project folder does not hold a quest folder', () => {
    const other = makeTask({ id: 'two', state: 'current', worktreePath: null })
    expect(holdOf([own, other], own, FOLDER, PROJECT, false)).toBeNull()
  })
  it('a queued or done quest naming the folder does not hold it', () => {
    const queued = makeTask({ id: 'two', state: 'queued', worktreePath: FOLDER })
    expect(holdOf([own, queued], own, FOLDER, PROJECT, false)).toBeNull()
  })
  it('a live session in the folder, when no quest is current there', () => {
    expect(holdOf([own], own, FOLDER, PROJECT, true)).toBe('session')
  })
  it('nobody, when no quest is current there and no session is open', () => {
    expect(holdOf([own], own, FOLDER, PROJECT, false)).toBeNull()
  })
})
