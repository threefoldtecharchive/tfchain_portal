<template>
  <div class="accounts-app">

  <v-navigation-drawer
    permanent
    height="100vh"
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6">
          Account Management
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ this.$route.params.accountID }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
      dense
      nav
    >
      <!-- <v-list-item link @click="selectedItem = 'wallet'">
        <v-list-item-icon>
          <v-icon>mdi-wallet</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Wallet</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
      <v-list-item link @click="selectedItem = 'twins'">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Twins</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="selectedItem = 'farms'">
        <v-list-item-icon>
          <v-icon>mdi-account-multiple</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Farms</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  
  <v-container>
    <Twin v-if="selectedItem === 'twins'" />
    <Farm v-if="selectedItem === 'farms'" />
    <v-overlay
      :absolute="true"
      :value="!activated"
    >
      <div class="overlay">
        <p>Activate your account in order to continue</p>
        <v-btn 
          color="secondary" 
          @click="activateAccount()"
          :loading="loadingActivation"
        >
          Activate Account
        </v-btn>
      </div>
    </v-overlay>
  </v-container>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Farm from '../components/farm.vue'
import Twin from '../components/twin.vue'
import { activateThroughActivationService } from '../lib/activation' 
// import { getBalance } from '../lib/balance'

export default {
  name: 'Account',

  components: {
    Farm,
    Twin
  },

  computed: {
    activated () {
      if (this.$route.params.account) {
        return this.$route.params.account.balance > 0 || this.activationCompleted
      } else {
        return false
      }
    }
  },

  data () {
    return {
      selectedItem: 'twins',
      loadingActivation: false,
      activationCompleted: false,
      balance: this.$route.params.account.balance || 0
    }
  },

  ...mapGetters(['api']),

  async mounted () {
    if (!this.$store.state.api) this.$router.push('/')
    this.$store.dispatch('getAPI')
  },

  methods: {
    activateAccount() {
      this.loadingActivation = true
      activateThroughActivationService(this.$route.params.accountID)
        .then(() => {
          setTimeout(() => {
            this.loadingActivation = false
            this.activationCompleted = true
            this.$store.dispatch('getAccounts')}
          , 7000)
        })
        .catch(err => {
          this.loadingActivation = false
          console.log(err)
        })
    }
  },
}
</script>
<style scoped>
.accounts-app {
  display: flex;
  flex-direction: row;
}
.account {
  background-color: rgb(255, 255, 255);
  height: 100%;
  margin-top: 0.2em;
  margin-bottom: 1em;
  border-radius: 0.3em;
  padding: 2em !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.account p {
  margin-bottom: 0px !important;
}
.overlay button {
  width: 100%;
}
</style>
