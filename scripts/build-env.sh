#!/bin/sh

if [ -d dist ] 
then
    file="dist/config.js"
else
    file="config.js"
fi

if [ -z ${VUE_APP_API_URL+x} ]
then
    echo 'Error! $VUE_APP_API_URL is required.'
    exit 64
fi

if [ -z ${VUE_APP_STELLAR_HORIZON_URL+x} ]
then
    echo 'Error! $VUE_APP_STELLAR_HORIZON_URL is required.'
    exit 64
fi

if [ -z ${VUE_APP_TFT_ASSET_ISSUER+x} ]
then
    echo 'Error! $VUE_APP_TFT_ASSET_ISSUER is required.'
    exit 64
fi

if [ -z ${VUE_APP_BRIDGE_TFT_ADDRESS+x} ]
then
    echo 'Error! $VUE_APP_BRIDGE_TFT_ADDRESS is required.'
    exit 64
fi

if [ -z ${VUE_APP_ACTIVATION_SERVICE_URL+x} ]
then
    echo 'Error! $VUE_APP_ACTIVATION_SERVICE_URL is required.'
    exit 64
fi

configs="
window.configs = window.configs || {};
window.VUE_APP_API_URL = '$VUE_APP_API_URL';
window.VUE_APP_STELLAR_HORIZON_URL = '$VUE_APP_STELLAR_HORIZON_URL';
window.VUE_APP_TFT_ASSET_ISSUER = '$VUE_APP_TFT_ASSET_ISSUER';
window.VUE_APP_BRIDGE_TFT_ADDRESS = '$VUE_APP_BRIDGE_TFT_ADDRESS';
window.VUE_APP_ACTIVATION_SERVICE_URL = '$VUE_APP_ACTIVATION_SERVICE_URL';
"

if [ -e $file ]
then
    rm $file
fi

echo $configs > $file