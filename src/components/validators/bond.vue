<template>
  <v-card class="card">
    <v-card-title>
      Bond to a Validator
    </v-card-title>
    <v-card-text>
      <h3>The first step in creating a Validator is bonding from a Stash account (bank) to a Validator account.</h3>
      
      <span>If you only have 1 account, please create a new account first that can be used as validator account.</span>
      <v-select
        class="select"
        :items="accounts"
        label="Select a Validator account to bond to"
        item-text="address"
        v-model="selectedAccount"
      ></v-select>
      <h3>Your current account will be used as the Stash account.</h3>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="bondAccount()"
        :loading="loading"
      >
        Bond
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'Bond',
  props: ['bond', 'loading'],

  computed: mapState([
    'connected'
  ]),

  data: () => {
    return {
      selectedAccount: null,
      accounts: []
    }
  },

  async mounted () {
    this.accounts = this.$store.state.accounts
    this.accounts = this.accounts.filter(acc => acc.address !== this.$route.params.accountID)
    this.selectedAccount = this.accounts[0]
    console.log(this.accounts)
  },

  methods: {
    bondAccount() {
      console.log(this.selectedAccount)
      this.bond(this.selectedAccount.address)
    }
  }
};
</script>
<style scoped>
.v-main {
  background-color: rgb(236, 236, 236) !important;
}
.text {
  margin-top: 2em !important;
}
.v-card {
  /* background: linear-gradient(90deg, rgb(63, 63, 65) 35%, rgba(109,85,230,1) 100%); */
  background: rgba(109,85,230,1);
  margin: auto;
  margin-top: 1em;
  width: 60%;
  display: flex;
  flex-direction: column;
}

.v-card a {
  color: white;
}
.select {
  margin-top: 1em;
}
</style>