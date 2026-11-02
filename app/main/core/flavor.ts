export type Flavor = 'dev' | 'stage' | 'prod'

// The flavor is set once at start-up and read everywhere from here.
export const flavorOf = (value: string | undefined, isPackaged: boolean): Flavor =>
  value === 'dev' || value === 'stage' || value === 'prod' ? value : isPackaged ? 'prod' : 'dev'

// Each flavor has its own id and settings, so they install side by side.
export const appIdOf = (flavor: Flavor): string =>
  flavor === 'prod' ? 'dev.queue-tea.app' : `dev.queue-tea.app.${flavor}`
