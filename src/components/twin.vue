<template>
  <div v-if="twin && twin.id !== 0">

    <v-row class="no-gutters">
      <div class="balance">
        <h2>{{balance.toFixed(2)}} TFT</h2>
        <h3 v-if="network !== 'test'">$ {{balanceInUSD.toFixed(2)}}</h3>
      </div>
    </v-row>

    <v-row>
      <v-col xs="6" md="6">
        <v-card class="card1" @click="openDeposit=true">
          <v-card-title>
            Bridge TFT from Stellar
          </v-card-title>
          <div>
            <v-icon>mdi-arrow-down-circle-outline</v-icon>
            <Deposit
              :twinID="this.twinID"
              :fee="this.depositFee"
              :open="this.openDeposit"
              :close="() => this.openDeposit = false"
            />
          </div>
        </v-card>
      </v-col>
      <v-col xs="6" md="6">
        <v-card class="card2" @click="openWithdraw=true">
          <v-card-title>
            Bridge TFT to Stellar
          </v-card-title>
          <div>
            <v-icon>mdi-arrow-up-circle-outline</v-icon>
            <Withdraw
              :balance="this.balance"
              :withdraw="this.withdraw"
              :loading="this.loadingWithdraw"
              :fee="this.withdrawFee"
              :open="this.openWithdraw"
              :close="() => this.openWithdraw = false"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div class="title">
          <h3>Twin</h3>
          <v-icon @click="openEditTwin=true">mdi-pencil</v-icon>
        </div>
        <div class="twinInfo">
          <p>ID: {{twinID}}</p>
          <p>IP: {{ decodeHex(twin.ip) }}</p>
          <p>Address: {{ twin.account_id }}</p>
        </div>
        <div class="button-group">
          <EditTwin
            :open="openEditTwin"
            :edit="editTwin"
            :loading="loadingCreateTwin"
            :twinIP="decodeHex(twin.ip)"
            :close="() => this.openEditTwin = false"
          />
        </div>
      </v-col>
    </v-row>
  </div>
  <div v-else>
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
import CreateTwin from './twins/createTwin.vue'
import EditTwin from './twins/editTwin.vue'
import Deposit from './bridge/deposit.vue'
import Withdraw from './bridge/withdraw.vue'
import { getTwin, getTwinID, createTwin, updateTwin } from '../lib/twin'
import { getBalance } from '../lib/balance'
import { withdraw, getDepositFee, getWithdrawFee } from '../lib/bridge'
import { getMoreFunds } from '../lib/activation'
import { hex2a } from '../lib/util'
import config from '../config'
import axios from 'axios'

export default {
  name: 'Twin',

  components: {
    CreateTwin,
    EditTwin,
    Deposit,
    Withdraw
  },

  ...mapGetters(['api']),

  async mounted () {
    if (!this.$store.state.api) return
    this.twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.twin = await getTwin(this.$store.state.api, this.twinID)
    this.balance = await getBalance(this.$store.state.api, this.$route.params.accountID) / 1e7
    this.depositFee = await getDepositFee(this.$store.state.api)
    this.withdrawFee = await getWithdrawFee(this.$store.state.api)
    if (config.network !== 'test') {
      const res = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=3ft&tsyms=USD')
      this.balanceInUSD = res.data.USD * this.balance
    }
  },

  data () {
    return {
      twinID: 0,
      twin: undefined,
      loadingCreateTwin: false,
      balance: 0,
      balanceInUSD: 0,
      loadingWithdraw: false,
      network: config.network,
      loadingGetMoreTft: false,
      depositFee: 0,
      withdrawFee: 0,
      openDeposit: false,
      openWithdraw: false,
      openEditTwin: false,
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
        switch (status.type) {
          case 'Ready': this.$toasted.show(`Transaction submitted`)
        }
      
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
    editTwin (ip) {
      this.loadingCreateTwin = true
      updateTwin(this.$route.params.accountID, this.$store.state.api, ip, (res) => {
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
            if (section === 'tfgridModule' && method === 'TwinUpdated') {
              this.$toasted.show('Twin updated!')
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
        switch (status.type) {
          case 'Ready': this.$toasted.show(`Transaction submitted`)
        }
      
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`)
      
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if (section === 'tftBridgeModule' && method === 'BurnTransactionCreated') {
              this.$toasted.show('Withdraw sumbitted!')
              this.loadingWithdraw = false
              this.openWithdraw = false
              getBalance(this.$store.state.api, this.$route.params.accountID)
                .then(balance => {
                  this.balance = balance / 1e7
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Withdraw failed!')
              this.loadingWithdraw = false
              this.openWithdraw = false
            }
          })
        }
      })
    },
    getMoreTft () {
      this.loadingGetMoreTft = true
      getMoreFunds(this.$route.params.accountID, this.$store.state.api, (res) => {
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
            if (section === 'balances' && method === 'Transfer') {
              this.$toasted.show('Get more TFT sumbitted!')
              this.loadingGetMoreTft = false
              getBalance(this.$store.state.api, this.$route.params.accountID)
                .then(balance => {
                  this.balance = balance / 1e7
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Get more TFT failed!')
              this.loadingGetMoreTft = false
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
  /* background: linear-gradient(90deg, rgba(88,66,242,1) 35%, rgba(109,85,230,1) 100%); */
  background: #252c48;
  height: 100%;
  width: 100%;
  margin-bottom: 1em;
  border-radius: 0.3em;
  padding: 1em !important;
}

.balance {
  margin-top: 2em;
  margin-bottom: 1em;
  width: 100%;
  text-align: center;
}

.balance h2 {
  font-size: 32px;
}

.card1 {
  background: linear-gradient(90deg, rgba(129,22,240,1) 53%, rgba(159,78,244,1) 100%);
}

.card2 {
  background: linear-gradient(90deg, rgba(88,66,242,1) 35%, rgba(109,85,230,1) 100%);
}

.v-card {
  margin-bottom: 1em;
  padding: 1em !important;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.v-card__text {
  align-self: flex-end !important;
  /* width: 30% !important; */
}

.v-card i {
  font-size: 5em;
  align-self: flex-end;
  opacity: 0.3;
}

h3 {
  color: white;
}

.title {
  margin-top: 0;
  display: flex;
  justify-content: space-between;
}

.title i {
  color: #8116F0 !important;
  font-size: 30px;
}

.inner {
  padding-top: 1em;
  margin-bottom: 1em;
}

.inner button {
  width: 100% !important;
}

.inner p {
  text-align: center;
  font-size: 22px;
}

.twinInfo {
  margin-top: 1em;
  padding-bottom: 1em;
}

.account p {
  margin-bottom: 0px !important;
}

.button-group {
  margin-top: 1em;
  display: flex;
  justify-content: space-evenly;
}
</style>
