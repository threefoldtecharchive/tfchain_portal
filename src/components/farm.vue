<template>
  <div>
  <h3>Farm</h3>

    <v-data-table
      :headers="headers"
      :items="farms"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Your Farms</v-toolbar-title>
          <v-spacer></v-spacer>
          <CreateFarm
            :create="createFarmForTwin"
            :loading="loadingCreateFarm"
          />
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <a v-bind:href="'http://dev.bootstrap.grid.tf/uefimg/dev/' + item.id">Download image!</a>
        </td>
      </template>
    </v-data-table>

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

    this.twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.farms = await getFarm(this.$store.state.api, this.twinID)
  },

  data () {
    return {
      farms: [],
      twinID: 0,
      loadingCreateFarm: false,
      expanded: [],
      singleExpand: true,
      headers: [
        { text: 'Farm ID', value: 'id' },
        { text: 'Farm name', value: 'name' },
        { text: 'Linked Twin ID', value: 'twin_id' },
        { text: 'Certification type', value: 'certification_type' },
        { text: 'Pricing Policy ID', value: 'pricing_policy_id' },
      ]
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
