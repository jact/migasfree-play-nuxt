import { internalApi, publicApi, tokenApi } from './settings'

const state = () => ({
  name: '',
  uuid: 'E0A6D7DE-8CEE-11E6-9C43-BC00002E0000', //'', // FIXME empty by default
  cid: 4609, // FIXME 0 by default
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
  },
  async computerNetwork(vuexContext) {
    await this.$axios.$get(`${internalApi}/computer/network`).then(data => {
      vuexContext.commit('setComputerNetwork', data)
    })
  },
  async moreComputerInfo(vuexContext) {
    await this.$axios
      .$get(
        `${vuexContext.rootState.initialUrl.baseDomain}${publicApi.computerInfo}${vuexContext.state.uuid}`
      )
      .then(data => {
        vuexContext.commit('setMoreComputerInfo', data)
        vuexContext.commit('setComputerLink', {
          protocol: vuexContext.rootState.protocol,
          host: vuexContext.rootState.host,
          cid: data.cid
        })
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
    state.project = 'AZL-16' // value.project // FIXME
  },
  setMoreComputerInfo(state, value) {
    // state.cid = value.id // FIXME
    state.name = value.search
    state.helpdesk = value.helpdesk
    // FIXME more data
  },
  setComputerLink(state, value) {
    state.link = `${value.protocol}://${value.host}/admin/server/computer/${value.cid}/`
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
