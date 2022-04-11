import {
  web3FromAddress,
} from '@polkadot/extension-dapp'
import axios from 'axios'

import config from '../config'

export async function getNodesByFarmID (api, farms) {
  const farmIDs = farms.map(farm => farm.id)

  const nodes = farmIDs.map(farmID => {
    return getNodesByFarm(farmID)
  })
  const data = await Promise.all(nodes)

  console.log(data)
  return data[0]
}

export async function getNodesByFarm (farmID) {
  const res = await axios.post(config.graphqlUrl, {
    query: `{ nodes(where: {farmID_eq:${farmID}}) { twinID, uptime, createdAt, updatedAt, city, country, nodeID, farmID, serialNumber, virtualized, farmingPolicyId, location { latitude, longitude }, interfaces { ips, name, mac }, certificationType, publicConfig { domain, gw4, gw6, ipv4, ipv6 }, resourcesUsed { sru, hru, mru, cru }, resourcesTotal { sru, hru, mru, cru }, resourcesFree { sru, hru, mru, cru }  }}`,
    operation: 'getNodes'
  })

  return res.data.data.nodes
}

export async function addNodePublicConfig (address, api, farmID, nodeID, config, callback) {
  const injector = await web3FromAddress(address)

  return api.tx.tfgridModule
    .addNodePublicConfig(farmID, nodeID, config)
    .signAndSend(address, { signer: injector.signer }, callback)
}