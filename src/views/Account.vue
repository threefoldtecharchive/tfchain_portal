<template>
  <div class="accounts-app">

  <v-navigation-drawer
    permanent
    height="100vh"
    v-if="activated"
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
    <Twin v-if="selectedItem === 'twins' && activated" />
    <Farm v-if="selectedItem === 'farms' && activated" />
    <TermsAndConditions
      :open="!activated"
      :accept="acceptTermsAndConditions"
      :documentLink="documentLink"
      :loading="loadingActivation"
    />
  </v-container>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Farm from '../components/farm.vue'
import Twin from '../components/twin.vue'
import TermsAndConditions from './TermsAndConditions.vue'
import { activateThroughActivationService, acceptTermsAndCondition, userAcceptedTermsAndConditions } from '../lib/activation' 
import { getBalance } from '../lib/balance'
import axios from 'axios'
import blake from 'blakejs'

const DOCUMENT_RAW_LINK = 'https://library.threefold.me/info/legal/tfgrid/terms_conditions_tfgrid3'

export default {
  name: 'Account',

  components: {
    Farm,
    Twin,
    TermsAndConditions
  },
  
  data () {
    return {
      activated: true,
      selectedItem: 'twins',
      loadingActivation: false,
      balance: 0,
      documentLink: 'https://library.threefold.me/info/legal/#/tfgrid/terms_conditions_tfgrid3',
      documentHash: ''
    }
  },

  ...mapGetters(['api']),

  async mounted () {
    if (!this.$store.state.api) return
    const api = await this.$store.state.api
    this.balance = await getBalance(api, this.$route.params.accountID)
    let document = await axios.get(DOCUMENT_RAW_LINK)
    this.documentHash = blake.blake2bHex(document.data)
    const hasAcceptedTandC = await userAcceptedTermsAndConditions(api, this.$route.params.accountID, this.documentLink, this.documentHash)

    if (this.balance === 0 || !hasAcceptedTandC) {
      this.activated = false
    }
  },

  methods: {
    acceptTermsAndConditions() {
      this.loadingActivation = true
      activateThroughActivationService(this.$route.params.accountID)
        .then(() => {
          setTimeout(() => {
            // todo, hash document content
            acceptTermsAndCondition(this.$store.state.api, this.$route.params.accountID, this.documentLink, this.documentHash, (res) => {
              console.log(res)
              if (res instanceof Error) {
                console.log(res)
                return
              }

              const { events = [], status } = res
              console.log(`Current status is ${status.type}`)
              switch (status.type) {
                case 'Ready': this.$toasted.show(`Transaction submitted`)
              }
            
              if (status.isFinalized) {
                console.log(`Transaction included at blockHash ${status.asFinalized}`)
            
                // Loop through Vec<EventRecord> to display all events
                events.forEach(({ phase, event: { data, method, section } }) => {
                  console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
                  if (section === 'system' && method === 'ExtrinsicSuccess') {
                    this.$toasted.show('Terms and Conditions accepted!')
                    this.loadingActivation = false
                    this.activated = true
                    this.$store.dispatch('getAccounts')
                  } else if (section === 'system' && method === 'ExtrinsicFailed') {
                    this.$toasted.show('Failed to accept Terms and Conditions!')
                    this.loadingActivation = false
                  }
                })
              }
            })
          }, 1500)
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
