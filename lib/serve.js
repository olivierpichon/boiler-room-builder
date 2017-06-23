const build = require('./build')
const buildIfNecessary = require('./build/build-if-necessary')

const PROD = process.env.NODE_ENV === 'production'

const prodServer = require('./prod-server')
const devServer = require('./dev-server')

module.exports = ({
  port,
  serverConfig = {},
  clientConfig = {},
  devConfig = {},
  outputDir,
  basePath
}) => {
  if (PROD) {
    buildIfNecessary({ serverConfig, clientConfig, outputDir }, ({ assets, app }) => {
      const init = app.init || app.default || app

      Promise.resolve({ assets }).then(init).then((runner) => {
        prodServer({
          port,
          staticDir: outputDir,
          runner,
          basePath
        })
      })
    })
  } else {
    build({ serverConfig }, ({ app }) => {
      devServer({
        app,
        port,
        clientConfig,
        devConfig,
        contentBase: outputDir
      })
    })
  }
}
