<template>
  <v-container class="container">
    <div v-if="accounts.length === 0" class="init">
      <h2 >You need the polkadot JS extension and an account in order to continue</h2>
      <a href="https://polkadot.js.org/extension/" target="blank">https://polkadot.js.org/extension/</a>
    </div>
    <div v-else class="main">
      <h2>Connected Accounts</h2>
      <v-row v-for="account in accounts" :key="account.address" class="no-gutters">
        <v-col cols="12" sm="12" class="account" @click="routeToAccount(account.address, account)">
          <div>
            <h3>{{ account.meta.name }}</h3>
            <h3>{{account.address}}</h3>
          </div>
          <div>
            <v-icon>mdi-chevron-right</v-icon>
          </div>
            <!-- <p>balance: {{account.balance}} TFT</p> -->

          <!-- <div class="actions">
            <v-btn  
              @click="routeToAccount(account.address, account)"
            >
              Manage
            </v-btn>
          </div> -->
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
.main {
  width: 60vw;
  margin: auto;
  margin-top: 1em;
}
.account {
  background: #8116F0;
  /* background: linear-gradient(90deg, rgba(88,66,242,1) 35%, rgba(109,85,230,1) 100%); */
  height: 100%;
  border-radius: 0.3em;
  padding: 2em !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: auto;
  margin-top: 1em;
  cursor: pointer;
}
h2 {
  color: white !important;
}
h3 {
  color: white !important;
}
.v-icon {
  color: white;
  font-size: 3em;
}
.account p {
  margin-bottom: 0px !important;
  color: white;
}
.init {
  margin-top: 10em;
  text-align: center;
}
</style>