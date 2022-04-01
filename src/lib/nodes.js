import {
  web3FromAddress,
} from '@polkadot/extension-dapp'
// import { hex2a } from './util'
import axios from 'axios'

import config from '../config'

export async function getNodesByFarmID (api, farms) {
  const farmIDs = farms.map(farm => farm.id)

  const nodes = farmIDs.map(farmID => {
    return getNodesByFarm(farmID)
  })
  const data = await Promise.all(nodes)

  if (data.length === 0) return []

  const nodesWithResources = await data[0].map(async node => {
    try {
      node.usedResources = await getNodeUsedResources(node.nodeId)
      node.resources = {
        sru: node.sru,
        cru: node.cru,
        hru: node.hru,
        mru: node.mru
      }
    } catch (error) {
      node.usedResources = {
        sru: 0,
        hru: 0,
        mru: 0,
        cru: 0,
      }
      node.resources = {
        sru: 0,
        hru: 0,
        mru: 0,
        cru: 0,
      }
    }

    return node
  })

  return await Promise.all(nodesWithResources)
}

export async function getNodesByFarm (farmID) {
  const res = await axios.post(config.graphqlUrl, {
    query: `{ nodes(where: {farmId_eq:${farmID}}) { twinId, uptime, updatedAt, createdAt, city, country, nodeId, farmId, sru, hru, mru, cru, serialNumber, virtualized, farmingPolicyId, location { latitude, longitude }, interfaces { ips, name, mac }, certificationType, publicConfig { domain, gw4, gw6, ipv4, ipv6 }  }}`,
    operation: 'getNodes'
  }, { timeout: 1000 })

  return res.data.data.nodes
}

export async function getNodeUsedResources (nodeId) {
  const res = await axios.get(`${config.gridproxyUrl}nodes/${nodeId}`, { timeout: 1000 })

  if (res.status === 200) {
    if (res.data == 'likely down') {
      throw Error('likely down')
    } else {
      return res.data.capacity.used_resources
    }
  }
}

export async function addNodePublicConfig (address, api, farmID, nodeID, config, callback) {
  const injector = await web3FromAddress(address)

  return api.tx.tfgridModule
    .addNodePublicConfig(farmID, nodeID, config)
    .signAndSend(address, { signer: injector.signer }, callback)
}