import Vue from 'vue'
import Vuex from 'vuex'
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

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      protocol: 'http', // FIXME
      host: 'localhost:1234', // FIXME '' by default
      tokenAuth: {
        url: '/token-auth/',
        user: 'migasfree-play',
        password: 'migasfree-play',
        value: ''
      },
      publicApi: {
        prefix: '/api/v1/public',
        serverInfo: '/server/info/',
        computerInfo: '/get_computer_info/?uuid='
      },
      tokenApi: {
        prefix: '/api/v1/token',
        apps: '/catalog/apps/available/?cid=',
        categories: '/catalog/apps/categories/',
        computer: '/computers/'
      },
      internalApi: 'http://localhost:3000',
      initialUrl: {
        baseDomain: '',
        public: '',
        token: ''
      },
      computer: {
        name: '',
        uuid: 'E0A6D7DE-8CEE-11E6-9C43-BC00002E0000', //'', // FIXME empty by default
        cid: 4609, // FIXME 0 by default
        project: '',
        user: '',
        link: '',
        mask: '',
        network: '',
        helpdesk: '',
        data: {}
      },
      serverVersion: '',
      packages: {
        available: [],
        installed: []
      },
      selectedCategory: null,
      searchApp: null,
      onlyInstalledApps: false,
      apps: [],
      categories: [],
      executions: {
        log: {},
        lastId: '',
        isRunningCommand: false,
        error: ''
      }
    }),
    actions: {
      async nuxtServerInit(vuexContext, context) {
        vuexContext.commit('setInitialUrl')

        await vuexContext.dispatch('computerInfo')
        await vuexContext.dispatch('computerNetwork')
        await vuexContext.dispatch('moreComputerInfo')
        await vuexContext.dispatch('setAvailablePackages')
        await vuexContext.dispatch('serverInfo')

        await vuexContext.dispatch('getToken')

        const headers = {
          Authorization: vuexContext.state.tokenAuth.value
        }
        await new Promise((resolve, reject) => {
          vuexContext.dispatch('getAllResults', {
            url: `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.apps}${vuexContext.state.computer.cid}`,
            headers,
            results: [],
            resolve,
            reject
          })
        })

        await vuexContext.dispatch('computerData')
        await vuexContext.dispatch('setInstalledPackages')
        await vuexContext.dispatch('setCategories')
        await vuexContext.dispatch('getExecutions')
      },
      async computerInfo(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/preferences/server`
        )
        vuexContext.commit('setComputerInfo', response)
      },
      async computerNetwork(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/computer/network`
        )
        vuexContext.commit('setComputerNetwork', response)
      },
      async moreComputerInfo(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.initialUrl.baseDomain}${vuexContext.state.publicApi.computerInfo}${vuexContext.state.computer.uuid}`
        )
        vuexContext.commit('setMoreComputerInfo', response)
      },
      async computerData(vuexContext) {
        let response = await this.$axios
          .$get(
            `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.computer}${vuexContext.state.computer.cid}/`,
            { headers: { Authorization: vuexContext.state.tokenAuth.value } }
          )
          .catch(error => {
            console.log(error) // TODO
          })
        vuexContext.commit('setComputerData', response)
      },
      async serverInfo(vuexContext) {
        let response = await this.$axios.$post(
          `${vuexContext.state.initialUrl.public}${vuexContext.state.publicApi.serverInfo}`
        )
        vuexContext.commit('setServerVersion', response.version)
      },
      async getToken(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/token`
        )
        if (!response.token) {
          response = await this.$axios.$post(
            `${vuexContext.state.protocol}://${vuexContext.state.host}${vuexContext.state.tokenAuth.url}`,
            {
              username: vuexContext.state.tokenAuth.user,
              password: vuexContext.state.tokenAuth.password
            }
          )
          if (response.token) {
            await this.$axios.$post(
              `${vuexContext.state.internalApi}/token`,
              response
            )
          }
        }

        vuexContext.commit('setToken', response.token)
      },
      async setAvailablePackages(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/packages/available`
        )
        vuexContext.commit('setAvailablePackages', response)
      },
      async setInstalledPackages(vuexContext) {
        let response = await this.$axios.$post(
          `${vuexContext.state.internalApi}/packages/installed`,
          vuexContext.getters.getAppsPackages
        )
        vuexContext.commit('setInstalledPackages', response)
      },
      async getAllResults(
        vuexContext,
        { url, results, headers, resolve, reject }
      ) {
        await this.$axios
          .$get(url, { headers })
          .then(response => {
            const retrivedResults = results.concat(response.results)
            if (response.next !== null) {
              vuexContext.dispatch('getAllResults', {
                url: response.next,
                results: retrivedResults,
                headers,
                resolve,
                reject
              })
            } else {
              vuexContext.commit('setApps', retrivedResults)
              resolve(retrivedResults)
            }
          })
          .catch(error => {
            console.log(error)
            reject('Something wrong. Please refresh the page and try again.')
          })
      },
      async setCategories(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.categories}`,
          { headers: { Authorization: vuexContext.state.tokenAuth.value } }
        )
        vuexContext.commit('setCategories', response)
      },
      async getExecutions(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/executions`
        )
        vuexContext.commit('setExecutionsLog', response)
      },
      async setExecutions(vuexContext) {
        await this.$axios.$post(
          `${vuexContext.state.internalApi}/executions`,
          vuexContext.state.executions.log
        )
      },
      run(vuexContext, { cmd, text, element = null }) {
        if (vuexContext.state.executions.isRunningCommand) {
          this.$toast.info('please wait, other process is running!!!')
          return
        }
        this.commit('startedCmd')

        const os = require('os')
        const spawn = require('child_process').spawn
        let process

        if (os.type() === 'Linux') {
          process = spawn('bash', ['-c', cmd])
        } else if (os.type() === 'Window_NT') {
          process = spawn('cmd', ['/C', cmd])
        }

        this.commit('addExecution', text)

        /*$('#console').append(renderRun(global.run_idx))
      $(
        '#console > li:nth-child(' + global.idx + ') > div.collapsible-header'
      ).click()*/

        process.stdout.on('data', data => {
          this.commit('appendExecutionText', replaceColors(data.toString()))
        })

        process.stderr.on('data', data => {
          this.commit('appendExecutionError', data.toString())
          this.commit(
            'appendExecutionText',
            "<span class='ui negative text'>" + data.toString() + '</span>'
          )
        })

        // when the spawn child process exits, check if there were any errors
        process.on('exit', code => {
          if (element) element.disabled = false

          if (code !== 0) {
            // Syntax error
            this.$toast.error(`Error: ${code} ${cmd}`)
            // win.show() // FIXME
          } else {
            if (vuexContext.state.executions.error === '') {
              vuexContext.dispatch('setInstalledPackages')

              /*if (id == 'sync' && document.hidden) { // FAB
              // sync ok & minimized -> exit
              exit()
            }*/ // FIXME
            } else {
              this.$toast.error(
                replaceColors(vuexContext.state.executions.error)
              )
              vuexContext.state.executions.error = ''
            }
          }

          if (cmd.includes('sync')) {
            vuexContext.dispatch('setAvailablePackages')
          }

          this.dispatch('setExecutions')
          this.commit('finishedCmd')
        })
      }
    },
    getters: {
      getCategories(state) {
        return state.categories
      },
      getAppsPackages(state) {
        let packages = []
        state.apps.forEach(function(value, index, array) {
          if (value.packages_to_install.length > 0) {
            packages = packages.concat(value.packages_to_install)
          }
        })
        return packages
      }
    },
    mutations: {
      setInitialUrl(state) {
        state.initialUrl.baseDomain = `${state.protocol}://${state.host}`
        state.initialUrl.public = `${state.initialUrl.baseDomain}${state.publicApi.prefix}`
        state.initialUrl.token = `${state.initialUrl.baseDomain}${state.tokenApi.prefix}`
      },
      setToken(state, value) {
        state.tokenAuth.value = `Token ${value}`
      },
      setComputerInfo(state, value) {
        state.computer.uuid = value.uuid
        state.computer.name = value.computer_name
        state.computer.user = value.user
        state.computer.project = 'AZL-16' // value.project // FIXME
        // state.host = value.server // TODO
        state.computer.link = `${state.protocol}://${state.host}/admin/server/computer/`
      },
      setMoreComputerInfo(state, value) {
        // state.computer.cid = value.id // FIXME
        state.computer.name = value.search
        state.computer.link += state.computer.cid + '/'
        state.computer.helpdesk = value.helpdesk
        // FIXME more data
      },
      setComputerData(state, value) {
        state.computer.data = value
      },
      setComputerNetwork(state, value) {
        state.computer.mask = value.mask
        state.computer.network = value.network
      },
      setServerVersion(state, value) {
        state.serverVersion = value
      },
      setApps(state, value) {
        state.apps = []
        value.forEach(function(item, index, array) {
          let filterPackages = item.packages_by_project.filter(
            packages => state.computer.project === packages.project.name
          )
          if (filterPackages.length > 0) {
            item.packages_to_install = filterPackages[0].packages_to_install
            state.apps.push(item)
          }
        })
      },
      setCategories(state, value) {
        state.categories = value
        state.categories[0] = 'All'
      },
      setAvailablePackages(state, value) {
        state.packages.available = value
      },
      setInstalledPackages(state, value) {
        state.packages.installed = value
      },
      setSelectedCategory(state, value) {
        state.selectedCategory = value
      },
      setSearchApp(state, value) {
        state.searchApp = value
      },
      setOnlyInstalledApps(state, value) {
        state.onlyInstalledApps = value
      },
      setExecutionsLog(state, value) {
        state.executions.log = value
        if (Object.keys(value).length)
          state.executions.lastId = Object.keys(value)[
            Object.keys(value).length - 1
          ]
      },
      startedCmd(state) {
        state.executions.isRunningCommand = true
      },
      finishedCmd(state) {
        state.executions.isRunningCommand = false
      },
      addExecution(state, command) {
        let now = new Date()
        state.executions.lastId = dateFormat(now, 'isoDateTime')
        Vue.set(state.executions.log, state.executions.lastId, {
          command,
          text: ''
        })
      },
      appendExecutionText(state, text) {
        state.executions.log[state.executions.lastId]['text'] += text
      },
      appendExecutionError(state, text) {
        state.executions.error += text
      }
    }
  })
}

export default createStore
