<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-progress-circular
          v-if="loadingDelete"
          indeterminate
          color="primary"
          v-on="on" 
          v-bind="attrs"
        ></v-progress-circular>
        <v-icon v-else v-on="on" v-bind="attrs">mdi-delete</v-icon>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Delete IP
        </v-card-title>

        <v-card-text>
          <div class="text">
            <span>Are you sure you want to delete IP: {{ decodeHex(ip.ip) }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="open = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="deletePublicIP()"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { hex2a } from '../../lib/util'
export default {
  name: 'App',
  props: ['ip', 'delete', 'loadingDelete'],

  data: () => {
    return {
      open: false,
    }
  },

  mounted () {
    console.log(this.loadingDelete)
  },
  
  methods: {
    deletePublicIP() {
      this.open = false
      this.$emit('delete')
    },
    decodeHex (input) {
      return hex2a(input)
    },
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
</style>