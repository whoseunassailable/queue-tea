import { expect, test } from 'claude-code/testing'

import { projectRepositoryOf } from '../../../../hooks/shared/records/records_providers'
import { fakePorts, memoryHost } from '../../../helpers'

const HOME = '/Users/r'
const OFFSET = { 'date +%z': { stdout: '-0530\n' } }

// A session's folder picks its queue, so where each command ran matters.
const placeOf = async (mem: ReturnType<typeof memoryHost>, cwd: string) => {
  const folders: (string | undefined)[] = []
  const run = mem.host.run
  mem.host.run = async (argv, at) => {
    if (argv[0] === 'git' || argv[0] === 'date') folders.push(at)

    return run(argv, at)
  }

  return { place: await projectRepositoryOf(fakePorts(mem).ports).locate(cwd, HOME), folders }
}

test('inside a repository the project is its top folder, found from where the session works', async () => {
  const mem = memoryHost({ git: { 'git rev-parse --show-toplevel': { stdout: '/work/tea\n' }, ...OFFSET } })

  const { place, folders } = await placeOf(mem, '/work/tea/hooks/app')

  expect(place.projectPath).toBe('/work/tea')
  expect(place.file).toMatch(/^\/Users\/r\/\.queue-tea\/projects\/tea-[0-9a-f]{6}\.json$/)
  expect(place.offsetMinutes).toBe(-330)
  expect(folders).toEqual(['/work/tea/hooks/app', '/work/tea/hooks/app'])
})

test('outside a repository the project is the working directory', async () => {
  const mem = memoryHost({ git: OFFSET })

  const { place } = await placeOf(mem, '/work/notes')

  expect(place.projectPath).toBe('/work/notes')
  expect(place.file).toMatch(/^\/Users\/r\/\.queue-tea\/projects\/notes-[0-9a-f]{6}\.json$/)
})

test('old records that can’t be carried over are logged, and the project still loads', async () => {
  const mem = memoryHost({ git: { 'git rev-parse --show-toplevel': { stdout: '/work/tea\n' }, ...OFFSET } })
  mem.dirs.add(`${HOME}/.queue-tie/projects`)
  const { ports, done } = fakePorts(mem)

  const place = await projectRepositoryOf(ports).locate('/work/tea', HOME)

  expect(place.projectPath).toBe('/work/tea')
  expect(done.logs.some(line => line.startsWith('carrying over the Queue-tie records failed'))).toBe(true)
})
