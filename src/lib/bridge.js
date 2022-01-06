import {
  web3FromAddress,
} from '@polkadot/extension-dapp';

export async function withdraw (address, api, target, amount, callback) {
  const injector = await web3FromAddress(address)
  api.tx.tftBridgeModule
    .swapToStellar(target, amount*1e7)
    .signAndSend(address, { signer: injector.signer }, callback)
}

export async function getDepositFee (api) {
  const fee = await api.query.tftBridgeModule.depositFee()
  return fee.toNumber() / 1e7
}

export async function getWithdrawFee (api) {
  const fee = await api.query.tftBridgeModule.withdrawFee()
  return fee.toNumber() / 1e7
}