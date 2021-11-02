import axios from "axios";

const URL = process.env.VUE_APP_ACTIVATION_SERVICE_URL || 'http://localhost:3000'

export async function activateThroughActivationService (substrateAccountID) {
  return axios.post(`${URL}/activation/activate`, {
    substrateAccountID
  })
}