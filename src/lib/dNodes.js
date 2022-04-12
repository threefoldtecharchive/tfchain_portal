import axios from "axios";

import config from "../config";

import { web3FromAddress } from "@polkadot/extension-dapp";

export async function getNodesInfo() {
  let nodesIDs = [];
  let nodesInfo = [];
  nodesIDs.forEach(async (nodeID) => {
    const res = await axios.post(
      config.graphqlUrl,
      {
        query: `query getNodesInfo {
        nodes (where: {nodeID_eq: ${nodeID}}) {
          country
          nodeID
      }`,
        operation: "getNodesInfo",
      },
      { timeout: 1000 }
    );
    let node = res.data.data;
    nodesInfo.push(node);
  });
  return nodesInfo;
}

export function getRentableNodes2(nodes, farms) {
  const dedicatedFarm = farms.filter((farm) => farm.dedicatedFarm);
  const dedicatedNodes = nodes.filter((node) =>
    dedicatedFarm.some((farm) => farm.farmID === node.farmID)
  );
  const freeNodes = dedicatedNodes.filter((node) => {
    return (
      node.resourcesUsed.hru === "0" &&
      node.resourcesUsed.mru === "0" &&
      node.resourcesUsed.sru === "0" &&
      node.resourcesUsed.cru === "0"
    );
  });
  return freeNodes;
}

export async function getDedicatedFarms() {
  const res = await axios.post(
    config.graphqlUrl,
    {
      query: `{
        farms(where: {dedicatedFarm_eq: true}) {
          farmID
        }
      }
      `,
      operation: "getDedicatedFarms",
    },
    { timeout: 1000 }
  );
  return res.data.data.farms.map((farm) => farm.farmID);
}

export async function getDedicatedNodes(farmID) {
  let res = await axios.post(
    config.graphqlUrl,
    {
      query: `{
          nodes(where: {farmID_eq: ${farmID}}) {
            nodeID
            country
          }
        }      
      `,
      operation: "getNodes",
    },
    { timeout: 1000 }
  );
  return res.data.data.nodes;
}

export async function createRentContract(api, address, nodeId, callback) {
  const injector = await web3FromAddress(address);
  return api.tx.smartContractModule
    .createRentContract(nodeId)
    .signAndSend(address, { signer: injector.signer }, callback)
    .catch((error) => {
      console.log(error);
    });
}

export async function cancelRentContract(api, address, contractId, callback) {
  const injector = await web3FromAddress(address);
  return api.tx.smartContractModule
    .cancelContract(contractId)
    .signAndSend(address, { signer: injector.signer }, callback)
    .catch((error) => {
      console.log(error);
    });
}

export async function getRentStatus(api, nodeID, currentTwinID) {
  const data = await api.query.smartContractModule.activeRentContractForNode(
    nodeID
  );

  const activeRentContracts = data.toJSON();

  if (activeRentContracts.contract_id === 0) {
    return "free";
  } else {
    if (activeRentContracts.twin_id == currentTwinID) {
      return "yours";
    } else {
      return "taken";
    }
  }
}

export async function getActiveContracts(api, nodeID) {
  return await api.query.smartContractModule.activeNodeContracts(nodeID);
}

export async function getRentContractID(api, nodeID) {
  const rentContractID =
    await api.query.smartContractModule.activeRentContractForNode(nodeID);
  return rentContractID.toJSON().contract_id;
}

export async function countPrice(api, nodeID) {
  const pricing = await api.query.tfgridModule.pricingPolicies(1);
  const price = pricing.toJSON();

  const res = await axios.post(
    config.graphqlUrl,
    {
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
      operation: "getNodeResources",
    },
    { timeout: 1000 }
  );

  const nodeResources = res.data.data.nodes[0].resourcesTotal;

  const resources = {
    sru: nodeResources.sru / 1024 / 1024 / 1024,
    hru: nodeResources.hru / 1024 / 1024 / 1024,
    mru: nodeResources.mru / 1024 / 1024 / 1024,
    cru: nodeResources.cru,
  };
  const SU = calSU(resources.cru, resources.mru);
  const CU = calCU(resources.hru, resources.sru);

  const totalPrice = CU * price.cu.value + SU * price.su.value;

  const usdPrice = totalPrice / 10000000;

  return usdPrice.toFixed(2);
}

export function calDiscount(totalPrice, discount) {
  return totalPrice - totalPrice * (discount / 100);
}

export function calCU(cru, mru) {
  let mru_used_1 = mru / 4;
  let cru_used_1 = cru / 2;
  let cu1 = mru_used_1 > cru_used_1 ? mru_used_1 : cru_used_1;

  let mru_used_2 = mru / 8;
  let cru_used_2 = cru;
  let cu2 = mru_used_2 > cru_used_2 ? mru_used_2 : cru_used_2;

  let mru_used_3 = mru / 2;
  let cru_used_3 = cru / 4;
  let cu3 = mru_used_3 > cru_used_3 ? mru_used_3 : cru_used_3;

  let cu = cu1 > cu2 ? cu2 : cu1;
  cu = cu > cu3 ? cu3 : cu;

  return cu;
}

export function calSU(hru, sru) {
  return hru / 1200 + sru / 200;
}

export async function getDNodes(api) {
  let farmsIDs = await getDedicatedFarms();

  let nodes = [];
  for (let farmID of farmsIDs) {
    let _nodes = await getDedicatedNodes(farmID);
    nodes = nodes.concat(_nodes);
  }
  console.log(nodes);

  let dNodes = [];
  nodes.forEach(async (node) => {
    let price = await countPrice(api, node.nodeID);
    let discount = calDiscount(price, 50);
    dNodes.push({
      nodeId: node.nodeID,
      location: node.country,
      price: price,
      discount: discount,
    });
  });
  return dNodes;
}
