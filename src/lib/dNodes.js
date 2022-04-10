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
      .catch(error => {
        console.log(error)
      })
}

export async function cancelRentContract (api, address, contractId, callback) {
  const injector = await web3FromAddress(address)
  return api.tx.smartContractModule
    .cancelContract(contractId)
    .signAndSend(address, { signer: injector.signer }, callback)
    .catch(error => {
      console.log(error)
    })
}

export async function rentStatusFromChain (api, nodeID, currentTwinID) {
  // used chain query instead of graphql for faster response of the contract status.
  const data = await api.query.smartContractModule.activeRentContractForNode(nodeID)

  const activeRentContracts = data.toJSON()
  
  if (activeRentContracts.contract_id === 0) {
    return "free"
  } else {
    if (activeRentContracts.twin_id == currentTwinID) {
      return "yours"
    } else {
      return "taken"}
  }
}
export async function rentStatusFromGraphql ( nodeID, currentTwinID) {
    const res = await axios.post(config.graphqlUrl, {
      query: `query rentStatus {
        rentContracts(where: {nodeID_eq:${nodeID}}) {
          contractID
          twinID
        }
      }`,
      operation: 'rentStatus'
    }, { timeout: 1000 })
  
    if (res.data.data.rentContracts.length === 0) {
        return "free"
    } else {
      if (res.data.data.rentContracts[0].twinID === currentTwinID) {
        return "yours"
      } else {
        return "taken"
      }
    }
}

export async function getAllContracts(api, nodeID) {
  const res = await axios.post(config.graphqlUrl, {
    query: `query allContracts {
      nodeContracts(where: {nodeID_eq:${nodeID}}) {
        contractID
      }
    }`,
    operation: 'allContracts'
  }, { timeout: 1000 })
  const rentContractID = await api.query.smartContractModule.activeRentContractForNode(nodeID)
  return res.data.data.nodeContracts, rentContractID.toJSON().contract_id
}