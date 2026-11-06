import { describe, expect, it } from 'vitest'

import { HELPER_ORDER_CHARS } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'
import { folderName, orderError } from './order_form'

describe('the order box', () => {
  it('needs an order', () => {
    expect(orderError('')).toBe('Order is required.')
    expect(orderError('  \n ')).toBe(t.guild.orderRequired)
  })

  it('takes an order of exactly the longest length, spaces around it aside', () => {
    expect(orderError(`  ${'x'.repeat(HELPER_ORDER_CHARS)}\n`)).toBeUndefined()
  })

  it('refuses one character past the longest', () => {
    expect(orderError('x'.repeat(HELPER_ORDER_CHARS + 1))).toBe(t.guild.orderLong(HELPER_ORDER_CHARS))
  })
})

describe('where the helper works', () => {
  it('names the last folder of the path, even with a slash at the end', () => {
    expect(folderName('/Users/rohan/demo')).toBe('demo')
    expect(folderName('/Users/rohan/demo-wt/')).toBe('demo-wt')
    expect(folderName('/')).toBe('/')
  })
})
