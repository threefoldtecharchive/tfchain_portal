<template>
  <v-simple-table class="table">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Public IPS</v-toolbar-title>
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
          <td class="delete">
            <DeleteIP
              :loadingDelete="loadingDelete"
              :ip="ip"
              @delete="deletePublicIP(ip)"
            />
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
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
.delete {
  cursor: pointer;
}
.table {
  width: 100%;
}
</style>
