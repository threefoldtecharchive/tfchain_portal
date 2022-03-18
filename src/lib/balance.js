import axios from 'axios'
import config from '../config'

export async function getBalance (api, address) {
  const { data: balance } = await api.query.system.account(address)

  return balance.free.toJSON()
}

export async function getTransactionHistoryFrom (address) {
  let done = false
  let allTransfers = []
  let offset = 100

  while (!done) {
    const res = await axios.post(config.graphqlUrl, {
      query: `{ transfers(where: {from_eq:"${address}"}, limit: 100, offset: ${offset}) { from, to, timestamp, amount }}`,
      operation: 'getTransaction'
    }, { timeout: 1000 })

    const transfers = res.data.data.transfers
    allTransfers = allTransfers.concat(transfers)
    console.log(allTransfers)
    offset += 100

    if (transfers.length < 100) {
      done = true
    }
  }

  return allTransfers
}

export async function getTransactionHistoryTo (address) {
  let done = false
  let allTransfers = []
  let offset = 100

  while (!done) {
    const res = await axios.post(config.graphqlUrl, {
      query: `{ transfers(where: {to_eq:"${address}"}, limit: 100, offset: ${offset}) { from, to, timestamp, amount }}`,
      operation: 'getTransaction'
    }, { timeout: 1000 })

    const transfers = res.data.data.transfers
    allTransfers = allTransfers.concat(transfers)
    console.log(allTransfers)
    offset += 100

    if (transfers.length < 100) {
      done = true
    }
  }

  return allTransfers
}