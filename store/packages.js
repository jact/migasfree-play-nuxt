import { internalApi } from './settings'

const state = () => ({
  available: [],
  installed: []
})

const actions = {
  async setAvailablePackages(vuexContext) {
    await this.$axios.$get(`${internalApi}/packages/available`).then(data => {
      vuexContext.commit('setAvailablePackages', data)
    })
  },
  async setInstalledPackages(vuexContext) {
    await this.$axios
      .$post(
        `${internalApi}/packages/installed`,
        vuexContext.rootGetters.getAppsPackages
      )
      .then(data => {
        vuexContext.commit('setInstalledPackages', data)
      })
  }
}

const mutations = {
  setAvailablePackages(state, value) {
    state.available = value
  },
  setInstalledPackages(state, value) {
    state.installed = value
  }
}

export default {
  state,
  actions,
  mutations
}
