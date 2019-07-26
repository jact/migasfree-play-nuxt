import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      protocol: 'http', // FIXME
      host: 'localhost:1234', // FIXME
      tokenAuth: {
        url: '/token-auth/',
        user: 'migasfree-play',
        password: 'migasfree-play'
      },
      publicApi: {
        prefix: '/api/v1/public',
        serverInfo: '/server/info/',
        computerInfo: '/get_computer_info/?uuid='
      },
      tokenApi: {
        prefix: '/api/v1/token',
        apps: '/catalog/apps/available/?cid=',
        categories: '/catalog/apps/categories/'
      },
      internalApi: 'http://localhost:3000/api',
      computer: {
        name: '',
        uuid: '',
        cid: 4928, // FIXME 0 by default
        project: '',
        user: '',
        link: ''
      },
      serverVersion: '',
      availablePackages: [],
      selectedCategory: null,
      searchApp: null,
      onlyInstalledApps: false,
      apps: [],
      categories: []
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

        const availablePackages = await context.app.$axios.$get(
          `${vuexContext.state.internalApi}/packages/available`
        )
        vuexContext.commit('setAvailablePackages', availablePackages)

        const publicApi = `${baseDomain}${vuexContext.state.publicApi.prefix}`

        const serverInfo = await context.app.$axios.$post(
          `${publicApi}${vuexContext.state.publicApi.serverInfo}`
        )
        vuexContext.commit('setServerVersion', serverInfo.version)

        const tokenApi = `${baseDomain}${vuexContext.state.tokenApi.prefix}`
        const headers = {
          Authorization: vuexContext.dispatch('getToken')
        }

        const apps = await context.app.$axios.$get(
          `${tokenApi}${vuexContext.state.tokenApi.apps}${vuexContext.state.computer.cid}`,
          headers
        )
        vuexContext.commit('setApps', apps.results)

        const categories = await context.app.$axios.$get(
          `${tokenApi}${vuexContext.state.tokenApi.categories}`,
          headers
        )
        vuexContext.commit('setCategories', categories)
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

        return `Bearer ${response.token}`
      }
    },
    getters: {
      getCategories(state) {
        return state.categories
      }
    },
    mutations: {
      setComputerInfo(state, value) {
        state.computer.uuid = value.uuid
        state.computer.name = value.computer_name
        state.computer.user = value.user
        state.computer.project = value.project
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
      setServerVersion(state, value) {
        state.serverVersion = value
      },
      setApps(state, value) {
        state.apps = value
      },
      setCategories(state, value) {
        state.categories = value
        state.categories[0] = 'All'
      },
      setAvailablePackages(state, value) {
        state.availablePackages = value
      },
      setSelectedCategory(state, value) {
        state.selectedCategory = value
      },
      setSearchApp(state, value) {
        state.searchApp = value
      },
      setOnlyInstalledApps(state, value) {
        state.onlyInstalledApps = value
      }
    }
  })
}

export default createStore
