import path from 'path'
import BrowserWinHandler from './BrowserWinHandler'

const isDev = process.env.NODE_ENV === 'development'

const INDEX_PATH = path.join(__dirname, '..', 'renderer', 'index.html')
const DEV_SERVER_URL = process.env.DEV_SERVER_URL // eslint-disable-line prefer-destructuring
const PRODUCTION_SERVER_URL = process.env.PRODUCTION_SERVER_URL
const NUXT_SSR_MODE = process.env.NUXT_SSR_MODE

const openExternalLinksInOSBrowser = (event, url) => {
  if (
    url.match(/.*localhost.*/gi) === null &&
    (url.startsWith('http:') || url.startsWith('https:'))
  ) {
    event.preventDefault()
    const open = require('open')
    console.log(url)
    open(url)
  }
}

const icon = isDev
  ? path.resolve(
    __dirname, '..',
    'renderer', 'static',
    'img', 'migasfree-play.png'
  )
  : path.resolve(
    __dirname, '..',
    'renderer',
    'img', 'migasfree-play.png'
  )

console.log(icon)
const winHandler = new BrowserWinHandler({
  icon,
  show: false,
  height: 800,
  width: 800
})

winHandler.onCreated(browserWindow => {
  if (isDev) {
    browserWindow.loadURL(DEV_SERVER_URL)
  } else if (NUXT_SSR_MODE) {
    browserWindow.loadURL(PRODUCTION_SERVER_URL)
  } else {
    browserWindow.loadFile(INDEX_PATH)
  }

  browserWindow.webContents.on('new-window', openExternalLinksInOSBrowser)
  browserWindow.webContents.on('will-navigate', openExternalLinksInOSBrowser)

  browserWindow.webContents.openDevTools({mode:'detach'})  // debug

  browserWindow.on('ready-to-show', function() {
    if (process.argv[1] === 'sync') {
      browserWindow.minimize()
    } else {
      browserWindow.show()
      browserWindow.focus()
    }
  })
})

export default winHandler
