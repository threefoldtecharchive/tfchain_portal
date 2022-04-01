<template>
  <div>
  <h3>Nodes</h3>
    <v-data-table
      :headers="headers"
      :items="nodes"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="nodeId"
      show-expand
      class="elevation-1"
      dark
      sort-by="nodeId"
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Your Nodes</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" key="item.nodeId">
          <v-col>
            <v-container fluid>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Node ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.nodeId }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Farm ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.farmId }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Twin ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.twinId }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Certification Type</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.certificationType }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">First boot at</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.createdAt }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Uptime</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.uptime | secondsToReadable  }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Updated at</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.updatedAt }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Country</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.country }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">City</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.city }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Farming Policy ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.farmingPolicyId }}</span>
                </v-flex>
              </v-row>

              <v-row>
                <span>For more information visit the Capacity Explorer</span>
              </v-row>
            </v-container>
          </v-col>

          <v-col>
          <div class="title">
            <v-icon small left>fa-chart-pie</v-icon>Resource units reserved
          </div>

          <v-row>
            <v-col v-for="(value, key) in item.resources" :key="key" align="center">
              <v-flex class="text-center pr-2">
                <span class="text-uppercase">{{ key }}</span>
              </v-flex>
              <v-flex class="text-truncate font-weight-bold">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-progress-circular v-on="on" :rotate="-90" :size="100" :width="15" :value="getPercentage(key)"
                      color="light-green darken-2" />
                    <template v-if="item.usedResources">
                      <span v-if="key !== 'cru'">
                        {{ item.usedResources[key] | toTerraOrGiga }} / {{ item.resources[key] | toTerraOrGiga }}
                      </span>
                      <span v-else>
                        {{ item.usedResources[key] }} / {{ item.resources[key] }}
                      </span>
                    </template>
                  </template>
                  <span>
                    <v-row dense>
                      Total: {{ item.resources[key] }}
                    </v-row>
                    <v-row dense v-if="item.usedResources">
                      Reserved: {{ item.usedResources[key] }}
                    </v-row>
                    <v-row v-if="key === 'sru' || key === 'hru'" dense>
                      100 GB can be reserved for Zos cache
                    </v-row>
                    <v-row v-if="key === 'mru'" dense>
                      2 GB is reserved for zos
                    </v-row>
                  </span>
                </v-tooltip>
              </v-flex>
            </v-col>
          </v-row>
        </v-col>

        </td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-progress-circular
          v-if="loadingDelete"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <v-tooltip bottom v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              medium
              @click="deleteItem(item)"
              v-on="on"
              v-bind="attrs"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>Delete a node</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="configIcon"
              medium
              @click="openAddPublicConfigModal(item)"
              v-on="on"
              v-bind="attrs"
            >
              mdi-earth
            </v-icon>
          </template>
          <span>Add a public config</span>
        </v-tooltip>
      </template>
    
      <template v-slot:[`item.status`]="{ item }">
        <p class="text-left mt-1 mb-0">
          <v-chip :color="getStatus(item).color" dark>{{ getStatus(item).status }}</v-chip>
        </p>
      </template>
    </v-data-table>

    <PublicConfig
      :node="nodeToEdit"
      :open="openAddPublicConfig"
      :close="() => openAddPublicConfig = false"
      :getNodes="getNodes"
    />

    <v-dialog v-model="dialogDelete" max-width="700px">
      <v-card>
        <v-card-title class="text-h5">Are you certain you want to delete this node from your farm?</v-card-title>
        <v-card-text>This will delete the node on chain, this action is irreversible</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import moment from 'moment'
import PublicConfig from './publicConfig.vue'

export default {
  name: 'NodesTable',
  props: ['loading', 'nodes', 'deleteNode', 'loadingDelete', 'getNodes'],
  components: { PublicConfig },
  data () {
    return {
      dialogDelete: false,
      editedIndex: -1,
      expanded: [],
      singleExpand: true,
      openAddPublicConfig: false,
      nodeToEdit: {},
      headers: [
        { text: 'Node ID', value: 'nodeId' },
        { text: 'Farm ID', value: 'farmId' },
        { text: 'Country', value: 'country' },
        { text: 'City', value: 'city' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    getPercentage (type) {
      if (!this.expanded[0].usedResources) return 0
      const reservedResources = this.expanded[0].usedResources[type]
      const totalResources = this.expanded[0].resources[type]
      if (reservedResources === 0 && totalResources === 0) return 0
      return (reservedResources / totalResources) * 100
    },

    deleteItem (item) {
      this.editedIndex = this.nodes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      // this.nodes.splice(this.editedIndex, 1)
      this.deleteNode(this.editedItem.id)
      this.closeDelete()
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    getStatus (node) {
      const { updatedAt } = node
      const startTime = moment()
      const end = moment(updatedAt)
      const hours = startTime.diff(end, 'hours')

      if (hours < 2) return { color: 'green', status: 'up' }
      else if (hours > 2 && hours < 3) { return { color: 'orange', status: 'likely down' } } else return { color: 'red', status: 'down' }
    },

    openAddPublicConfigModal (node) {
      this.nodeToEdit = node
      this.openAddPublicConfig = true
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },
}
</script>
<style scoped>
.v-data-table {
  background: #252c48 !important;
}
.v-sheet {
  background: #252c48 !important;
}
.link {
  color: white !important;
}
.configIcon {
  margin-left: 0.5em;
}
</style>
