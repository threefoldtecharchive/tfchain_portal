import axios from 'axios'

import config from '../config'

import {
    web3FromAddress,
  } from '@polkadot/extension-dapp'
  

export async function getNodesInfo () {
    const res = await axios.post(config.graphqlUrl, {
      query: `query getNodesInfo {
        nodes {
          country
          nodeID
          farmID
          resourcesUsed {
            cru
            hru
            mru
            sru
          }
        }
        farms {
          farmID
          dedicatedFarm
        }
      }`,
      operation: 'getNodesInfo'
    }, { timeout: 1000 })
  
    return res.data.data
}

export function dedicatedAndFree(nodes, farms) {
    const dedicatedFarm = farms.filter(farm => farm.dedicatedFarm)
    const dedicatedNodes = nodes.filter(node => dedicatedFarm.some(farm => farm.farmID === node.farmID))
    const freeNodes = dedicatedNodes.filter(node => {
        return node.resourcesUsed.hru === "0" && node.resourcesUsed.mru === "0" && node.resourcesUsed.sru === "0" && node.resourcesUsed.cru === "0"
    })
    return freeNodes
}


export async function createRentContract (api, address, nodeId, callback) {
    const injector = await web3FromAddress(address)
    return api.tx.smartContractModule
      .createRentContract(nodeId)
      .signAndSend(address, { signer: injector.signer }, callback)
}