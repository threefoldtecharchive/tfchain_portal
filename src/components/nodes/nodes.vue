<template>
  <div>
  <h3>Nodes</h3>
    <v-data-table
      :headers="headers"
      :items="nodes"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      item-key="name"
      show-expand
      class="elevation-1"
      dark
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Your Nodes</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:expanded-item="{ item }">
        <td :colspan="headers.length">
          <v-col>
            <v-container fluid>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Node ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.id }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Farm ID</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.farm_id }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Twin ID</v-flex>
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
                <v-flex xs3 class="text-left pr-2">Created</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ new Date(item.created * 1000) }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Uptime (in seconds)</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.uptime | secondsToReadable  }}</span>
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
                  <span>{{ item.farming_policy_id }}</span>
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs3 class="text-left pr-2">Balance</v-flex>
                <v-flex class="text-truncate font-weight-bold">
                  <span>{{ item.balance }} TFT</span>
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
                    <span v-if="key !== 'cru'">
                      {{ item.usedResources[key] | toTerraOrGiga }} / {{ item.resources[key] | toTerraOrGiga }}
                    </span>
                    <span v-else>
                      {{ item.usedResources[key] }} / {{ item.resources[key] }}
                    </span>
                  </template>
                  <span>
                    <v-row dense>
                      Total: {{ item.resources[key] }}
                    </v-row>
                    <v-row dense>
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
      <template v-slot:item.actions="{ item }">
        
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

        <v-progress-circular
          v-if="loadingTransfer"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <v-tooltip bottom v-else>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              medium
              @click="fundNode(item)"
              v-on="on"
              v-bind="attrs"
              
            >
              mdi-hand-coin
            </v-icon>
          </template>
          <span>Fund a node's wallet</span>
        </v-tooltip>
      </template>
    </v-data-table>

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

    <v-dialog v-model="dialogFundNode" max-width="700px">
      <v-card>
        <v-card-title class="text-h5">Fund your node's wallet with 1 TFT</v-card-title>
        <v-card-text>This action will send 1 TFT from your farmers wallet to your node's wallet to ensure operations</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeFundDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="fundNodeConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
export default {
  name: 'NodesTable',
  props: ['nodes', 'deleteNode', 'fundNodeWallet', 'loadingDelete', 'loadingTransfer'],
  data () {
    return {
      dialogDelete: false,
      dialogFundNode: false,
      editedIndex: -1,
      expanded: [],
      singleExpand: true,
      headers: [
        { text: 'Node ID', value: 'id' },
        { text: 'Farm ID', value: 'farm_id' },
        { text: 'Country', value: 'country' },
        { text: 'City', value: 'city' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  methods: {
    getPercentage (type) {
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

    fundNode (item) {
      this.editedIndex = this.nodes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogFundNode = true
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

    fundNodeConfirm () {
      this.fundNodeWallet(this.editedItem.accountId)
      this.closeFundDialog()
    },

    closeFundDialog () {
      this.dialogFundNode = false
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },
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
</style>
