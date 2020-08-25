/* globals INCLUDE_RESOURCES_PATH */
import { Menu, app } from 'electron'
import {spawn} from 'child_process'

const tcpPortUsed = require('tcp-port-used')
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'
let expressProcess = undefined

tcpPortUsed.check(3000, '127.0.0.1')
.then(function(inUse) {
  console.log('Port 3000 usage: ' + inUse) // debug
  if (!inUse) {
    const expressApi = isProduction
      ? path.join(__dirname, 'api.js')
      : path.join(__dirname, '..', 'renderer', 'api')
    // Instantiate Express App
    console.log('instantiating express app...!!!') // debug
    expressProcess = spawn('node', [expressApi], {detached: false})
    console.log('inside tcpPortUsed, express PID', expressProcess.pid) // debug

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

/**
 * Set `__resources` path to resources files in renderer process
 */
global.__resources = undefined // eslint-disable-line no-underscore-dangle
// noinspection BadExpressionStatementJS
INCLUDE_RESOURCES_PATH // eslint-disable-line no-unused-expressions
if (__resources === undefined) console.error('[Main-process]: Resources path is undefined') // eslint-disable-line no-undef

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    if (expressProcess !== undefined && expressProcess.pid !== undefined)
      process.kill(expressProcess.pid, 'SIGTERM')
    app.quit()
  }
})

app.on('ready', () => {
  Menu.setApplicationMenu(null)
})

// Load here all startup windows
require('./mainWindow')
