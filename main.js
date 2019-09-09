/*
 **  Nuxt
 */
const http = require('http')
const { Nuxt, Builder } = require('nuxt')
let config = require('./nuxt.config.js')
config.rootDir = __dirname // for electron-builder
// Init Nuxt.js
const nuxt = new Nuxt(config)
const builder = new Builder(nuxt)
const server = http.createServer(nuxt.render)
// Build only in dev mode
if (config.dev) {
  builder.build().catch(err => {
    console.error(err) // eslint-disable-line no-console
    process.exit(1)
  })
}
// Listen the server
server.listen()
const _NUXT_URL_ = `http://localhost:${server.address().port}/apps`
console.log(`Nuxt working on ${_NUXT_URL_}`)

// Instantiate Express App
const internalApi = require(__dirname + '/api/index')

const openExternalLinksInOSBrowser = (event, url) => {
  if (
    url.match(/.*localhost.*/gi) === null &&
    (url.startsWith('http:') || url.startsWith('https:'))
  ) {
    event.preventDefault()
    const open = require('open')
    open(url)
  }
}

/*
 ** Electron
 */
let win = null // Current window
const electron = require('electron')
const path = require('path')
const app = electron.app
const newWin = () => {
  win = new electron.BrowserWindow({
    icon: path.join(__dirname, 'static/img/migasfree-play.png'),
    width: 800,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  electron.Menu.setApplicationMenu(null)
  win.on('closed', () => (win = null))

  win.on('ready-to-show', function() {
    if (process.argv[1] === 'sync') {
      win.minimize()
    } else {
      win.show()
      win.focus()
    }
  })

  win.webContents.on('new-window', openExternalLinksInOSBrowser)
  win.webContents.on('will-navigate', openExternalLinksInOSBrowser)

  if (config.dev) {
    // Install vue dev tool and open chrome dev tools
    const {
      default: installExtension,
      VUEJS_DEVTOOLS
    } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS.id)
      .then(name => {
        console.log(`Added Extension:  ${name}`)
        win.webContents.openDevTools()
      })
      .catch(err => console.log('An error occurred: ', err))
    // Wait for nuxt to build
    const pollServer = () => {
      http
        .get(_NUXT_URL_, res => {
          if (res.statusCode === 200) {
            win.loadURL(_NUXT_URL_)
          } else {
            setTimeout(pollServer, 300)
          }
        })
        .on('error', pollServer)
    }
    pollServer()
  } else {
    return win.loadURL(_NUXT_URL_)
  }
}
app.on('ready', newWin)
app.on('window-all-closed', () => app.quit())
app.on('activate', () => win === null && newWin())
