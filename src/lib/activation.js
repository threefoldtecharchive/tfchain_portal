import axios from "axios";

const API_URL = process.env.API_URL || 'http://localhost:3000'

export async function activateThroughActivationService (substrateAccountID) {
  return axios.post(`${API_URL}/activation/activate`, {
    substrateAccountID
  })
}