import { tokenAuth, publicApi, tokenApi, internalApi } from './settings'

const state = () => ({
  protocol: 'http', // FIXME
  host: 'localhost:1234', // FIXME '' by default
  initialUrl: {
    baseDomain: '',
    public: '',
    token: ''
  },
  tokenValue: '',
  serverVersion: '',
  apps: [],
  user: {
    isPrivileged: false
  }
})

const actions = {
  async nuxtServerInit(vuexContext) {
    await vuexContext.dispatch('preferences/readPreferences')

    vuexContext.commit('setInitialUrl')

    await vuexContext.dispatch('computer/computerInfo')
    await vuexContext.dispatch('computer/computerNetwork')
    await vuexContext.dispatch('computer/moreComputerInfo')

    await vuexContext.dispatch('packages/setAvailablePackages')
    await vuexContext.dispatch('serverInfo')
    await vuexContext.dispatch('getToken')

    const headers = {
      Authorization: vuexContext.state.tokenValue
    }
    await new Promise((resolve, reject) => {
      vuexContext.dispatch('getAllResults', {
        url: `${vuexContext.state.initialUrl.token}${tokenApi.apps}${vuexContext.state.computer.cid}`,
        headers,
        results: [],
        mutation: 'setApps',
        resolve,
        reject
      })
    })

    await vuexContext.dispatch('computer/computerData')
    await vuexContext.dispatch('computer/computerAttribute')
    await vuexContext.dispatch('packages/setInstalledPackages')
    await vuexContext.dispatch('filters/setCategories')
    await vuexContext.dispatch('executions/getExecutions')

    await vuexContext.dispatch('devices/computerDevices')
    await new Promise((resolve, reject) => {
      vuexContext.dispatch('getAllResults', {
        url: `${vuexContext.state.initialUrl.token}${tokenApi.availableDevices}${vuexContext.state.computer.cid}`,
        headers,
        results: [],
        mutation: 'devices/setAvailableDevices',
        resolve,
        reject
      })
    })
    // await vuexContext.dispatch('devices/getFeaturesDevices') // why is not working in Device component?
  },
  async serverInfo(vuexContext) {
    await this.$axios
      .$post(`${vuexContext.state.initialUrl.public}${publicApi.serverInfo}`)
      .then(data => {
        vuexContext.commit('setServerVersion', data.version)
      })
  },
  async getToken(vuexContext) {
    let response = await this.$axios.$get(`${internalApi}/token`)
    if (!response.token) {
      response = await this.$axios.$post(
        `${vuexContext.state.protocol}://${vuexContext.state.host}${tokenAuth.url}`,
        {
          username: tokenAuth.user,
          password: tokenAuth.password
        }
      )
      if (response.token) {
        await this.$axios.$post(`${internalApi}/token`, response)
      }
    }

    vuexContext.commit('setToken', response.token)
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
  async checkUser(vuexContext, { user, password }) {
    let response = await this.$axios.$post(`${internalApi}/user/check`, {
      user,
      password
    })
    if (response.is_privileged) {
      vuexContext.commit('privilegedUser')
    }
  }
}

const getters = {
  getAppsPackages(state) {
    let packages = []

    state.apps.forEach(value => {
      if (value.packages_to_install.length > 0) {
        packages = packages.concat(value.packages_to_install)
      }
    })

    return packages
  }
}

const mutations = {
  setInitialUrl(state) {
    state.initialUrl.baseDomain = `${state.protocol}://${state.host}`
    state.initialUrl.public = `${state.initialUrl.baseDomain}${publicApi.prefix}`
    state.initialUrl.token = `${state.initialUrl.baseDomain}${tokenApi.prefix}`
  },
  setToken(state, value) {
    state.tokenValue = `Token ${value}`
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
  privilegedUser(state) {
    state.user.isPrivileged = true
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
