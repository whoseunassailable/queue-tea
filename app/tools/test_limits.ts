// How the app's tests share the machine. The update runs them in the
// background on Rohan's Mac while he works, so they keep to half the cores.

// Vitest takes a share of availableParallelism(): 4 workers on an 8-core Mac.
export const TEST_WORKERS = '50%'
// One test, and one setup or teardown hook. A hook that makes a real Git
// repository does as much as a test, so it gets as long.
export const TEST_TIMEOUT_MS = 30_000
export const TEST_HOOK_TIMEOUT_MS = 30_000
// A test that first writes thousands of real files.
export const BIG_FIXTURE_TIMEOUT_MS = 60_000
// A real type check of the app's settings on one file: tsc reads the engine
// code it imports, which takes tens of seconds on a busy laptop.
export const TYPE_CHECK_TIMEOUT_MS = 120_000
// Specs that time how fast something runs. They run once everything else has
// finished, so the budget measures the code and not the other tests.
export const BUDGET_SPECS = ['{main,renderer}/**/*_performance.spec.{ts,tsx}']
