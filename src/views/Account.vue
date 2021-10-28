<template>
  <v-container>
    <Twin />
    <Farm />
    <v-overlay
      :absolute="true"
      :value="!activated"
    >
      <p>Activate your account in order to continue</p>
      <v-btn 
        color="secondary" 
        @click="activateAccount()"
        :loading="loadingActivation"
      >
        Activate Account
      </v-btn>
    </v-overlay>
  </v-container>
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
      return this.$route.params.account.balance > 0 || this.activationCompleted
    }
  },

  data () {
    return {
      loadingActivation: false,
      activationCompleted: false,
      balance: this.$route.params.account.balance
    }
  },

  ...mapGetters(['api']),

  async mounted () {
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
</style>
