import { tokenApi } from './settings'

const state = () => ({
  categories: [],
  selectedCategory: 0,
  searchApp: null,
  onlyInstalledApps: false,
  searchDevice: null,
  onlyAssignedDevices: false
})

const getters = {
  getCategories(state) {
    return state.categories
  }
}

const actions = {
  async setCategories(vuexContext) {
    await this.$axios
      .$get(`${vuexContext.rootState.initialUrl.token}${tokenApi.categories}`, {
        headers: { Authorization: vuexContext.rootState.tokenValue }
      })
      .then(data => {
        // console.log(data)
        vuexContext.commit('setCategories', data)
      })
      .catch(error => {
        console.log(vuexContext.rootState.initialUrl.token, error) // TODO
      })
  }
}

const mutations = {
  setCategories(state, value) {
    state.categories = value
    state.categories[0] = 'All'
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
  setSearchDevice(state, value) {
    state.searchDevice = value
  },
  setOnlyAssignedDevices(state, value) {
    state.onlyAssignedDevices = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
