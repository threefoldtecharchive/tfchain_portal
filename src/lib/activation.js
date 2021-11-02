import axios from "axios";
import config from '../config'

export async function activateThroughActivationService (substrateAccountID) {
  return axios.post(`${config.activationServiceUrl}/activation/activate`, {
    substrateAccountID
  })
}