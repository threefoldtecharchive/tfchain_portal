<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          :loading="loadingCreate"
          small
        >
        Add IP
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5">
          Add a public ip to your Farm
        </v-card-title>

        <v-card-text class="text">
          <v-text-field
            label="IP"
            v-model="ip"
            required
            outlined
            dense
            hint="IP address in CIDR format xxx.xx.xx.xx/xx"
            persistent-hint
            :error-messages="ipErrorMessage"
            :rules="[
              () => !!ip || 'This field is required',
              ipcheck
            ]"
          ></v-text-field>
          <v-text-field
            label="Gateway"
            v-model="gateway"
            required
            outlined
            dense
            hint="Gateway for the IP in ipv4 format"
            persistent-hint
            :error-messages="gatewayErrorMessage"
            :rules="[
              () => !!gateway || 'This field is required',
              gatewayCheck
            ]"
          ></v-text-field>
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
            @click="createPublicIP()"
            :disabled="!!ipErrorMessage || !!gatewayErrorMessage || ip === '' || gateway === ''"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { hex2a } from '../../lib/util'
export default {
  name: 'CreateIP',
  props: ['create', 'loadingCreate'],

  data: () => {
    return {
      open: false,
      ip: '',
      ipErrorMessage: '',
      gateway: '',
      gatewayErrorMessage: ''
    }
  },

  methods: {
    createPublicIP() {
      this.open = false
      this.$emit('create', this.ip, this.gateway)
    },
    decodeHex (input) {
      return hex2a(input)
    },
    ipcheck () {
      if (this.ip === '') {
        this.ipErrorMessage = ''
        return true
      }

      const ipRegex = new RegExp('^([0-9]{1,3}.){3}[0-9]{1,3}(/([0-9]|[1-2][0-9]|3[0-2]))$')
      if (ipRegex.test(this.ip)) {
        this.ipErrorMessage = ''
        return true
      } else {
        this.ipErrorMessage = 'IP address is not formatted correctly'
        return false
      }
    },
    gatewayCheck () {
      if (this.gateway === '') {
        this.ipErrorMessage = ''
        return true
      }

      const gatewayRegex = new RegExp('^(?:[0-9]{1,3}.){3}[0-9]{1,3}$')
      if (gatewayRegex.test(this.gateway)) {
        this.gatewayErrorMessage = ''
        return true
      } else {
        this.gatewayErrorMessage = 'Gateway is not formatted correctly'
        return false
      }
    }
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