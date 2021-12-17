#!/bin/sh

required_vars=(
    VUE_APP_API_URL
    VUE_APP_TEST_URL_WSS
    VUE_APP_DEV_STELLAR_HORIZON_URL
    VUE_APP_TEST_STELLAR_HORIZON_URL
    VUE_APP_DEV_TFT_ASSET_ISSUER
    VUE_APP_TEST_TFT_ASSET_ISSUE
    VUE_APP_DEV_BRIDGE_TFT_ADDRESS
    VUE_APP_TEST_BRIDGE_TFT_ADDRESS_TEST
    VUE_APP_DEV_ACTIVATION_SERVICE_URL
    VUE_APP_TEST_ACTIVATION_SERVICE_URL
    VUE_APP_DEV_EXPLORER_URL
    VUE_APP_TEST_EXPLORER_URL
    )

missing_vars=()
for i in "${required_vars[@]}"
do
    test -n "${!i:+y}" || missing_vars+=("$i")
done
if [ ${#missing_vars[@]} -ne 0 ]
then
    echo "The following variables are not set, but should be:" >&2
    printf ' %q\n' "${missing_vars[@]}" >&2
    exit 1
fi

if [ -d dist ] 
then
    file="dist/config.js"
else
    file="config.js"
fi

configs="
window.configs = window.configs || {};
window.VUE_APP_API_URL = '$VUE_APP_API_URL';
window.VUE_APP_STELLAR_HORIZON_URL = '$VUE_APP_STELLAR_HORIZON_URL';
window.VUE_APP_TFT_ASSET_ISSUER = '$VUE_APP_TFT_ASSET_ISSUER';
window.VUE_APP_BRIDGE_TFT_ADDRESS = '$VUE_APP_BRIDGE_TFT_ADDRESS';
window.VUE_APP_ACTIVATION_SERVICE_URL = '$VUE_APP_ACTIVATION_SERVICE_URL';
window.VUE_APP_EXPLORER_URL = '$VUE_APP_EXPLORER_URL';
window.VUE_APP_NETWORK = '$VUE_APP_NETWORK';
"

echo $configs > $file