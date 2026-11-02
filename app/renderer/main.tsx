import '@fontsource/marcellus/400.css'
import '@fontsource/nunito-sans/400.css'
import '@fontsource/nunito-sans/600.css'
import '@fontsource/nunito-sans/700.css'
import '@fontsource/nunito-sans/800.css'
import './core/theme/jade_peaks.css'
import './core/theme/app.css'

import { render } from 'preact'

import { App } from './app/app'
import { createWorkspace } from './features/workspace/state_management/workspace_store'

// Whatever slips through is logged, so nothing fails silently.
window.addEventListener('error', event => window.engine.log('error', `window error: ${event.message}`))
window.addEventListener('unhandledrejection', event => window.engine.log('error', `window rejection: ${String(event.reason)}`))

const workspace = createWorkspace(window.engine)
render(<App workspace={workspace} />, document.getElementById('root')!)
workspace.start().catch(err => window.engine.log('error', `starting failed: ${String(err)}`))
