import axios from "axios"
import config from '../config'
import { Keyring } from '@polkadot/keyring'

export async function activateThroughActivationService (substrateAccountID) {
  return axios.post(`${config.activationServiceUrl}/activation/activate`, {
    substrateAccountID
  })
}

export async function getMoreFunds(substrateAccountID, api, callback) {
  const keyring = new Keyring({ type: 'sr25519' })
  const alice = keyring.addFromUri('//Alice')

  const transfer = api.tx.balances.transfer(substrateAccountID, 10000*1e7)

  transfer.signAndSend(alice, callback)
}