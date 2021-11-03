import {
  web3FromAddress,
} from '@polkadot/extension-dapp';
import { hex2a } from './util'

export async function getFarm (api, twinID) {
  const farms = await api.query.tfgridModule.farms.entries()
  const twinFarms = farms.filter(farm => {
    if (farm[1].toJSON().twin_id === twinID) {
      return farm
    }
  })

  return twinFarms.map(farm => {
    const parsedFarm = farm[1].toJSON()

    return {
      ...parsedFarm,
      name: hex2a(parsedFarm.name)
    }
  })
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

export async function deleteIP (address, api, farmID, ip, callback) {
  const injector = await web3FromAddress(address)

  api.tx.tfgridModule
    .removeFarmIp(farmID, ip.ip)
    .signAndSend(address, { signer: injector.signer }, callback)
}

export async function createIP (address, api, farmID, ip, gateway, callback) {
  const injector = await web3FromAddress(address)

  api.tx.tfgridModule
    .addFarmIp(farmID, ip, gateway)
    .signAndSend(address, { signer: injector.signer }, callback)
}