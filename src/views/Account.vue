<template>
  <v-container>
    <h3>Twins</h3>
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div v-if="twin && twin.id !== 0">
          <p>twinID: {{twinID}}</p>
          <p>ip: {{ decodeHex(twin.ip) }}</p>
          <p>accountID: {{ twin.account_id }}</p>
          <div class="actions">
            <!-- <v-btn color="primary" @click="routeToAccount(account.address)">Enter</v-btn> -->
          </div>
        </div>
        <div v-else>
          <p>No Twin yet</p>
          <div class="actions">
            <CreateTwin
              :create="createTwinFromAccount"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <h3>Farm</h3>
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
        <div v-if="farm">
          <p>farmID: {{farm.id}}</p>
          <p>name: {{ decodeHex(farm.name) }}</p>
          <p>twinID: {{ farm.twin_id }}</p>
          <p>certification type: {{ farm.certification_type }}</p>
          <p>pricing policy id: {{farm.pricing_policy_id }}</p>
          <!-- <div class="actions">
          </div> -->
        </div>
        <div v-else>
          <p>No farm yet</p>
          <!-- <div class="actions">
            <v-btn color="primary">Create Farm</v-btn>
          </div> -->
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateTwin from '../components/createTwin.vue'
import { getTwin, getTwinID, createTwin } from '../lib/twin'
import { getFarm } from '../lib/farm'
import { hex2a } from '../lib/util'

export default {
  name: 'Account',

  ...mapGetters(['api']),

  async mounted () {
    this.$store.dispatch('getAPI')

    const twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.twinID = twinID
    const twin = await getTwin(this.$store.state.api, twinID)
    this.twin = twin
    console.log(twin)
    const farm = await getFarm(this.$store.state.api, twinID)
    if (farm.length > 0) {
      this.farm = farm[0]
    }
  },
  components: {
    CreateTwin
  },
  data () {
    return {
      twinID: 0,
      twin: undefined,
      farm: undefined,
    }
  },

  methods: {
    decodeHex (input) {
      return hex2a(input)
    },
    createTwinFromAccount (ip) {
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
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Twin creation faild!')
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
  margin-top: 0.2em;
  margin-bottom: 1em;
  border-radius: 0.3em;
  padding: 2em !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
