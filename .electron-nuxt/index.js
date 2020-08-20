const path = require('path')
const webpack = require('webpack')
const electron = require('electron')

const { Pipeline, Logger } = require('@xpda-dev/core')
const { ElectronLauncher } = require('@xpda-dev/electron-launcher')
const { ElectronBuilder } = require('@xpda-dev/electron-builder')
const { Webpack } = require('@xpda-dev/webpack-step')
const resourcesPath = require('./resources-path-provider')
const { DIST_DIR, MAIN_PROCESS_DIR, RENDERER_PROCESS_DIR, SERVER_HOST, SERVER_PORT, SERVER_HOST_PRODUCTION, SERVER_PORT_PRODUCTION, NUXT_SSR_MODE } = require('./config')
const NuxtApp = require('./renderer/NuxtApp')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const launcher = new ElectronLauncher({
  electronPath: electron,
  electronOptions: ['--no-sandbox'],
  entryFile: path.join(DIST_DIR, 'main/app.js')
})

function hasConfigArgument (array) {
  for (const el of array) if (el === '--config' || el === '-c') return true
  return false
}
const argumentsArray = process.argv.slice(2)
if (!hasConfigArgument(argumentsArray)) argumentsArray.push('--config', 'builder.config.js')

const builder = new ElectronBuilder({
  processArgv: argumentsArray
})

const webpackConfig = Webpack.getBaseConfig({
  entry: {
    app: isDev
      ? path.join(MAIN_PROCESS_DIR, 'index.dev.js')
      : path.join(MAIN_PROCESS_DIR, 'index.js'),
    api: path.join(RENDERER_PROCESS_DIR, 'api', 'index.js')
  },
  output: {
    filename: '[name].js',
    path: path.join(DIST_DIR, 'main')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      INCLUDE_RESOURCES_PATH: resourcesPath.mainProcess(),
      'process.env.DEV_SERVER_URL': `'${SERVER_HOST}:${SERVER_PORT}'`,
      'process.env.NUXT_SSR_MODE': NUXT_SSR_MODE ,
      'process.env.PRODUCTION_SERVER_URL': `'${SERVER_HOST_PRODUCTION}:${SERVER_PORT_PRODUCTION}'`
    })
  ],
  devtool: 'source-map',
  target: 'electron-renderer'
})
// console.log('webpackConfig!!!', JSON.stringify(webpackConfig))

const webpackMain = new Webpack({
  logger: new Logger('Main', 'olive'),
  webpackConfig,
  launcher // need to restart launcher after compilation
})

const nuxt = new NuxtApp(new Logger('Nuxt', 'green'))

const pipe = new Pipeline({
  title: 'Electron-nuxt',
  isDevelopment: isDev,
  steps: [webpackMain, nuxt],
  launcher,
  builder
})

pipe.run()
