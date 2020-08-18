const path = require('path')

const PROJECT_ROOT = path.join(__dirname, '..')
const SRC_DIR = path.join(PROJECT_ROOT, 'src')

const config = {
  ELECTRON_RELAUNCH_CODE: 250, // valid range in unix system: <1,255>
  ELECTRON_INSPECTION_PORT: 8315,
  SERVER_PORT: 9999,
  SERVER_HOST: 'http://localhost',

  /*
  * add NUXT_SSR_MODE enable switch SSR and SPA, default is SPA and nothing change
  * SSR mode:
  *     1. nuxt build instead of nuxt generate on run build, but not change dist folder
  *     2. electron build do not include dist of nuxt generate
  *     3. browserWindow.loadURL(`${SERVER_HOST_PRODUCTION}:${SERVER_PORT_PRODUCTION}`)
  *        instead of browserWindow.loadFile(INDEX_PATH) on Electron production mode
  */
  NUXT_SSR_MODE: false, // true for SSR mode
  SERVER_PORT_PRODUCTION: 9999,
  SERVER_HOST_PRODUCTION: 'http://localhost',

  PROJECT_ROOT,
  SRC_DIR,
  MAIN_PROCESS_DIR: path.join(SRC_DIR, 'main'),
  RENDERER_PROCESS_DIR: path.join(SRC_DIR, 'renderer'),
  RESOURCES_DIR: path.join(SRC_DIR, 'resources'),
  DIST_DIR: path.join(PROJECT_ROOT, 'dist'),
  BUILD_DIR: path.join(PROJECT_ROOT, 'build'),

  DISABLE_BABEL_LOADER: false // experimental
}

module.exports = Object.freeze(config)
