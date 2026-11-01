import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'

import { checkLayers } from './check_layers.mjs'

// A tree of files under hooks/, each a path and its text.
const tree = files => {
  const root = mkdtempSync(join(tmpdir(), 'layers-'))
  for (const [path, text] of Object.entries(files)) {
    const full = join(root, 'hooks', path)
    mkdirSync(dirname(full), { recursive: true })
    writeFileSync(full, text)
  }

  return root
}
const problems = (files, options) => checkLayers(tree(files), { legacy: [], legacyReaders: [], knownCycles: [], ...options })
const reports = (files, words, options) => {
  const found = problems(files, options)
  assert.ok(found.some(p => p.includes(words)), `expected "${words}" in ${JSON.stringify(found)}`)
}

test('a domain file importing a data file is reported', () => {
  reports(
    {
      'features/a/domain/usecases/x.ts': "import { y } from '../../data/repositories/y_impl'\n",
      'features/a/data/repositories/y_impl.ts': 'export const y = 1\n',
    },
    'features/a/domain/usecases/x.ts',
  )
})

test('a domain file importing claude-code is reported', () => {
  reports({ 'features/a/domain/services/x.ts': "import type { On } from 'claude-code'\n" }, 'claude-code')
})

test('a domain file importing core/host is reported', () => {
  reports(
    { 'features/a/domain/services/x.ts': "import type { Host } from '../../../../core/host/host'\n", 'core/host/host.ts': 'export type Host = 1\n' },
    'core/host',
  )
})

test('a domain file may import its own domain, shared domain and core/env', () => {
  const found = problems({
    'features/a/domain/usecases/x.ts':
      "import { y } from '../services/y'\nimport { z } from '../../../../shared/b/domain/services/z'\nimport type { Env } from '../../../../core/env/env'\n",
    'features/a/domain/services/y.ts': 'export const y = 1\n',
    'shared/b/domain/services/z.ts': 'export const z = 1\n',
    'core/env/env.ts': 'export type Env = 1\n',
  })
  assert.deepEqual(found, [])
})

test('a controller importing claude-code is reported', () => {
  reports({ 'features/a/presentation/state_management/c.ts': "import type { On } from 'claude-code'\n" }, 'claude-code')
})

test('a controller importing data/ is reported', () => {
  reports(
    {
      'features/a/presentation/state_management/c.ts': "import { y } from '../../data/datasources/y'\n",
      'features/a/data/datasources/y.ts': 'export const y = 1\n',
    },
    'features/a/presentation/state_management/c.ts',
  )
})

test('a controller importing an _impl file is reported', () => {
  reports(
    {
      'features/a/presentation/state_management/c.ts': "import { y } from '../../../../shared/b/data/repositories/b_repository_impl'\n",
      'shared/b/data/repositories/b_repository_impl.ts': 'export const y = 1\n',
    },
    'b_repository_impl',
  )
})

test('a controller may import its providers file', () => {
  const found = problems({
    'features/a/presentation/state_management/c.ts': "import { y } from '../../a_providers'\n",
    'features/a/a_providers.ts': "import { z } from './data/repositories/a_repository_impl'\nexport const y = z\n",
    'features/a/data/repositories/a_repository_impl.ts': 'export const z = 1\n',
  })
  assert.deepEqual(found, [])
})

for (const layer of ['data/repositories', 'domain/services', 'presentation/views']) {
  test(`a feature importing another feature is reported, from ${layer}`, () => {
    reports(
      {
        [`features/a/${layer}/x.ts`]: "import { y } from '../../../b/domain/services/y'\n",
        'features/b/domain/services/y.ts': 'export const y = 1\n',
      },
      'another feature',
    )
  })
}

test('shared importing a feature is reported', () => {
  reports(
    {
      'shared/a/data/repositories/x.ts': "import { y } from '../../../../features/b/domain/services/y'\n",
      'features/b/domain/services/y.ts': 'export const y = 1\n',
    },
    'shared/a/data/repositories/x.ts',
  )
})

test('core importing shared/x/data is reported', () => {
  reports(
    { 'core/store/s.ts': "import { y } from '../../shared/x/data/datasources/y'\n", 'shared/x/data/datasources/y.ts': 'export const y = 1\n' },
    'core/store/s.ts',
  )
})

