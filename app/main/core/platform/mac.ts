import type { BrowserWindowConstructorOptions } from 'electron'

// Everything that differs between the Mac and Windows lives under platform/.
// Windows gets a file beside this one, with the same exports.
export const windowChrome: BrowserWindowConstructorOptions = {
  titleBarStyle: 'hiddenInset',
  trafficLightPosition: { x: 20, y: 18 },
}
