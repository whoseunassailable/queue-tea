import { HELPER_ORDER_CHARS } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'

// The order field's error, or undefined when the order can go.
export const orderError = (order: string): string | undefined => {
  const text = order.trim()
  if (text === '') return t.guild.orderRequired

  return text.length > HELPER_ORDER_CHARS ? t.guild.orderLong(HELPER_ORDER_CHARS) : undefined
}

export const folderName = (path: string): string => path.split('/').filter(Boolean).pop() ?? path
