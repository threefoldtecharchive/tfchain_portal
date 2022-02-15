import {
  web3FromAddress,
} from '@polkadot/extension-dapp'

export async function getValidatorRequest (api, address) {
  const validator = await api.query.validator.validator(address)
  return validator.toJSON()
}

export async function getBondedAccount (api, address) {
  const account = await api.query.validator.bonded(address)
  return account.toJSON()
}

export async function bond (address, api, validator, callback) {
  const injector = await web3FromAddress(address)
  return api.tx.validator
    .bond(validator)
    .signAndSend(address, { signer: injector.signer }, callback)
}