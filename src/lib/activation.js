import axios from "axios"
import { Keyring } from '@polkadot/keyring'

export async function activateThroughActivationService (url, substrateAccountID) {
  return axios.post(`${url}/activation/activate`, {
    substrateAccountID
  })
}

export async function getMoreFunds(substrateAccountID, api, callback) {
  const keyring = new Keyring({ type: 'sr25519' })
  const alice = keyring.addFromUri('//Alice')

  const transfer = api.tx.balances.transfer(substrateAccountID, 100*1e7)

  transfer.signAndSend(alice, callback)
}