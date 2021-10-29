<template>
  <div v-if="twin && twin.id !== 0">
    <h3>Balance</h3>
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div>
          <p>Balance: {{ balance }} TFT</p>
          <div class="actions">
            <Deposit :twinID="this.twinID"/>
            <Withdraw :balance="this.balance" :withdraw="this.withdraw" :loading="this.loadingWithdraw" />
          </div>
        </div>
      </v-col>
    </v-row>

    <h3>Twins</h3>
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div>
          <p>twinID: {{twinID}}</p>
          <p>ip: {{ decodeHex(twin.ip) }}</p>
          <p>accountID: {{ twin.account_id }}</p>
          <div class="actions">
            <!-- <v-btn color="primary" @click="routeToAccount(account.address)">Enter</v-btn> -->
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <p v-if="!loadingCreateTwin">No Twin yet</p>
    <div class="actions">
      <CreateTwin
        :create="createTwinFromAccount"
        :loading="loadingCreateTwin"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateTwin from './createTwin.vue'
import Deposit from './bridge/deposit.vue'
import Withdraw from './bridge/withdraw.vue'
import { getTwin, getTwinID, createTwin } from '../lib/twin'
import { getBalance } from '../lib/balance'
import { withdraw } from '../lib/bridge'
import { hex2a } from '../lib/util'

export default {
  name: 'Twin',

  components: {
    CreateTwin,
    Deposit,
    Withdraw
  },

  ...mapGetters(['api']),

  async mounted () {
    this.twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.twin = await getTwin(this.$store.state.api, this.twinID)
    this.balance = await getBalance(this.$store.state.api, this.$route.params.accountID) / 1e7
  },

  data () {
    return {
      twinID: 0,
      twin: undefined,
      loadingCreateTwin: false,
      balance: 0,
      loadingWithdraw: false
    }
  },

  methods: {
    decodeHex (input) {
      return hex2a(input)
    },
    createTwinFromAccount (ip) {
      this.loadingCreateTwin = true
      createTwin(this.$route.params.accountID, this.$store.state.api, ip, (res) => {
        console.log(res)
        if (res instanceof Error) {
          console.log(res)
          return
        }

        const { events = [], status } = res
        console.log(`Current status is ${status.type}`)
        this.$toasted.show(`Current status is ${status.type}`)
      
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`)
      
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if (section === 'tfgridModule' && method === 'TwinStored') {
              this.$toasted.show('Twin created!')
              const twinStoredEvent = data[0]
              getTwin(this.$store.state.api, twinStoredEvent.id)
                .then(twin => {
                  this.twin = twin
                  this.twinID = twin.id
                  this.loadingCreateTwin = false
                  getBalance(this.$store.state.api, this.$route.params.accountID)
                    .then(balance => {
                      this.balance = balance / 1e7
                    })
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Twin creation failed!')
              this.loadingCreateTwin = false
            }
          })
        }
      })
    },
    withdraw (target, amount) {
      this.loadingWithdraw = true
      withdraw(this.$route.params.accountID, this.$store.state.api, target, amount, (res) => {
        console.log(res)
        if (res instanceof Error) {
          console.log(res)
          return
        }

        const { events = [], status } = res
        console.log(`Current status is ${status.type}`)
        this.$toasted.show(`Current status is ${status.type}`)
      
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`)
      
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if (section === 'tftBridgeModule' && method === 'BurnTransactionCreated') {
              this.$toasted.show('Withdraw sumbitted!')
              this.loadingWithdraw = false
              getBalance(this.$store.state.api, this.$route.params.accountID)
                .then(balance => {
                  this.balance = balance / 1e7
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Withdraw failed!')
              this.loadingWithdraw = false
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.account {
  background-color: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
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
.actions {
  display: flex !important;
  justify-content: space-around !important;
  margin-top: 1em;
}

.actions button {
  margin-right: 1em;
}
</style>
