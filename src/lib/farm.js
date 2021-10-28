import {
  web3FromAddress,
} from '@polkadot/extension-dapp';

export async function getFarm (api, twinID) {
  const farms = await api.query.tfgridModule.farms.entries()
  console.log(farms)
  const farm = farms.filter(farm => {
    if (farm[1].toJSON().twin_id === twinID) {
      return farm
    }
  })

  if (farms.length > 0) {
    return farm[0][1].toJSON()
  }
}

export async function getFarmByID (api, id) {
  const farm = await api.query.tfgridModule.farms(id)
  return farm.toJSON()
}

export async function createFarm (address, api, name, callback) {
  const injector = await web3FromAddress(address)

  api.tx.tfgridModule
    .createFarm(name, [])
    .signAndSend(address, { signer: injector.signer }, callback)
}
  