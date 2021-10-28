<template>
  <div>
  <h3>Farm</h3>
    <v-row class="no-gutters">
      <v-col cols="12" sm="12" class="account">
      <div v-if="farm">
        <p>farmID: {{farm.id}}</p>
        <p>name: {{ decodeHex(farm.name) }}</p>
        <p>twinID: {{ farm.twin_id }}</p>
        <p>certification type: {{ farm.certification_type }}</p>
        <p>pricing policy id: {{farm.pricing_policy_id }}</p>

        <a href="http://dev.bootstrap.grid.tf/uefimg/dev/1">Download image!</a>
        <!-- <div class="actions">
        </div> -->
      </div>
      <div v-else>
        <p v-if="!loadingCreateFarm">No Farm yet</p>
        <div class="actions">
          <CreateFarm
            :create="createFarmForTwin"
            :loading="loadingCreateFarm"
          />
        </div>
      </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFarm, getFarmByID, createFarm } from '../lib/farm'
import { getTwinID } from '../lib/twin'
import { hex2a } from '../lib/util'
import CreateFarm from './createFarm.vue'

export default {
  name: 'Farm',

  components: {
    CreateFarm,
  },

  ...mapGetters(['api']),

  async mounted () {
    this.$store.dispatch('getAPI')

    const twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.twinID = twinID
    const farm = await getFarm(this.$store.state.api, twinID)
    this.farm = farm
  },

  data () {
    return {
      farm: undefined,
      twinID: 0,
      loadingCreateFarm: false
    }
  },

  methods: {
    decodeHex (input) {
      return hex2a(input)
    },
    createFarmForTwin (name) {
      this.loadingCreateFarm = true
      createFarm(this.$route.params.accountID, this.$store.state.api, name, (res) => {
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
            if (section === 'tfgridModule' && method === 'FarmStored') {
              this.$toasted.show('Farm created!')
              const farmStoredEvent = data[0]
              getFarmByID(this.$store.state.api, farmStoredEvent.id)
                .then(farm => {
                  this.farm = farm
                  this.loadingCreateFarm = false
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Farm creation faild!')
              this.loadingCreateFarm = false
            }
          })
        }
      })
      .catch(() => this.loadingCreateFarm = false)
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
.account p {
  margin-bottom: 0px !important;
}
</style>
