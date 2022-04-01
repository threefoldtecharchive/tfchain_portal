<template>
  <div class="main">
    <h3>Farms</h3>
    <v-data-table
      :headers="headers"
      :items="farms"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
      dark
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
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <v-col>
            <v-container fluid>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Farm ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.id }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Farm Name</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.name }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Linked Twin ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.twin_id }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Certification Type</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.certification_type }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left">Linked pricing Policy ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.pricing_policy_id }}</span>
                </v-flex>
              </v-row>

              <v-row>
                <v-flex xs3 class="text-left">Stellar payout address</v-flex>
                <v-flex >
                  <CreateV2Address
                    v-if="item.v2address === ''"
                    :loading="loadingAddV2Address"
                    :addV2Address="addV2Address"
                    :text="'Add a Stellar payout address'"
                  />
                  <div v-else>
                    <span class="stellarv2address">
                      {{ item.v2address }}
                      <CreateV2Address
                        :loading="loadingAddV2Address"
                        :addV2Address="addV2Address"
                        :text="'Edit'"
                      />
                    </span>
                  </div>
                </v-flex>
              </v-row>

              <v-row>
                <v-flex xs3 class="text-left">Bootstrap node image</v-flex>
                <v-flex xs3>
                  <a class="link" v-bind:href="'https://v3.bootstrap.grid.tf/'" target="blank">Take me to bootstrap page</a>
                </v-flex>
              </v-row>

              <v-row>
                <PublicIPTable
                  :ips="item.public_ips" 
                  :deleteIP="deletePublicIP"
                  :loadingDelete="loadingDeleteIP"
                  :createIP="createPublicIP"
                  :loadingCreate="loadingCreateIP"
                />
              </v-row>
            </v-container>
          </v-col>
        </td>
      </template>
    </v-data-table>
    <NodesTable
      :loading="loadingNodes"
      :nodes="nodes"
      :deleteNode="deleteNodeFarm" 
      :loadingDelete="loadingNodeDelete"
      :getNodes="getNodes"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getFarm,
  createFarm,
  deleteIP,
  createIP,
  setFarmPayoutV2Address,
  deleteNode
} from '../lib/farm'
import { getTwinID } from '../lib/twin'
import { getNodesByFarmID } from '../lib/nodes'
import { hex2a } from '../lib/util'
import CreateFarm from './farms/createFarm.vue'
import PublicIPTable from './farms/publicIpTable.vue'
import CreateV2Address from './farms/createV2Address.vue'
import NodesTable from '../components/nodes/nodes.vue'

export default {
  name: 'Farm',

  components: {
    CreateFarm,
    PublicIPTable,
    CreateV2Address,
    NodesTable,
  },

  ...mapGetters(['api']),

  async mounted () {
    this.$store.dispatch('getAPI')
    this.twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.farms = await getFarm(this.$store.state.api, this.twinID)
    await this.getNodes()
    this.interval = setInterval(async () => {
      this.nodes = await getNodesByFarmID(this.$store.state.api, this.farms)
    }, 60000)
    this.loadingNodes = false
  },

  destroyed () {
    clearInterval(this.interval) 
  },

  data () {
    return {
      interval: undefined,
      farms: [],
      nodes: [],
      twinID: 0,
      loadingCreateFarm: false,
      loadingDeleteIP: false,
      loadingCreateIP: false,
      loadingAddV2Address: false,
      loadingNodeDelete: false,
      loadingNodes: true,
      loadingAddNodePublicConfig: false,
      expanded: [],
      singleExpand: true,
      headers: [
        { text: 'Farm ID', value: 'id' },
        { text: 'Farm name', value: 'name' },
        { text: 'Linked Twin ID', value: 'twin_id' },
        { text: 'Certification type', value: 'certification_type' },
        { text: 'Pricing Policy ID', value: 'pricing_policy_id' },
      ],
    }
  },
  methods: {
    async getNodes () {
      console.log('getting nodes again')
      this.nodes = await getNodesByFarmID(this.$store.state.api, this.farms)
      console.log(this.nodes)
    },
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
        switch (status.type) {
          case 'Ready': this.$toasted.show(`Transaction submitted`)
        }
      
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`)
      
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if (section === 'tfgridModule' && method === 'FarmStored') {
              this.$toasted.show('Farm created!')
              getFarm(this.$store.state.api, this.twinID)
                .then(farms => {
                  this.farms = farms
                  this.loadingCreateFarm = false
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Farm creation failed!')
              this.loadingCreateFarm = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingCreateFarm = false
      })
    },
    deletePublicIP (ip) {
      this.loadingDeleteIP = true
      deleteIP(this.$route.params.accountID, this.$store.state.api, this.expanded[0].id, ip, (res) => {
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
            if (section === 'tfgridModule' && method === 'FarmUpdated') {
              this.$toasted.show('IP deleted!')
              getFarm(this.$store.state.api, this.twinID)
                .then(farms => {
                  this.farms = farms
                  this.loadingDeleteIP = false
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('IP deletion failed!')
              this.loadingDeleteIP = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingDeleteIP = false
      })
    },
    createPublicIP (ip, gateway) {
      this.loadingCreateIP = true
      createIP(this.$route.params.accountID, this.$store.state.api, this.expanded[0].id, ip, gateway, (res) => {
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
            if (section === 'tfgridModule' && method === 'FarmUpdated') {
              this.$toasted.show('IP created!')
              getFarm(this.$store.state.api, this.twinID)
                .then(farms => {
                  this.farms = farms
                  this.loadingCreateIP = false
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Adding an IP failed!')
              this.loadingCreateIP = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingCreateIP = false
      })
    },
    addV2Address (address) {
      this.loadingAddV2Address = true
      setFarmPayoutV2Address(this.$route.params.accountID, this.$store.state.api, this.expanded[0].id, address, (res) => {
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
            if (section === 'tfgridModule' && method === 'FarmPayoutV2AddressRegistered') {
              this.$toasted.show('Address added!')
              getFarm(this.$store.state.api, this.twinID)
                .then(farms => {
                  this.farms = farms
                  this.loadingAddV2Address = false
                })
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Adding a V2 address failed!')
              this.loadingAddV2Address = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingAddV2Address = false
      })
    },
    deleteNodeFarm (nodeID) {
      this.loadingNodeDelete = true
      deleteNode(this.$route.params.accountID, this.$store.state.api, nodeID, (res) => {
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
            if (section === 'tfgridModule' && method === 'NodeDeleted') {
              this.$toasted.show('Node deleted from farm!')
              this.loadingNodeDelete = false
              getNodesByFarmID(this.$store.state.api, this.farms)
                .then(nodes => this.nodes = nodes)
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Node deletion failed')
              this.loadingNodeDelete = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loadingNodeDelete = false
      })
    },
  }
}
</script>
<style scoped>
.main {
  width: 90% !important;
  margin: auto;
}
.farmInfo {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
}
.stellarv2address {
  display: flex;
  justify-content: space-between;
}
.v-data-table {
  background: #252c48 !important;
}
.v-sheet {
  background: #252c48 !important;
}
.link {
  color: white !important;
}
</style>
