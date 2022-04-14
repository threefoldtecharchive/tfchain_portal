import axios from "axios";

import config from "../config";

import { web3FromAddress } from "@polkadot/extension-dapp";
import { getBalance } from "./balance";

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
  const res = await axios.post(
    config.graphqlUrl,
    {
      query: `query MyQuery {
        nodes(where: {farmID_eq: ${farmID}}) {
          resourcesTotal {
            cru
            hru
            mru
            sru
          }
          nodeID
          location {
            latitude
            longitude
          }
          country
          city
          farmID
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
    .signAndSend(address, { signer: injector.signer }, callback);
}

export async function cancelRentContract(api, address, contractId, callback) {
  const injector = await web3FromAddress(address);
  return api.tx.smartContractModule
    .cancelContract(contractId)
    .signAndSend(address, { signer: injector.signer }, callback);
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

export async function getPrices(api){
  const pricing = await api.query.tfgridModule.pricingPolicies(1);
  return pricing.toJSON();
}

export function countPrice(prices, node) {

  const resources = {
    sru: node.resourcesTotal.sru / 1024 / 1024 / 1024,
    hru: node.resourcesTotal.hru / 1024 / 1024 / 1024,
    mru: node.resourcesTotal.mru / 1024 / 1024 / 1024,
    cru: node.resourcesTotal.cru,
  };
  const SU = calSU(resources.hru, resources.sru);
  const CU = calCU(resources.cru, resources.mru);

  const totalPrice =
    CU * prices.cu.value * 24 * 30 + SU * prices.su.value * 24 * 30;

  const usdPrice = totalPrice / 10000000;

  return usdPrice.toFixed(2);
}

export async function calDiscount(api, address, pricing, price) {
  // discount for Dedicated Nodes
  const discount = pricing.discount_for_dedicated_nodes;

  let totalPrice = price - price * (discount / 100);

  // discount for Twin Balance
  const balance = (await getBalance(api, address)) / 1e7;

  const discountPackages = {
    none: {
      duration: 0,
      discount: 0,
    },
    default: {
      duration: 3,
      discount: 20,
    },
    bronze: {
      duration: 6,
      discount: 30,
    },
    silver: {
      duration: 12,
      discount: 40,
    },
    gold: {
      duration: 36,
      discount: 60,
    },
  };

  let selectedPackage = discountPackages.none;

  for (let pkg in discountPackages) {
    if (balance >= totalPrice * pkg.duration) {
      selectedPackage = pkg;
    }
  }

  totalPrice = totalPrice - totalPrice * (selectedPackage.discount / 100);

  return [totalPrice, selectedPackage.discount];
}

export function calCU(cru, mru) {
  const mru_used_1 = mru / 4;
  const cru_used_1 = cru / 2;
  const cu1 = mru_used_1 > cru_used_1 ? mru_used_1 : cru_used_1;

  const mru_used_2 = mru / 8;
  const cru_used_2 = cru;
  const cu2 = mru_used_2 > cru_used_2 ? mru_used_2 : cru_used_2;

  const mru_used_3 = mru / 2;
  const cru_used_3 = cru / 4;
  const cu3 = mru_used_3 > cru_used_3 ? mru_used_3 : cru_used_3;

  let cu = cu1 > cu2 ? cu2 : cu1;
  cu = cu > cu3 ? cu3 : cu;

  return cu;
}

export function calSU(hru, sru) {
  return hru / 1200 + sru / 200;
}

export async function getDNodes(api, address) {
  const farmsIDs = await getDedicatedFarms();

  let nodes = [];
  for (let farmID of farmsIDs) {
    let _nodes = await getDedicatedNodes(farmID);
    nodes = nodes.concat(_nodes);
  }

  const pricing = await getPrices(api);
  let dNodes = [];
  nodes.forEach(async (node) => {
    let price = countPrice(pricing, node);
    let [discount, discountLevel] = await calDiscount(api, address, pricing, price);
    let ips = await getIpsForFarm(node.farmID);
    dNodes.push({
      nodeId: node.nodeID,
      price: price,
      discount: discount,
      applyedDiscount: {first: pricing.discount_for_dedicated_nodes, second: discountLevel },
      location: {
        country: node.country,
        city: node.city,
        long: node.location.longitude,
        lat: node.location.latitude,
      },
      resources: {
        cru: node.resourcesTotal.cru,
        mru: node.resourcesTotal.mru,
        hru: node.resourcesTotal.hru,
        sru: node.resourcesTotal.sru,
      },
      pubIps: ips,
    });
  });
  return dNodes;
}

export async function getIpsForFarm(farmID) {
  const res = await axios.post(
    config.graphqlUrl,
    {
      query: `query MyQuery {
        farms(where: {farmID_eq: ${farmID}}) {
          publicIPs {
            id
          }
        }
      }      
      `,
      operation: "getNodes",
    },
    { timeout: 1000 }
  );
  return res.data.data.farms[0].publicIPs.length;
}

export function byteToGB(capacity) {
  return (capacity / 1024 / 1024 / 1024).toFixed(0);
}
