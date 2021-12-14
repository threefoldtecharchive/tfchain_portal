
//import store from './plugins/vuex'

const CONFIG = {
  wsUrl: window.VUE_APP_DEV_URL_WSS || process.env.VUE_APP_DEV_URL_WSS,
  horizonUrl: window.VUE_APP_DEV_STELLAR_HORIZON_URL || process.env.VUE_APP_DEV_STELLAR_HORIZON_URL,
  tftAssetIssuer: window.VUE_APP_DEV_TFT_ASSET_ISSUER || process.env.VUE_APP_DEV_TFT_ASSET_ISSUER,
  bridgeTftAddress: window.VUE_APP_DEV_BRIDGE_TFT_ADDRESS || process.env.VUE_APP_DEV_BRIDGE_TFT_ADDRESS,
  activationServiceUrl: window.VUE_APP_DEV_ACTIVATION_SERVICE_URL || process.env.VUE_APP_DEV_ACTIVATION_SERVICE_URL,
  explorerUrl: window.VUE_APP_DEV_EXPLORER_URL || process.env.VUE_APP_DEV_EXPLORER_URL,
}

export function getConfig(network) {
  let newConfig = CONFIG
  //var tmp_config = Object.entries(CONFIG).forEach([key, value] => {value.replace(new RegExp(`DEV`, 'g'), network.toUpperCase())})
  //console.log('tmp_config', tmp_config)

  console.log('network', network)
  console.log('config', CONFIG)

  const url = window[`VUE_APP_${network.toUpperCase()}_URL_WSS`] || process.env[`VUE_APP_${network.toUpperCase()}_URL_WSS`]
  console.log(`url is now ${url}`)

  newConfig.wsUrl = process.env[`VUE_APP_${network.toUpperCase()}_URL_WSS`]
  newConfig.horizonUrl = process.env[`VUE_APP_${network.toUpperCase()}_STELLAR_HORIZON_URL`]
  newConfig.tftAssetIssuer = process.env[`VUE_APP_${network.toUpperCase()}_TFT_ASSET_ISSUER`]
  newConfig.bridgeTftAddress = process.env[`VUE_APP_${network.toUpperCase()}_BRIDGE_TFT_ADDRESS`]
  newConfig.activationServiceUrl = process.env[`VUE_APP_${network.toUpperCase()}_ACTIVATION_SERVICE_URL`]
  newConfig.explorerUrl = process.env[`VUE_APP_${network.toUpperCase()}_EXPLORER_URL`]
  

  console.log('config is now', newConfig)
  return newConfig
}



