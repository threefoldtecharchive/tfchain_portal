<template>
  <div>
    <Bond
      v-if="!this.bondedAccount"
      :bond="bondToValidator"
      :loading="loadingBond"
    />
    <Create
      v-if="this.bondedAccount"
    />
  </div>
</template>
<script>

import { getValidatorRequest, getBondedAccount, bond } from '../lib/validators'
import Bond from './validators/bond.vue'
import Create from './validators/create.vue'

export default {
  components: {
    Bond,
    Create
  },

  data () {
    return {
      request: null,
      bondedAccount: null,
      loadingBond: false,
    }
  },

  async mounted () {
    if (!this.$store.state.api) return
    this.request = await getValidatorRequest(this.$store.state.api, this.$route.params.accountID)
    this.bondedAccount = await getBondedAccount(this.$store.state.api, this.$route.params.accountID)
    console.log(this.bondedAccount)
  },

  methods: {
    bondToValidator (target) {
      this.loadingBond = true
      bond(this.$route.params.accountID, this.$store.state.api, target, (res) => {
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
            if (section === 'validator' && method === 'Bonded') {
              this.$toasted.show('Bond success!')
              this.loadingBond = false
              getBondedAccount(this.$store.state.api, this.$route.params.accountID)
                .then(bondedAccount => {
                  this.bondedAccount = bondedAccount
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Bond failed!')
              this.loadingBond = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingBond = false
      })
    },
  }
}
</script>