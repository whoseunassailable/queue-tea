// Cuts a text to `width` cells with an ellipsis.
export const cut = (text: string, width: number): string => {
  const chars = [...text]
  if (width <= 0) return ''

  return chars.length <= width ? text : `${chars.slice(0, Math.max(0, width - 1)).join('')}…`
}
