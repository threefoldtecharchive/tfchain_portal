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
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Twin</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="selectedItem = 'farms'">
        <v-list-item-icon>
          <v-icon>mdi-barley</v-icon>
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
import { getBalance } from '../lib/balance'

export default {
  name: 'Account',

  components: {
    Farm,
    Twin
  },
  
  data () {
    return {
      activated: true,
      selectedItem: 'twins',
      loadingActivation: false,
      balance: 0
    }
  },

  computed: {
    ...mapGetters(['config'])
  },

  async mounted () {
    if (!this.$store.state.api) return
    const api = await this.$store.state.api
    this.balance = await getBalance(api, this.$route.params.accountID)
    console.log(this.balance)
    if (this.balance === 0) {
      this.activated = false
    }
  },

  methods: {
    activateAccount() {
      this.loadingActivation = true
      activateThroughActivationService(this.$store.state.config.activationServiceUrl, this.$route.params.accountID)
        .then(() => {
          setTimeout(() => {
            this.loadingActivation = false
            this.activated = true
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
.v-navigation-drawer {
  background: #252c48 !important;
}
.v-list-item__title {
  color:white !important;
}
.v-list-item__subtitle {
  color:white !important;
}
.v-list-item__icon {
  color:white !important;
}
.v-icon {
  color:white;
}
</style>
