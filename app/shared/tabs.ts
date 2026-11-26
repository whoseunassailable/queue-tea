// The screens on the toolbar, in the order they show. ⌘1 opens the first, ⌘2
// the second, and so on. The window's tabs, the command palette and the menu
// bar all number them from this one list, so they never disagree. Notes is
// fourth: it is used more often than the screens that look back.
export const TAB_ORDER = ['home', 'quests', 'designs', 'notes', 'branches', 'chronicle', 'mana', 'calendar'] as const

export type TabId = (typeof TAB_ORDER)[number]

// The shortcut digit for a tab: ⌘ and this.
export const tabKeyOf = (tab: TabId): string => String(TAB_ORDER.indexOf(tab) + 1)
