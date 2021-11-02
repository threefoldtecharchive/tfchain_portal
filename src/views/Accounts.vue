<template>
  <v-container>
    <div v-if="accounts.length === 0" class="init">
      <h2 >You need the polkadot JS extension and an account in order to continue</h2>
      <a href="https://polkadot.js.org/extension/" target="blank">https://polkadot.js.org/extension/</a>
    </div>
    <div v-else>
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
            <v-btn  
              color="primary" 
              @click="routeToAccount(account.address, account)"
            >
              Manage
            </v-btn>
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
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

  export default {
    name: 'Accounts',
    computed: mapState([
      'accounts',
      'snackbar'
    ]),
    methods: {
      routeToAccount(address, account) {
        this.$router.push({ name: 'Account', params: { accountID: address, account: account } })
      },
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
.init {
  margin-top: 10em;
  text-align: center;
}
</style>