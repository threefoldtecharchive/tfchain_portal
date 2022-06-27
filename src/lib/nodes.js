import { web3FromAddress } from "@polkadot/extension-dapp";
import axios from "axios";

import config from "../config";

export async function getNodesByFarmID(api, farms) {
  const farmIDs = farms.map((farm) => farm.id);

  const nodes = farmIDs.map((farmID) => {
    return getNodesByFarm(farmID);
  });
  const data = await Promise.all(nodes);

  if (data.length === 0) return [];
  const _nodes = data.flat();
  
  const nodesWithResources = await _nodes.map(async (node) => {
    try {
      node.resourcesUsed = await getNodeUsedResources(node.nodeID);
      node.resources = node.resourcesTotal;
    } catch (error) {
      node.resourcesUsed = {
        sru: 0,
        hru: 0,
        mru: 0,
        cru: 0,
      };
      node.resources = {
        sru: 0,
        hru: 0,
        mru: 0,
        cru: 0,
      };
    }

    return node;
  });

  return await Promise.all(nodesWithResources);
}

export async function getNodesByFarm(farmID) {
  const res = await axios.post(config.graphqlUrl, {
    query: `{ nodes(where: {farmID_eq:${farmID}}) { twinID, uptime, createdAt, updatedAt, city, country, nodeID, farmID, serialNumber, virtualized, farmingPolicyId, location { latitude, longitude }, interfaces { ips, name, mac }, certification, publicConfig { domain, gw4, gw6, ipv4, ipv6 }, resourcesTotal { sru, hru, mru, cru }  }}`,
    operation: "getNodes",
  });

  return res.data.data.nodes;
}

export async function addNodePublicConfig(
  address,
  api,
  farmID,
  nodeID,
  config,
  callback
) {
  const injector = await web3FromAddress(address);

  return api.tx.tfgridModule
    .addNodePublicConfig(farmID, nodeID, config)
    .signAndSend(address, { signer: injector.signer }, callback);
}

export async function getNodeUsedResources(nodeId) {
  const res = await axios.get(`${config.gridproxyUrl}nodes/${nodeId}`, {
    timeout: 1000,
  });

  if (res.status === 200) {
    if (res.data == "likely down") {
      throw Error("likely down");
    } else {
      return res.data.capacity.used_resources;
    }
  }
}
