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
      host: 'localhost:1234', // FIXME
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
      computer: {
        name: '',
        uuid: 'B18268A8-8CD2-11E6-9C43-BC00002E0000', //'',
        cid: 4928, // FIXME 0 by default
        project: '',
        user: '',
        link: '',
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
        const baseDomain = `${vuexContext.state.protocol}://${vuexContext.state.host}`

        const computerInfo = await context.app.$axios.$get(
          `${vuexContext.state.internalApi}/preferences/server`
        )
        vuexContext.commit('setComputerInfo', computerInfo)

        const moreComputerInfo = await context.app.$axios.$get(
          `${baseDomain}${vuexContext.state.publicApi.computerInfo}${vuexContext.state.computer.uuid}`
        )
        vuexContext.commit('setMoreComputerInfo', moreComputerInfo)

        await vuexContext.dispatch('setAvailablePackages')

        const publicApi = `${baseDomain}${vuexContext.state.publicApi.prefix}`

        const serverInfo = await context.app.$axios.$post(
          `${publicApi}${vuexContext.state.publicApi.serverInfo}`
        )
        vuexContext.commit('setServerVersion', serverInfo.version)

        const tokenApi = `${baseDomain}${vuexContext.state.tokenApi.prefix}`
        await vuexContext.dispatch('getToken')
        const headers = {
          Authorization: vuexContext.state.tokenAuth.value
        }

        await new Promise((resolve, reject) => {
          vuexContext.dispatch('getAllResults', {
            url: `${tokenApi}${vuexContext.state.tokenApi.apps}${vuexContext.state.computer.cid}`,
            headers,
            results: [],
            resolve,
            reject
          })
        })

        const computerData = await context.app.$axios
          .$get(
            `${tokenApi}${vuexContext.state.tokenApi.computer}${vuexContext.state.computer.cid}/`,
            { headers }
          )
          .catch(error => {
            console.log(error) // TODO
          })
        vuexContext.commit('setComputerData', computerData)

        await vuexContext.dispatch('setInstalledPackages')

        const categories = await context.app.$axios.$get(
          `${tokenApi}${vuexContext.state.tokenApi.categories}`,
          { headers }
        )
        vuexContext.commit('setCategories', categories)

        await vuexContext.dispatch('getExecutions')
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
            console.log('mirando available packages')
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
      setToken(state, value) {
        state.tokenAuth.value = `Token ${value}`
      },
      setComputerInfo(state, value) {
        state.computer.uuid = value.uuid
        state.computer.name = value.computer_name
        state.computer.user = value.user
        state.computer.project = 'AZL-16' // value.project // FIXME
        state.computer.link = `${state.protocol}`
        // state.host = value.server // TODO
        state.computer.link = `${state.protocol}://${state.host}/admin/server/computer/`
      },
      setMoreComputerInfo(state, value) {
        // state.computer.cid = value.id // FIXME
        state.computer.name = value.search
        state.computer.link += state.computer.cid + '/'
        // FIXME more data
      },
      setComputerData(state, value) {
        state.computer.data = value
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
        if (value.length) state.executions.lastId = value[value.length - 1].id
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
        state.executions.log[state.executions.lastId] = {
          command,
          text: ''
        }
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