test('core importing shared/x/domain/entities is allowed', () => {
  const found = problems({
    'core/store/s.ts': "import type { Y } from '../../shared/x/domain/entities/y'\n",
    'shared/x/domain/entities/y.ts': 'export type Y = 1\n',
  })
  assert.deepEqual(found, [])
})

test('a file outside core, data, views, widgets, app and register.tsx importing claude-code is reported', () => {
  reports({ 'shared/a/domain/usecases/x.ts': "import { read } from 'claude-code'\n" }, 'claude-code')
})

test('core, data, views, widgets, app and register.tsx may import claude-code', () => {
  const line = "import type { On } from 'claude-code'\n"
  const found = problems({
    'core/store/s.ts': line,
    'shared/a/data/datasources/d.ts': line,
    'features/a/presentation/views/v.tsx': line,
    'features/a/presentation/widgets/w.tsx': line,
    'app/menu/m.tsx': line,
    'register.tsx': line,
  })
  assert.deepEqual(found, [])
})

test('a new file importing a flat legacy file is reported', () => {
  reports(
    { 'features/a/domain/services/x.ts': "import { y } from '../../../../flow'\n", 'flow.ts': 'export const y = 1\n' },
    'legacy',
    { legacy: ['flow.ts'] },
  )
})

test('a flat legacy file may import anything', () => {
  const found = problems(
    { 'flow.ts': "import { y } from './features/a/data/repositories/y_impl'\n", 'features/a/data/repositories/y_impl.ts': 'export const y = 1\n' },
    { legacy: ['flow.ts'] },
  )
  assert.deepEqual(found, [])
})

test('a folder on LEGACY_READERS may import a legacy file', () => {
  const found = problems(
    { 'features/a/presentation/state_management/c.ts': "import { y } from '../../../../flow'\n", 'flow.ts': 'export const y = 1\n' },
    { legacy: ['flow.ts'], legacyReaders: ['features/a'] },
  )
  assert.deepEqual(found, [])
})

test('an import cycle is reported, naming its files', () => {
  reports(
    {
      'core/store/a.ts': "import { b } from './b'\nexport const a = b\n",
      'core/store/b.ts': "import { a } from './a'\nexport const b = a\n",
    },
    'core/store/a.ts → core/store/b.ts',
  )
})

test('a cycle through import type is not one', () => {
  const found = problems({
    'core/store/a.ts': "import type { B } from './b'\nexport type A = B\n",
    'core/store/b.ts': "import { type A } from './a'\nexport type B = A\n",
  })
  assert.deepEqual(found, [])
})

test('a cycle listed as known is not reported', () => {
  const found = problems(
    {
      'core/store/a.ts': "import { b } from './b'\nexport const a = b\n",
      'core/store/b.ts': "import { a } from './a'\nexport const b = a\n",
    },
    { knownCycles: ['core/store/a.ts → core/store/b.ts'] },
  )
  assert.deepEqual(found, [])
})

test('a module="./x.tsx" naming no file is reported', () => {
  reports({ 'features/a/presentation/views/v.tsx': '<Client key="cup" module="./teacup.tsx" />\n' }, './teacup.tsx')
})

test('a module path naming a file passes', () => {
  const found = problems({
    'features/a/presentation/views/v.tsx': '<Client key="cup" module="./teacup.tsx" />\n',
    'features/a/presentation/views/teacup.tsx': 'export const Cup = 1\n',
  })
  assert.deepEqual(found, [])
})

test('hooks/flow.ts on the legacy list passes; once LEGACY is empty it is reported', () => {
  const files = { 'flow.ts': 'export const y = 1\n' }
  assert.deepEqual(problems(files, { legacy: ['flow.ts'] }), [])
  reports(files, 'flow.ts')
})

test('multi-line imports are read', () => {
  reports(
    {
      'features/a/domain/usecases/x.ts': "import {\n  y,\n  z,\n} from '../../data/repositories/y_impl'\n",
      'features/a/data/repositories/y_impl.ts': 'export const y = 1\nexport const z = 1\n',
    },
    'y_impl',
  )
})
