import { hex2a } from './util'
import { getTwin } from './twin'
import { getBalance } from './balance'
import config from '../config'

import axios from 'axios'

export async function getNodesByFarmID (api, farms) {
  const farmIDs = farms.map(farm => farm.id)
  const nodes = await api.query.tfgridModule.nodes.entries()

  const parsedNodes = nodes.map(node => {
    const parsedNode = node[1].toJSON()
    parsedNode.country = hex2a(parsedNode.country)
    parsedNode.city = hex2a(parsedNode.city)

    return parsedNode
  })

  console.log(parsedNodes)

  const filteredNodes = parsedNodes.filter(node => farmIDs.includes(node.farm_id))

  const farmNodes = await filteredNodes.map(async node => {
    const twin = await getTwin(api, node.twin_id)
    node.accountId = twin.account_id
    node.balance = await getBalance(api, twin.account_id)
    node.balance = node.balance / 1e7

    node.uptime = await getNodesUptime(node.id)
    node.usedResources = await getNodeUsedResources(node.id)

    console.log(node)

    return node
  })

  return Promise.all(farmNodes)
}

export async function getNodesUptime (nodeId) {
  const res = await axios.post(config.graphqlUrl, {
    query: `{ nodes(where: {nodeId_eq:${nodeId}}) { uptime }}`,
    operation: 'getNode'
  })

  return res.data.data.nodes[0].uptime
}

export async function getNodeUsedResources (nodeId) {
  const res = await axios.get(`${config.gridproxyUrl}nodes/${nodeId}`)

  return res.data.capacity.used
}