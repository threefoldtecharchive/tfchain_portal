import {
  web3FromAddress,
} from '@polkadot/extension-dapp'
import { Keyring } from '@polkadot/keyring'

export async function transfer (address, api, target, amount, callback) {
  const injector = await web3FromAddress(address)
  return api.tx.balances
    .transfer(target, amount*1e7)
    .signAndSend(address, { signer: injector.signer }, callback)
}

export function checkAddress (address) {
  const keyring = new Keyring({ type: 'sr25519' })
  try {
    keyring.addFromAddress(address)
    return true
  } catch (error) {
    return error
  }
}