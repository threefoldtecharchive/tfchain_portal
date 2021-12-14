<template>
  <div>
    <v-dialog
      v-model="open"
      width="60vw"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          :loading="loading"
          class="button"
        >
          Withdraw to Stellar
        </v-btn>
      </template>

      <v-card class="card">
        <v-card-title class="text-h5">
          Withdraw TFT
        </v-card-title>

        <v-card-text>
          <div class="textContainer">
            Interact with the bridge in order to withdraw your TFT to Stellar
          </div>
          <v-text-field
            label="Stellar Target Wallet address"
            v-model="target"
            required
            :error-messages="errorMessages"
            :rules="[
              () => !!target || 'This field is required',
              targetCheck
            ]"
          ></v-text-field>
          <v-text-field
            label="Amount"
            v-model="userAmount"
            type="number"
            required
            :rules="[
              () => !!userAmount || 'This field is required',
              () => !!userAmount && userAmount >= 0 || 'Amount must be larger then 0',
              () => !!userAmount && userAmount < this.balance || 'Amount cannot exceed balance',
            ]"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="submitWithdraw()"
          >
            Submit withdraw
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import stellar from 'stellar-sdk'
import { mapGetters } from 'vuex'

const TFT_ASSET = 'TFT'

export default {
  name: 'Withdraw',
  props: ['balance', 'withdraw', 'loading'],
  
  
  computed: {
    ...mapGetters(['config']),
    server() {
      return new stellar.Server(this.config.horizonUrl)
    },
    bridgeWallet() {
      return this.config.bridgeTftAddress
    },
  },

  data () {
    return {
      open: false,
      target: '',
      userAmount: this.balance,
      errorMessages: '',
    }
  },

  methods: {
    submitWithdraw () {
      console.log('submit withdraw')
      if (this.target === '' || this.userAmount <= 0) {
        this.error = true
        return
      }

      this.withdraw(this.target, this.userAmount)
      this.open = false
    },
    async targetCheck () {
      console.log('targetCheck')
      if (this.target === this.config.bridgeTftAddress) {
        this.errorMessages = 'Target cannot be the bridge wallet!'
        console.log('targetCheck', '1')
        return false
      }

      try {
        // check if the account provided exists on stellar
        const account = await this.server.loadAccount(this.target)
        // check if the account provided has the appropriate trustlines
        const includes = account.balances.find(b => b.asset_code === TFT_ASSET && b.asset_issuer === this.config.tftAssetIssuer)
        if (!includes) {
          this.errorMessages = 'Address does not have a valid trustline to TFT'
          console.log('targetCheck', '2')
          return false
        }
      } catch (error) {
        this.errorMessages = 'Address not found'
        console.log('targetCheck', '3')
        console.log(error)

        return false
      }

      this.errorMessages = ''
      console.log('targetCheck', '4')
      return true
    },
  }
}
</script>
<style scoped>
.textContainer {
  padding: 1em;
  font-size: 18px;
}
.textContainer ul {
  margin-top: 1em;
  margin-bottom: 2em;
}

.button {
  width: 100% !important;
}
.card {
  background: #252c48 !important;
}
</style>
