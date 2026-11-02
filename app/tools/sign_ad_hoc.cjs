// Signs the built app ad hoc, after it's packed. An Apple Silicon Mac won't run
// an unsigned app, and this build tool's own ad hoc option doesn't reach it.
const { execFileSync } = require('node:child_process')
const { join } = require('node:path')

exports.default = async context => {
  const app = join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', app], { stdio: 'inherit' })
}
