import { internalApi, tokenApi } from './settings'

const state = () => ({
  name: '',
  uuid: '',
  cid: 0,
  project: '',
  user: '',
  link: '',
  mask: '',
  network: '',
  helpdesk: '',
  data: {},
  attribute: 0
})

const actions = {
  async computerInfo(vuexContext) {
    await this.$axios.$get(`${internalApi}/preferences/server`).then(data => {
      vuexContext.commit('setComputerInfo', data)
    })
    .catch(error => {
      console.log(error) // TODO
    })
  },
  async computerNetwork(vuexContext) {
    await this.$axios.$get(`${internalApi}/computer/network`).then(data => {
      vuexContext.commit('setComputerNetwork', data)
    })
    .catch(error => {
      console.log(error) // TODO
    })
  },
  async computerId(vuexContext) {
    await this.$axios.$get(`${internalApi}/computer/id`).then(data => {
      vuexContext.commit('setComputerId', data)
      vuexContext.commit('setComputerLink', {
        protocol: vuexContext.rootState.protocol,
        host: vuexContext.rootState.host,
        cid: data
      })
  })
    .catch(error => {
      console.log(error) // TODO
    })
  },
  async computerData(vuexContext) {
    await this.$axios
      .$get(
        `${vuexContext.rootState.initialUrl.token}${tokenApi.computer}${vuexContext.state.cid}/`,
        { headers: { Authorization: vuexContext.rootState.tokenValue } }
      )
      .then(data => {
        vuexContext.commit('setComputerData', data)
      })
      .catch(error => {
        console.log(error) // TODO
        /*error({
            statusCode: 503,
            message: 'Unable to fetch computer at this time, please try again'
        })*/ // TODO
      })
  },
  async computerAttribute(vuexContext) {
    await this.$axios
      .$get(
        `${vuexContext.rootState.initialUrl.token}${tokenApi.cidAttribute}${vuexContext.state.cid}`,
        { headers: { Authorization: vuexContext.rootState.tokenValue } }
      )
      .then(data => {
        if (data.count === 1)
          vuexContext.commit('setComputerAttribute', data.results[0].id)
      })
      .catch(error => {
        console.log(error) // TODO
      })
  }
}

const mutations = {
  setComputerInfo(state, value) {
    state.uuid = value.uuid
    state.name = value.computer_name
    state.user = value.user
    state.project = value.project
  },
  setComputerId(state, value) {
    state.cid = value
  },
  setComputerLink(state, value) {
    // FIXME path
    state.link = `${value.protocol}://${value.host}/admin/client/computer/${value.cid}/`
  },
  setComputerData(state, value) {
    state.data = value
  },
  setComputerAttribute(state, value) {
    state.attribute = value
  },
  setComputerNetwork(state, value) {
    state.mask = value.mask
    state.network = value.network
  }
}

export default {
  state,
  actions,
  mutations
}
