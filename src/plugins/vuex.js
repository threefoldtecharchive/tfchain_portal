import Vue from 'vue'
import Vuex from 'vuex'
import { connect } from '../lib/connect'
import { getBalance } from '../lib/balance'

import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
} from '@polkadot/extension-dapp';
import { getNodesInfo, dedicatedAndFree } from '../lib/dNodes';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    api: undefined,
    snackbar: false,
    connected: false,
    accounts: [],
    loadingAPI: true,
    loadingDNodes: false,
    dNodes: [],
  },
  mutations: {
    setAPI (state, payload) {
      state.api = payload.api
    },
    setConnected (state, payload) {
      state.connected = payload.connected
    },
    setAccounts (state, payload) {
      state.accounts = payload.accounts
    },
    setSnackbar (state, payload) {
      state.snackbar = payload.snackbar
    },
    setLoadingAPI (state, payload) {
      state.loadingAPI = payload.loading
    },
    setLoadingDNodes (state, payload) {
      state.loadingDNodes = payload.loading
    },
    setDNodes (state, payload) {
      state.dNodes = payload.dNodes
    },
    setNodeReserved (state, payload) {
      state.nodes[payload.nodeId] = !state.nodes[payload.nodeId]
    }
  },

  getters: {
    api: state => { return state.api },
    accounts: state => { return state.accounts },
    snackbar: state => { return state.snackbar },
    connected: state => { return state.connected },
    loadingAPI: state => { return state.loadingAPI },
    loadingDNodes: state => { return state.loadingDNodes },
    dNodes: state => { return state.dNodes },
  },

  actions: {
    async getAPI(context) {
      if (context.state.api) return
 
      context.commit('setLoadingAPI', { loading: true })
      const api = await connect()
      await web3Enable('TF Chain UI')
      const accounts = await web3Accounts()
      context.commit('setAPI', { api })
      context.commit('setConnected', { connected: true })

      const accountsWithBalance = await appendBalanceToAccounts(api, accounts)

      context.commit('setAccounts', { accounts: accountsWithBalance })
      context.commit('setSnackbar', { snackbar: true })
    },
    showSnackbar(context) {
      context.commit('setSnackbar', { snackbar: true })
    },
    async getAccounts(context) {
      console.log('dispatching get accounts')
      const accounts = await web3Accounts()
      const accountsWithBalance = await appendBalanceToAccounts(context.state.api, accounts)
      console.log(accountsWithBalance)
      context.commit('setAccounts', { accounts: accountsWithBalance })
    },

    async getDNodes({ commit }) {
      commit('setLoadingDNodes', { loading: true })

      let res = await getNodesInfo()
      let nodes = dedicatedAndFree(res.nodes, res.farms)

      let dNodes = []
      nodes.forEach(node => {
        dNodes.push({
            nodeId: node.nodeID,
            location: node.country,
            price: node.price,
            discount: node.discount,
          })
      })

      commit('setDNodes', { dNodes })

      commit('setLoadingDNodes', { loading: false })
    },

    // reserveNode({commit}, {api, nodeId}) {
    //   console.log('reserving node')
    //   commit('setNodeReserved', { nodeId })
    // }
  }
})

async function appendBalanceToAccounts (api, accounts) {
  return await Promise.all(accounts.map(async account => {
    const balance = await getBalance(api, account.address)
    return {
      ...account,
      balance: balance / 1e7
    }
  }))
}

export default store