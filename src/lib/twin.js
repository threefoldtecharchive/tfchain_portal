import {
  web3FromAddress,
} from '@polkadot/extension-dapp';

export async function getTwinID (api, accountID) {
  const twin = await api.query.tfgridModule.twinIdByAccountID(accountID)
  return twin.toJSON()
}

export async function getTwin (api, id) {
  const twin = await api.query.tfgridModule.twins(id)
  return twin.toJSON()
}

export async function createTwin (address, api, ip, callback) {
  const injector = await web3FromAddress(address)
  return api.tx.tfgridModule
    .createTwin(ip)
    .signAndSend(address, { signer: injector.signer }, callback)
}

export async function updateTwin (address, api, ip, callback, errc) {
  const injector = await web3FromAddress(address)
  return api.tx.tfgridModule
    .updateTwin(ip)
    .signAndSend(address, { signer: injector.signer }, callback, errc)
}
