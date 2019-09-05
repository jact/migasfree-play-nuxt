import { internalApi } from './settings'
import VueI18n from 'vue-i18n'

const state = () => ({
  language: 'es',
  showSyncDetails: false,
  showApps: true,
  showDevices: true,
  showDetails: true,
  showPreferences: true,
  showInfo: true,
  showHelp: true
})

const actions = {
  async readPreferences(vuexContext) {
    await this.$axios.$get(`${internalApi}/preferences`).then(data => {
      vuexContext.commit('setPreferences', data)
    })
  },
  savePreferences(vuexContext) {
    this.$axios.$post(`${internalApi}/preferences`, {
      language: vuexContext.state.language,
      show_sync_details: vuexContext.state.showSyncDetails,
      show_apps: vuexContext.state.showApps,
      show_devices: vuexContext.state.showDevices,
      show_details: vuexContext.state.showDetails,
      show_preferences: vuexContext.state.showPreferences,
      show_info: vuexContext.state.showInfo,
      show_help: vuexContext.state.showHelp
    })
  }
}

const mutations = {
  setPreferences(state, value) {
    state.language = value.language
    VueI18n.locale = state.language
    state.showSyncDetails = value.show_sync_details
    state.showApps = value.show_apps
    state.showDevices = value.show_devices
    state.showDetails = value.show_details
    state.showPreferences = value.show_preferences
    state.showInfo = value.show_info
    state.showHelp = value.show_help
  },
  setLanguage(state, value) {
    state.language = value
    VueI18n.locale = state.language
  },
  setShowSyncDetails(state, value) {
    state.showSyncDetails = value
  }
}

export default {
  state,
  actions,
  mutations
}
