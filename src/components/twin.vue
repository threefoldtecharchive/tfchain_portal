<template>
  <div v-if="twin && twin.id !== 0">
    
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div class="title">
          <h3>Balance</h3>
        </div>
        <div class="inner">
          <div class="balance">
            <p>{{ balance }} TFT</p>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="button-group">
          <Deposit :twinID="this.twinID"/>
          <Withdraw :balance="this.balance" :withdraw="this.withdraw" :loading="this.loadingWithdraw" />
          <v-btn 
            v-if="network === 'dev' && balance < 100"
            color="primary"
            dark
            @click="getMoreTft"
            :loading="loadingGetMoreTft"
          >
            Get More TFT
          </v-btn>
        </div>
      </v-col>
    </v-row>

    
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div class="title">
          <h3>Twin</h3>
        </div>
        <div class="twinInfo">
          <p>ID: {{twinID}}</p>
          <p>IP: {{ decodeHex(twin.ip) }}</p>
          <p>Address: {{ twin.account_id }}</p>
        </div>
        <v-divider></v-divider>
        <div class="button-group">
          <EditTwin
            :edit="editTwin"
            :loading="loadingCreateTwin"
            :twinIP="decodeHex(twin.ip)"
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
import { withdraw } from '../lib/bridge'
import { getMoreFunds } from '../lib/activation'
import { hex2a } from '../lib/util'

export default {
  name: 'Twin',

  components: {
    CreateTwin,
    EditTwin,
    Deposit,
    Withdraw
  },

  computed: {
    ...mapGetters(['api'])
  },

  async mounted () {
    if (!this.$store.state.api) return
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
      loadingWithdraw: false,
      network: this.$store.state.network,
      loadingGetMoreTft: false,
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

.account p {
  color: white;
}

h3 {
  color: white;
}

.title {
  margin-top: 0;
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
