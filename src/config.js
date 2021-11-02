const config = {
  wsUrl: window.VUE_APP_API_URL || process.env.VUE_APP_API_URL,
  horizonUrl: window.VUE_APP_STELLAR_HORIZON_URL || process.env.VUE_APP_STELLAR_HORIZON_URL,
  tftAssetIssuer: window.VUE_APP_TFT_ASSET_ISSUER || process.env.VUE_APP_TFT_ASSET_ISSUER,
  bridgeTftAddress: window.VUE_APP_BRIDGE_TFT_ADDRESS || process.env.VUE_APP_BRIDGE_TFT_ADDRESS,
  activationServiceUrl: window.VUE_APP_ACTIVATION_SERVICE_URL || process.env.VUE_APP_ACTIVATION_SERVICE_URL,
}

export default config