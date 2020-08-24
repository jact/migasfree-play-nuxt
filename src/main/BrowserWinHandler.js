import { EventEmitter } from 'events'
import { BrowserWindow, app/*, ipcMain*/ } from 'electron'
import {spawn} from 'child_process'

const tcpPortUsed = require('tcp-port-used')
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

console.log(`Electron: ${process.versions.electron}`) // debug

export default class BrowserWinHandler {
  /**
     * @param [options] {object} - browser window options
     * @param [allowRecreate] {boolean}
     */
  constructor (options, allowRecreate = true) {
    this._eventEmitter = new EventEmitter()
    this.allowRecreate = allowRecreate
    this.options = options
    this.browserWindow = null
    this._createInstance()
  }

  _createInstance () {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
      this._create()
    })

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (!this.allowRecreate) return
    app.on('activate', () => this._recreate())
  }

  _create () {
    this.browserWindow = new BrowserWindow(
      {
        ...this.options,
        webPreferences: {
          ...this.options.webPreferences,
          webSecurity: isProduction, // disable on dev to allow loading local resources
          enableRemoteModule: true,
          nodeIntegration: true, // allow loading modules via the require () function
          devTools: !process.env.SPECTRON // disable on e2e test environment
        }
      }
    )
    this.browserWindow.on('closed', () => {
      // Dereference the window object
      this.browserWindow = null
    })
    this._eventEmitter.emit('created')
  }

  _recreate () {
    if (this.browserWindow === null) this._create()
  }

  /**
     * @callback onReadyCallback
     * @param {BrowserWindow}
     */

  /**
     *
     * @param callback {onReadyCallback}
     */
  onCreated (callback) {
    this._eventEmitter.once('created', () => {
      callback(this.browserWindow)
    })
  }

  /**
     *
     * @returns {Promise<BrowserWindow>}
     */
  created () {
    return new Promise(resolve => {
      this._eventEmitter.once('created', () => {
        resolve(this.browserWindow)
      })
    })
  }
}

//ipcMain.on('start', (event) => {
  tcpPortUsed.check(3000, '127.0.0.1')
  .then(function(inUse) {
    console.log('Port 3000 usage: ' + inUse) // debug
    if (!inUse) {
      const expressApi = isProduction
        ? path.join(__dirname, 'api.js')
        : path.join(__dirname, '..', 'renderer', 'api')
      // Instantiate Express App
      console.log('instantiating express app...!!!') // debug
      const expressProcess = spawn('node', [expressApi], {detached: false})
      //event.sender.send('started')

      expressProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })

      expressProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })
    }
  }, function(err) {
    console.error('Error on check:', err.message)
  })
//})
