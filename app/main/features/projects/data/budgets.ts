// Time I have, per realm. Kept here rather than in the window because every edit
// hands back a fresh board, which must rank by it too. It's held in memory only
// and resets on quit, like the terminal's per-session value.
const budgets = new Map<string, number>()

export const budgetOf = (key: string): number | null => budgets.get(key) ?? null

export const setBudget = (key: string, budget: number | null): void => {
  if (budget === null) budgets.delete(key)
  else budgets.set(key, budget)
}
