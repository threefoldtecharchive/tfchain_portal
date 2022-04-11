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

export async function getActiveContracts(nodeID) {
  const res = await axios.post(config.graphqlUrl, {
    query: `query allContracts {
      nodeContracts(where: {nodeID_eq:${nodeID}}) {
        contractID
      }
    }`,
    operation: 'allContracts'
  }, { timeout: 1000 })
  return res.data.data.nodeContracts
}

export async function getRentContractID(api, nodeID) {
  
  const rentContractID = await api.query.smartContractModule.activeRentContractForNode(nodeID)
  return rentContractID.toJSON().contract_id
}

export async function countPrice(api, nodeID) {

  const pricing = await api.query.tfgridModule.pricingPolicies(1)
  const price = pricing.toJSON()

  // call node resources
  const res = await axios.post(config.graphqlUrl, {
    query: `query getNodeResources {
      nodes(where: {nodeID_eq: ${nodeID}}) {
        resourcesTotal {
          cru
          hru
          mru
          sru
        }
      }
    }`,
    operation: 'getNodeResources'
  }, { timeout: 1000 })

  // count
  const nodeResources = res.data.data.nodes[0].resourcesTotal
  
  const resources = {
    sru: nodeResources.sru/1024/1024/1024,
    hru: nodeResources.hru/1024/1024/1024,
    mru: nodeResources.mru/1024/1024/1024,
    cru: nodeResources.cru,
  }
  const SU = calSU(resources.cru, resources.mru)
  const CU = calCU(resources.hru, resources.sru)
  
  const totalPrice = (CU * price.cu.value) + (SU * price.su.value)

  // convert to usd
  const usdPrice = totalPrice / 10000000

  // discount
  return usdPrice.toFixed(2)
}

export function countDiscount(totalPrice, discount) {
  return totalPrice - (totalPrice * (discount/100))
}

export function calCU(cru, mru) {

  let mru_used_1 = mru / 4;
  let cru_used_1 = cru / 2;
  let cu1 = mru_used_1 > cru_used_1? mru_used_1 : cru_used_1; 

  let mru_used_2 = mru / 8;
  let cru_used_2 = cru;
  let cu2 = mru_used_2 > cru_used_2? mru_used_2 : cru_used_2; 

  let mru_used_3 = mru / 2;
  let cru_used_3 = cru / 4;
  let cu3 = mru_used_3 > cru_used_3? mru_used_3 : cru_used_3; 

  let cu = cu1 > cu2?  cu2 : cu1;
  cu = cu > cu3?  cu3 : cu ;

  return cu
}

export function calSU(hru, sru) {
  return hru / 1200 + sru / 200
}