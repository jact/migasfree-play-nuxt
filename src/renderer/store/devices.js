import Vue from 'vue'
import { tokenApi } from './settings'

const state = () => ({
  assigned: [],
  inflicted: [],
  default: 0,
  available: []
})

const getters = {
  getAvailableDevices(state) {
    return state.available
  }
}

const actions = {
  async computerDevices(vuexContext) {
    await this.$axios
      .$get(
        `${vuexContext.rootState.initialUrl.token}${tokenApi.computer}${vuexContext.rootState.computer.cid}/devices/`,
        { headers: { Authorization: vuexContext.rootState.tokenValue } }
      )
      .then(data => {
        vuexContext.commit('setComputerDevices', data)
      })
      .catch(error => {
        console.log(error) // TODO
      })
  },
  async getFeaturesDevices(vuexContext) {
    vuexContext.state.available.forEach((item, index) => {
      vuexContext.dispatch('getLogicalDevice', { id: item.id, index })
    })
  },
  async getLogicalDevice(vuexContext, { id, index }) {
    await this.$axios
      .$get(
        `${vuexContext.rootState.initialUrl.token}${tokenApi.availableLogicalDevices}${vuexContext.rootState.computer.cid}&did=${id}`,
        { headers: { Authorization: vuexContext.rootState.tokenValue } }
      )
      .then(data => {
        if (data.results) {
          let payload = {}
          payload.results = data.results
          payload.index = index
          vuexContext.commit('addLogicalDevices', payload)
        }
      })
      .catch(error => {
        console.log(error) // TODO
      })
  },
  changeDeviceAttributes(vuexContext, { id, attributes, element = null }) {
    this.$axios
      .$patch(
        `${vuexContext.rootState.initialUrl.token}${tokenApi.logicalDevice}${id}/`,
        { attributes },
        { headers: { Authorization: vuexContext.rootState.tokenValue } }
      )
      .then(data => {
        if (data.id) {
          let payload = {}
          payload.results = data.attributes
          payload.index = id
          vuexContext.commit('setLogicalAttributes', payload)
          if (element) element.disabled = false
        }
      })
      .catch(error => {
        console.log(error) // TODO
      })
  }
}

const mutations = {
  setComputerDevices(state, value) {
    state.default = value.default_logical_device
    state.assigned = value.assigned_logical_devices_to_cid
    state.inflicted = value.inflicted_logical_devices
  },
  setAvailableDevices(state, value) {
    state.available = value
  },
  addLogicalDevices(state, value) {
    Vue.set(state.available[value.index], 'logical', value.results)
  },
  setLogicalAttributes(state, value) {
    for (let i = 0; i < state.available.length; i++) {
      for (let j = 0; j < state.available[i].logical.length; j++) {
        if (state.available[i].logical[j].id === value.index) {
          Vue.set(state.available[i].logical[j], 'attributes', value.results)
          return
        }
      }
    }
  },
  addAssignedDevice(state, value) {
    Vue.set(state.assigned, state.assigned.length, value)
  },
  removeAssignedDevice(state, value) {
    for (let i = 0; i < state.assigned.length; i++) {
      if (state.assigned[i].id === value) {
        state.assigned.splice(i, 1)
        return
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
