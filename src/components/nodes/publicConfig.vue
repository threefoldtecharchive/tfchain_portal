<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="800"
      v-on:click:outside="close"
    >
      <v-card>
        <v-card-title class="text-h5">
          Add a public config to your node with ID: {{ id }}
        </v-card-title>

        <v-card-text class="text">
          <v-text-field
            label="IPV4"
            :value="ip4"
            required
            outlined
            dense
            hint="IPV4 address in CIDR format xx.xx.xx.xx/xx"
            persistent-hint
            :error-messages="ipErrorMessage"
            :rules="[
              () => !!ip || 'This field is required',
              ipcheck
            ]"
          ></v-text-field>

          <v-text-field
            label="Gateway"
            :value="gw4"
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
          
          <v-divider></v-divider>

          <v-text-field
            label="IPV6"
            :value="ip6"
            outlined
            dense
            hint="IPV6 address (not required)"
            persistent-hint
            :error-messages="ip6ErrorMessage"
            :rules="[
              ip6check
            ]"
          ></v-text-field>

          <v-text-field
            label="Gateway IPV6"
            :value="gw6"
            outlined
            dense
            hint="Gateway for the IP in ipv6 format (not required)"
            persistent-hint
            :error-messages="gateway6ErrorMessage"
            :rules="[
              gateway6Check
            ]"
          ></v-text-field>

          <v-text-field
            label="Domain"
            :value="domain"
            outlined
            dense
            hint="Domain for webgateway (not required)"
            persistent-hint
            :error-messages="domainErrorMessage"
            :rules="[
              domainCheck
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
  name: 'publicConfig',
  props: ['open', 'close', 'node', 'loading', 'save'],

  data () {
    return {
      ipErrorMessage: '',
      ip6ErrorMessage: '',
      gatewayErrorMessage: '',
      gateway6ErrorMessage: '',
      domainErrorMessage: ''
    }
  },

  computed: {
    id() {
      return this.node.id || 0
    },
    ip4 () {
      return this.node.public_config ? hex2a(this.node.public_config.ipv4) : ''
    },
    gw4 () {
      return this.node.public_config ? hex2a(this.node.public_config.gw4) : ''
    },
    ip6 () {
      return this.node.public_config ? hex2a(this.node.public_config.ipv6) : ''
    },
    gw6 () {
      return this.node.public_config ? hex2a(this.node.public_config.gw6) : ''
    },
    domain () {
      return this.node.public_config ? hex2a(this.node.public_config.domain) : ''
    }
  },

  methods: {
    createPublicIP() {
      this.open = false
      const config = {
        ipv4: this.ip4,
        ipv6: this.ip6,
        gw4: this.gw4,
        gw6: this.gw6,
        domain: this.domain
      }
      this.save(this.node, config)
    },
    decodeHex (input) {
      return hex2a(input)
    },
    ipcheck () {
      if (this.ip4 === '') return true

      const ipRegex = new RegExp('^([0-9]{1,3}.){3}[0-9]{1,3}(/([0-9]|[1-2][0-9]|3[0-2]))$')
      if (ipRegex.test(this.ip4)) {
        this.ipErrorMessage = ''
        return true
      } else {
        this.ipErrorMessage = 'IP address is not formatted correctly'
        return false
      }
    },
    gatewayCheck () {
      if (this.gw4 === '') return true

      const gatewayRegex = new RegExp('^(?:[0-9]{1,3}.){3}[0-9]{1,3}$')
      if (gatewayRegex.test(this.gw4)) {
        this.gatewayErrorMessage = ''
        return true
      } else {
        this.gatewayErrorMessage = 'Gateway is not formatted correctly'
        return false
      }
    },
    ip6check () {
      if (this.ip6 === '') return true
      /* eslint-disable */
      const ipRegex = new RegExp('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))')
      if (ipRegex.test(this.ip6)) {
        this.ip6ErrorMessage = ''
        return true
      } else {
        this.ip6ErrorMessage = 'IPV6 address is not formatted correctly'
        return false
      }
    },
    gateway6Check () {
      if (this.gw6 === '') return true

      const gatewayRegex = new RegExp('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))[0-9]{1,3}$')
      if (gatewayRegex.test(this.gw6)) {
        this.gateway6ErrorMessage = ''
        return true
      } else {
        this.gateway6ErrorMessage = 'Gateway is not formatted correctly'
        return false
      }
    },
    domainCheck () {
      if (this.domain === '') return true
    }
  }
}
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