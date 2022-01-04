import axios from "axios"
import config from '../config'
import { Keyring } from '@polkadot/keyring'
import {
  web3FromAddress,
} from '@polkadot/extension-dapp'
import { hex2a } from "./util"

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

export async function acceptTermsAndCondition (api, address, documentLink, documentHash, callback) {
  const injector = await web3FromAddress(address)
  api.tx.tfgridModule
    .userAcceptTc(documentLink, documentHash)
    .signAndSend(address, { signer: injector.signer }, callback)
}

export async function userAcceptedTermsAndConditions (api, address, documentLink, documentHash) {
  const tcs = await api.query.tfgridModule.usersTermsAndConditions(address)
  const parsedTcs = tcs.toJSON()

  console.log(documentHash)
  console.log(documentLink)

  return parsedTcs.filter(tc => hex2a(tc.document_link) === documentLink).length > 0
}