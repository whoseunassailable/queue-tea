import type { EngineApi } from '../shared/engine_api'

declare global {
  interface Window {
    engine: EngineApi
  }
}
