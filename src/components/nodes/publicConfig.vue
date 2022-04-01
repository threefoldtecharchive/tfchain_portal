<template>
  <div class="text-center">
    <v-dialog
      v-model="openModal"
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
            v-model="ip4"
            required
            outlined
            dense
            hint="IPV4 address in CIDR format xx.xx.xx.xx/xx"
            persistent-hint
            :error-messages="ipErrorMessage"
            :validate-on-blur="true"
            :rules="[
              () => !!ip4 || 'This field is required',
              ipcheck
            ]"
          ></v-text-field>

          <v-text-field
            label="Gateway"
            v-model="gw4"
            required
            outlined
            dense
            hint="Gateway for the IP in ipv4 format"
            persistent-hint
            :validate-on-blur="true"
            :error-messages="gatewayErrorMessage"
            :rules="[
              () => !!gw4 || 'This field is required',
              gatewayCheck
            ]"
          ></v-text-field>
          
          <v-divider></v-divider>

          <v-text-field
            label="IPV6"
            v-model="ip6"
            outlined
            dense
            hint="IPV6 address (not required)"
            persistent-hint
            :validate-on-blur="true"
            :error-messages="ip6ErrorMessage"
            :rules="[
              ip6check
            ]"
          ></v-text-field>

          <v-text-field
            label="Gateway IPV6"
            v-model="gw6"
            outlined
            dense
            hint="Gateway for the IP in ipv6 format (not required)"
            persistent-hint
            :validate-on-blur="true"
            :error-messages="gateway6ErrorMessage"
            :rules="[
              gateway6Check
            ]"
          ></v-text-field>

          <v-text-field
            label="Domain"
            v-model="domain"
            outlined
            dense
            hint="Domain for webgateway (not required)"
            persistent-hint
            :validate-on-blur="true"
            :error-messages="domainErrorMessage"
            :rules="[
              domainCheck
            ]"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text
            @click="remove()"
            color="error"
          >
            Remove config
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="saveConfig()"
            :loading="loading"
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
import { addNodePublicConfig } from '../../lib/nodes'

export default {
  name: 'publicConfig',
  props: ['open', 'close', 'node', 'getNodes'],

  data () {
    return {
      ipErrorMessage: '',
      ip6ErrorMessage: '',
      gatewayErrorMessage: '',
      gateway6ErrorMessage: '',
      domainErrorMessage: '',
      loading: false,
      id: '',
      ip4: '',
      gw4: '',
      ip6: '',
      gw6: '',
      domain: ''
    }
  },

  computed: {
    openModal: {
      get () {
        this.getNodeConfig()
        return this.open
      },
      set () {
        this.close()
      }
    }
  },

  methods: {
    saveConfig () {
      const config = {
        ipv4: this.ip4,
        gw4: this.gw4,
        ipv6: this.ip6,
        gw6: this.gw6,
        domain: this.domain
      }
      this.save(config)
    },
    remove () {
      const config = {
        ipv4: '',
        ipv6: '',
        gw4: '',
        gw6: '',
        domain: ''
      }
      this.save(config)
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
    },
    getNodeConfig () {
      this.id = this.node.nodeId
      if (this.node.publicConfig) {
        this.ip4 = this.node.publicConfig.ipv4
        this.gw4 = this.node.publicConfig.gw4
        this.ip6 = this.node.publicConfig.ipv6
        this.gw6 = this.node.publicConfig.gw6
        this.domain = this.node.publicConfig.domain
      } else {
        this.ip4 = ''
        this.gw4 = ''
        this.ip6 = ''
        this.gw6 = ''
        this.domain = ''
      }
    },
    save (config) {
      this.loading = true
      console.log(this.node.nodeId)
      console.log(this.node.farmId)
      addNodePublicConfig(this.$route.params.accountID, this.$store.state.api, this.node.farmId, this.node.nodeId, config, (res) => {
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
            if (section === 'tfgridModule' && method === 'NodePublicConfigStored') {
              this.$toasted.show('Node public config added!')
              this.loading = false
              this.close()
              this.getNodes()
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Adding Node public config failed')
              this.loading = false
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.loading = false
      })
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