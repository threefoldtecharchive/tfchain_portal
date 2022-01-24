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

  const filteredNodes = parsedNodes.filter(node => farmIDs.includes(node.farm_id))

  const farmNodes = await filteredNodes.map(async node => {
    const twin = await getTwin(api, node.twin_id)
    node.accountId = twin.account_id
    node.balance = await getBalance(api, twin.account_id)
    node.balance = node.balance / 1e7

    try {
      const res = await getNodesUptime(node.id)
      const { uptime, updatedAt } = res
      node.uptime = uptime
      node.updatedAt = updatedAt
    } catch (error) {
      node.uptime = 0
    }

    try {
      node.usedResources = await getNodeUsedResources(node.id)
    } catch (error) {
      node.usedResources = {
        sru: 0,
        hru: 0,
        mru: 0,
        cru: 0,
      }
    }

    return node
  })

  return await Promise.all(farmNodes)
}

export async function getNodesUptime (nodeId) {
  const res = await axios.post(config.graphqlUrl, {
    query: `{ nodes(where: {nodeId_eq:${nodeId}}) { uptime, updatedAt }}`,
    operation: 'getNode'
  }, { timeout: 1000 })

  return res.data.data.nodes[0]
}

export async function getNodeUsedResources (nodeId) {
  const res = await axios.get(`${config.gridproxyUrl}nodes/${nodeId}`, { timeout: 1000 })

  return res.data.capacity.used
}