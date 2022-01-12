import {
  web3FromAddress,
} from '@polkadot/extension-dapp'

export async function transfer (address, api, target, amount, callback) {
  const injector = await web3FromAddress(address)
  api.tx.balances
    .transfer(target, amount*1e7)
    .signAndSend(address, { signer: injector.signer }, callback)
}
