const config = {
  wsUrl: window.VUE_APP_API_URL || process.env.VUE_APP_API_URL,
  horizonUrl: window.VUE_APP_STELLAR_HORIZON_URL || process.env.VUE_APP_STELLAR_HORIZON_URL,
  tftAssetIssuer: window.VUE_APP_TFT_ASSET_ISSUER || process.env.VUE_APP_TFT_ASSET_ISSUER,
  bridgeTftAddress: window.VUE_APP_BRIDGE_TFT_ADDRESS || process.env.VUE_APP_BRIDGE_TFT_ADDRESS,
  activationServiceUrl: window.VUE_APP_ACTIVATION_SERVICE_URL || process.env.VUE_APP_ACTIVATION_SERVICE_URL,
  explorerUrl: window.VUE_APP_EXPLORER_URL || process.env.VUE_APP_EXPLORER_URL,
  graphqlUrl: window.VUE_APP_GRAPHQL_URL || process.env.VUE_APP_GRAPHQL_URL,
  gridproxyUrl: window.VUE_APP_GRIDPROXY_URL || process.env.VUE_APP_GRIDPROXY_URL,
  network: window.VUE_APP_NETWORK || process.env.VUE_APP_NETWORK
}

export default config