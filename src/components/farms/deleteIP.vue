<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="secondary"
          dark
          v-bind="attrs"
          v-on="on"
          outlined
          x-small
          block
        >
        Delete IP
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5">
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
  name: 'DeleteIP',
  props: ['ip', 'delete'],

  data: () => {
    return {
      open: false,
    }
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
.v-card {
  background: #252c48 !important;
}
</style>