import Vue from 'vue'
import { internalApi, executionsMaxLength } from './settings'
const dateFormat = require('dateformat')

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function replaceAll(str, find, replace) {
  var exp = escapeRegExp(find)
  var re = new RegExp(exp, 'g')

  return str.replace(re, replace)
}

function replaceColors(txt) {
  txt = replaceAll(txt, '\u001b[92m', "<span class='ui green text'>") // ok
  txt = replaceAll(txt, '\u001b[93m', "<span class='ui yellow text'>") // warning
  txt = replaceAll(txt, '\u001b[91m', "<span class='ui red text'>") // error
  txt = replaceAll(txt, '\u001b[32m', "<span class='ui blue text'>") // info
  txt = replaceAll(txt, '\u001b[0m', '</span>')
  txt = txt.replace(/(?:\r\n|\r|\n)/g, '<br />')

  return txt
}

const state = () => ({
  log: {},
  lastId: '',
  isRunningCommand: false,
  error: ''
})

const actions = {
  async getExecutions(vuexContext) {
    await this.$axios.$get(`${internalApi}/executions`).then(data => {
      vuexContext.commit('setExecutionsLog', data)
    })
  },
  async setExecutions(vuexContext) {
    await this.$axios.$post(`${internalApi}/executions`, vuexContext.state.log)
  },
  run(vuexContext, { cmd, text, element = null }) {
    if (vuexContext.state.isRunningCommand) {
      this.$toast.info('please wait, other process is running!!!')
      return
    }
    this.commit('executions/startedCmd')

    const os = require('os')
    const spawn = require('child_process').spawn
    let process

    if (os.type() === 'Linux') {
      process = spawn('bash', ['-c', cmd])
    } else if (os.type() === 'Window_NT') {
      process = spawn('cmd', ['/C', cmd])
    }

    this.commit('executions/addExecution', text)

    process.stdout.on('data', data => {
      this.commit(
        'executions/appendExecutionText',
        replaceColors(data.toString())
      )
    })

    process.stderr.on('data', data => {
      this.commit('executions/appendExecutionError', data.toString())
      this.commit(
        'executions/appendExecutionText',
        "<span class='ui negative text'>" + data.toString() + '</span>'
      )
    })

    // when the spawn child process exits, check if there were any errors
    process.on('exit', code => {
      const { remote } = require('electron')
      const win = remote.getCurrentWindow()

      if (element) element.disabled = false

      if (code !== 0) {
        this.$toast.error(`Error: ${code} ${cmd}`)
        win.show()
      } else {
        if (vuexContext.state.error === '') {
          vuexContext.dispatch('packages/setInstalledPackages', null, {
            root: true
          })

          if (cmd.includes('sync') && win.isMinimized()) {
            win.close()
          }
        } else {
          this.$toast.error(replaceColors(vuexContext.state.error))
          vuexContext.commit('executions/resetExecutionError', null, {
            root: true
          })
        }
      }

      if (cmd.includes('sync')) {
        vuexContext.dispatch('packages/setAvailablePackages', null, {
          root: true
        })
      }

      this.dispatch('executions/setExecutions')
      this.commit('executions/finishedCmd')
    })
  }
}

const mutations = {
  setExecutionsLog(state, value) {
    state.log = value
    if (Object.keys(value).length)
      state.lastId = Object.keys(value)[Object.keys(value).length - 1]
  },
  startedCmd(state) {
    state.isRunningCommand = true
  },
  finishedCmd(state) {
    state.isRunningCommand = false
  },
  addExecution(state, command) {
    state.lastId = dateFormat(new Date(), 'isoDateTime')
    Vue.set(state.log, state.lastId, {
      command,
      text: ''
    })
    while (Object.keys(state.log).length > executionsMaxLength)
      delete state.log[Object.keys(state.log)[0]]
  },
  appendExecutionText(state, text) {
    state.log[state.lastId]['text'] += text
  },
  appendExecutionError(state, text) {
    state.error += text
  },
  resetExecutionError(state) {
    state.error = ''
  }
}

export default {
  state,
  actions,
  mutations
}
