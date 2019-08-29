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

const executionsMaxLength = 5

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
        computer: '/computers/',
        availableDevices: '/devices/devices/available/?cid=',
        logicalDevice: '/devices/logical/available/?cid='
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
      filters: {
        searchApp: null,
        onlyInstalledApps: false,
        searchDevice: null,
        onlyAssignedDevices: false
      },
      apps: [],
      categories: [],
      selectedCategory: null,
      executions: {
        log: {},
        lastId: '',
        isRunningCommand: false,
        error: ''
      },
      preferences: {
        language: 'es',
        showSyncDetails: false,
        showApps: true,
        showDevices: true,
        showDetails: true,
        showPreferences: true,
        showInfo: true,
        showHelp: true
      },
      user: {
        isPrivileged: false
      },
      devices: {
        assigned: [],
        inflicted: [],
        default: 0,
        available: []
      }
    }),
    actions: {
      async nuxtServerInit(vuexContext) {
        await vuexContext.dispatch('readPreferences')

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
            mutation: 'setApps',
            resolve,
            reject
          })
        })

        await vuexContext.dispatch('computerData')
        await vuexContext.dispatch('setInstalledPackages')
        await vuexContext.dispatch('setCategories')
        await vuexContext.dispatch('getExecutions')

        await vuexContext.dispatch('computerDevices')
        await new Promise((resolve, reject) => {
          vuexContext.dispatch('getAllResults', {
            url: `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.availableDevices}${vuexContext.state.computer.cid}`,
            headers,
            results: [],
            mutation: 'setAvailableDevices',
            resolve,
            reject
          })
        })
        await vuexContext.dispatch('getFeaturesDevices')
      },
      async readPreferences(vuexContext) {
        let response = await this.$axios.$get(
          `${vuexContext.state.internalApi}/preferences`
        )
        vuexContext.commit('setPreferences', response)
      },
      savePreferences(vuexContext) {
        this.$axios.$post(`${vuexContext.state.internalApi}/preferences`, {
          language: vuexContext.state.preferences.language,
          show_sync_details: vuexContext.state.preferences.showSyncDetails,
          show_apps: vuexContext.state.preferences.showApps,
          show_devices: vuexContext.state.preferences.showDevices,
          show_details: vuexContext.state.preferences.showDetails,
          show_preferences: vuexContext.state.preferences.showPreferences,
          show_info: vuexContext.state.preferences.showInfo,
          show_help: vuexContext.state.preferences.showHelp
        })
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
      async computerDevices(vuexContext) {
        let response = await this.$axios
          .$get(
            `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.computer}${vuexContext.state.computer.cid}/devices/`,
            { headers: { Authorization: vuexContext.state.tokenAuth.value } }
          )
          .catch(error => {
            console.log(error) // TODO
          })
        vuexContext.commit('setComputerDevices', response)
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
        { url, results, headers, mutation, resolve, reject }
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
                mutation,
                resolve,
                reject
              })
            } else {
              vuexContext.commit(mutation, retrivedResults)
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
      async getFeaturesDevices(vuexContext) {
        vuexContext.state.devices.available.forEach((item, index) => {
          vuexContext.dispatch('getLogicalDevice', { id: item.id, index })
        })
      },
      async getLogicalDevice(vuexContext, { id, index }) {
        let response = await this.$axios
          .$get(
            `${vuexContext.state.initialUrl.token}${vuexContext.state.tokenApi.logicalDevice}${vuexContext.state.computer.cid}&did=${id}`,
            { headers: { Authorization: vuexContext.state.tokenAuth.value } }
          )
          .catch(error => {
            console.log(error) // TODO
          })

        if (response.results) {
          let payload = {}
          payload.results = response.results
          payload.index = index
          vuexContext.commit('addLogicalDevices', payload)
        }
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
          const { remote } = require('electron')
          const win = remote.getCurrentWindow()

          if (element) element.disabled = false

          if (code !== 0) {
            this.$toast.error(`Error: ${code} ${cmd}`)
            win.show()
          } else {
            if (vuexContext.state.executions.error === '') {
              vuexContext.dispatch('setInstalledPackages')

              /*if (id == 'sync' && document.hidden) { // FAB
                // sync ok & minimized -> exit
                win.close()
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
      },
      async checkUser(vuexContext, { user, password }) {
        let response = await this.$axios.$post(
          `${vuexContext.state.internalApi}/user/check`,
          { user, password }
        )
        if (response.is_privileged) {
          vuexContext.commit('privilegedUser')
        }
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
      setPreferences(state, value) {
        state.preferences.language = value.language
        state.preferences.showSyncDetails = value.show_sync_details
        state.preferences.showApps = value.show_apps
        state.preferences.showDevices = value.show_devices
        state.preferences.showDetails = value.show_sync_details
        state.preferences.showPreferences = value.show_preferences
        state.preferences.showInfo = value.show_info
        state.preferences.showHelp = value.show_help
      },
      setLanguage(state, value) {
        state.preferences.language = value
      },
      setShowSyncDetails(state, value) {
        state.preferences.showSyncDetails = value
      },
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
      setComputerDevices(state, value) {
        state.devices.default = value.default_logical_device
        state.devices.assigned = value.assigned_logical_devices_to_cid
        state.devices.inflicted = value.inflicted_logical_devices
      },
      setServerVersion(state, value) {
        state.serverVersion = value
      },
      setApps(state, value) {
        state.apps = []
        value.forEach(item => {
          let filterPackages = item.packages_by_project.filter(
            packages => state.computer.project === packages.project.name
          )
          if (filterPackages.length > 0) {
            item.packages_to_install = filterPackages[0].packages_to_install
            state.apps.push(item)
          }
        })
      },
      setAvailableDevices(state, value) {
        state.devices.available = value
      },
      addLogicalDevices(state, value) {
        state.devices.available[value.index].logical = value.results
        console.log(state.devices.available[value.index])
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
        state.filters.searchApp = value
      },
      setOnlyInstalledApps(state, value) {
        state.filters.onlyInstalledApps = value
      },
      setSearchDevice(state, value) {
        state.filters.searchDevice = value
      },
      setOnlyAssignedDevices(state, value) {
        state.filters.onlyAssignedDevices = value
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
        state.executions.lastId = dateFormat(new Date(), 'isoDateTime')
        Vue.set(state.executions.log, state.executions.lastId, {
          command,
          text: ''
        })
        while (Object.keys(state.executions.log).length > executionsMaxLength)
          delete state.executions.log[Object.keys(state.executions.log)[0]]
      },
      appendExecutionText(state, text) {
        state.executions.log[state.executions.lastId]['text'] += text
      },
      appendExecutionError(state, text) {
        state.executions.error += text
      },
      privilegedUser(state) {
        state.user.isPrivileged = true
      }
    }
  })
}

export default createStore
