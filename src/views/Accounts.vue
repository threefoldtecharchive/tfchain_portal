<template>
  <v-container>
    <h2>Connected Accounts</h2>
    <v-row v-for="account in accounts" :key="account.address" class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div>
          <p>name: {{ account.meta.name }}</p>
          <p>address: {{account.address}}</p>
          <p>type: {{account.type}}</p>
          <p>balance: {{account.balance}} TFT</p>
        </div>
        <div class="actions">
          <v-btn v-if="account.balance !== 0" color="primary" @click="routeToAccount(account.address)">Enter</v-btn>
          <v-btn v-else color="secondary" @click="activateAccount(account.address)">Activate Account</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-snackbar
      :value="$store.state.snackbar"
      :timeout="10000"
      absolute
      bottom
      color="success"
      outlined
      right
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { activateThroughActivationService } from '../lib/activation' 

  export default {
    name: 'Accounts',
    computed: mapState([
      'accounts',
      'snackbar'
    ]),
    methods: {
      routeToAccount(address) {
        this.$router.push({ name: 'Account', params: { accountID: address } })
      },
      activateAccount(address) {
        this.snackbarMessage = 'Activation Success!'
        activateThroughActivationService(address)
          .then(() => {
            setTimeout(() => this.$store.dispatch('getAccounts'), 7000)
          })
          .catch(err => {
            console.log(err)
            this.snackbarMessage = 'Activation failed!'
          })
      }
    },
    mounted () {
      this.fetchAccountsInterval = setInterval(() => {
        this.$store.dispatch('getAccounts')
      }, 10000)
    },
    destroyed () {
      clearInterval(this.fetchAccountsInterval)
    },
    data () {
      return {
        snackbarMessage: 'Successfully connected',
        fetchAccountsInterval: undefined
      }
    }
  }
</script>
<style scoped>
.account {
  background-color: rgb(255, 255, 255);
  height: 100%;
  margin-top: 1em;
  border-radius: 0.3em;
  padding: 2em !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.account p {
  margin-bottom: 0px !important;
}
</style>