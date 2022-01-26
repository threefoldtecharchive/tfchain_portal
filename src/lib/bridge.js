import {
  web3FromAddress,
} from '@polkadot/extension-dapp';

export async function withdraw (address, api, target, amount, callback) {
  try {
    const injector = await web3FromAddress(address)
    return api.tx.tftBridgeModule
      .swapToStellar(target, amount*1e7)
      .signAndSend(address, { signer: injector.signer }, callback)
  } catch (error) {
    console.log(`err while trying to get injector ${error}`)
  }
}

export async function getDepositFee (api) {
  const fee = await api.query.tftBridgeModule.depositFee()
  return fee.toNumber() / 1e7
}

export async function getWithdrawFee (api) {
  const fee = await api.query.tftBridgeModule.withdrawFee()
  return fee.toNumber() / 1e7
}