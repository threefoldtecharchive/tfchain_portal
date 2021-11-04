<template>
  <v-expansion-panels
    v-model="panel"
    :disabled="disabled"
    class="publicip"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>Public IPs</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-simple-table class="table">
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <CreateIP 
                :loadingCreate="loadingCreate"
                @create="createPublicIP"
              />
            </v-toolbar>
          </template>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  IP
                </th>
                <th class="text-left">
                  Gateway
                </th>
                <th class="text-left">
                  Deployed Contract ID
                </th>
                <th>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ip in ips"
                :key="ip.ip"
              >
                <td>{{ decodeHex(ip.ip) }}</td>
                <td>{{ decodeHex(ip.gateway) }}</td>
                <td>{{ ip.contract_id }}</td>
                <td>
                  <v-progress-circular
                    v-if="loadingDelete"
                    indeterminate
                    color="primary"
                    v-on="on" 
                    v-bind="attrs"
                  ></v-progress-circular>
                  <DeleteIP
                    v-else
                    :ip="ip"
                    @delete="deletePublicIP(ip)"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import { hex2a } from '../../lib/util'
import DeleteIP from './deleteIP.vue'
import CreateIP from './createIP.vue'

export default {
  name: 'publicIpTable',

  components: {
    DeleteIP,
    CreateIP
  },

  data: () => ({
    panel: [0],
    disabled: false,
    readonly: false,
  }),

  props: ['ips', 'deleteIP', 'loadingDelete', 'createIP', 'loadingCreate'],

  methods: {
    decodeHex (input) {
      return hex2a(input)
    },
    deletePublicIP (ip) {
      this.deleteIP(ip)
    },
    createPublicIP (ip, gateway) {
      this.createIP(ip, gateway)
    }
  }
}
</script>
<style scoped>
.table {
  width: 100%;
}
.publicip {
  margin-top: 0.2em;
  margin-bottom: 0.5em;
}
</style>
