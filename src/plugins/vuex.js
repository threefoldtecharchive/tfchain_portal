import Vue from 'vue'
import Vuex from 'vuex'
import { connect } from '../lib/connect'
import { getBalance } from '../lib/balance'
import { getConfig } from '../config.js'


import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
} from '@polkadot/extension-dapp';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    api: undefined,
    snackbar: false,
    connected: false,
    accounts: [],
    loadingAPI: true,
    network: 'dev',
    config: getConfig('dev'),
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
    setNetwork (state, payload) {
      state.config = getConfig(payload.network)
      state.network = payload.network
    }
  },
  getters: {
    api: state => { return state.api },
    accounts: state => { return state.accounts },
    snackbar: state => { return state.snackbar },
    connected: state => { return state.connected },
    loadingAPI: state => { return state.loadingAPI },
    network: state => { return state.network },
    config: state => { return state.config },
  },
  actions: {
    async getAPI(context) {
      //if (context.state.api) return

      context.commit('setLoadingAPI', { loading: true })

      console.log(`getting api with ${context.state.network}`)
      const url = getConfig(context.state.network).wsUrl

      console.log('connecting to', url);
      const api = await connect(url)
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
    }
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