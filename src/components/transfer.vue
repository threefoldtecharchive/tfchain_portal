<template>
  <div>
    <div class="container"> 
      <v-card class="card">
        <v-card-title class="text-h5">
          Transfer TFT
        </v-card-title>

        <v-card-text>
          <span class="text-muted">Transfer TFT from your account to another account on TF Chain</span>
          <v-text-field
            label="Recipient address"
            v-model="target"
            :error-messages="errorMessages"
            :rules="[
              () => !!target || 'This field is required',
              isValidAddress()
            ]"
          ></v-text-field>
          <v-text-field
            label="Amount"
            v-model="amount"
            type="number"
            :rules="[
              () => !!amount || 'This field is required',
              () => !!amount && amount * 1e7 < this.balance || 'Amount cannot exceed balance',
            ]"
          ></v-text-field>
          <span>Available balance: {{(balance/1e7).toFixed(4)}} TFT</span>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="transferFrom()"
            :loading="loadingTransfer"
          >
            Transfer
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <div class="container">
      <h2>Transactions overview</h2>
      <TransactionTable :transfers="transfers" :loading="loadingTransactions"/>
    </div>
  </div>
</template>
<script>
import { getTransactionHistoryFrom, getTransactionHistoryTo } from '../lib/balance'
import { transfer, checkAddress } from '../lib/transfer'
import TransactionTable from './transactions/transactionsTable.vue'

export default {
  components: {
    TransactionTable
  },
  props: ['balance', 'getBalance'],
  async mounted () {
    const [fromHistory, toHistory] = await Promise.all([
      getTransactionHistoryFrom(this.$route.params.accountID),
      getTransactionHistoryTo(this.$route.params.accountID)
    ])
    const transfers = [].concat(fromHistory, toHistory)
    transfers.sort((a, b) => b.timestamp - a.timestamp)
    this.transfers = transfers
    this.loadingTransactions = false
  },
  data () {
    return {
      target: '',
      amount: 0,
      loadingTransfer: false,
      errorMessages: '',
      transfers: [],
      loadingTransactions: true
    }
  },
  methods: {
    isValidAddress () {
      const isValid = checkAddress(this.target)
      if (isValid === true) {
        console.log('addr is valid')
        this.errorMessages = ''
        return true
      } else {
        return isValid.message
      }
    },
    transferFrom () {
      if (this.amount === 0 || this.target === '') {
        this.errorMessages = 'No target specified'
        return
      }
      transfer(this.$route.params.accountID, this.$store.state.api, this.target, this.amount, (res) => {
        this.loadingTransfer = true
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
              this.$toasted.show('Transfer succeeded!')
              this.loadingTransfer = false
              this.getBalance()
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Transfer failed!')
              this.loadingTransfer = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingTransfer = false
      })
    }
  }
}
</script>
<style scoped>
.card {
  background: #252c48 !important;
}
.container {
  padding: 1em;
  margin: auto;
  margin-top: 1em;
}
</style>