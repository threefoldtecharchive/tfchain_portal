import axios from "axios";

export async function activateThroughActivationService (substrateAccountID) {
  return axios.post('https://tfchain.dev.threefold.io/activation/activate', {
    substrateAccountID
  })
}