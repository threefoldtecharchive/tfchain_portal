<template>
  <v-card class="card">
    <v-card-title>
      Create a twin
    </v-card-title>
    <v-card-text>
      <span>Create your digital twin, with this twin you can interact on TF Grid.</span>
      <div class="text">
        <v-text-field
          label="Twin IP"
          v-model="twinIP"
          required
          outlined
          hint="If you have Yggdrasil installed, please provide your Yggdrasil IPV6"
          persistent-hint
          :error-messages="ipErrorMessage"
          :rules="[
            () => !!twinIP || 'This field is required',
            ipCheck
          ]"
        ></v-text-field>
      </div>
      <span class="infoSpan">More information on the Planetary Network: 
        <a
          target="blank"
          href="https://library.threefold.me/info/manual/#/manual__yggdrasil_client"
        >
          Click here
        </a>
      </span>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="open = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        @click="createTwin()"
        :loading="loading"
        :disabled="!!ipErrorMessage"
      >
        Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  props: ['create', 'loading'],

  computed: mapState([
    'connected'
  ]),
  data: () => {
    return {
      open: false,
      twinIP: '::1',
      ipErrorMessage: ''
    }
  },
  methods: {
    createTwin() {
      this.open = false
      console.log(this.twinIP)
      this.create(this.twinIP)
    },
    ipCheck () {
      const ip6Regex = new RegExp("(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))")

      console.log(ip6Regex.test(this.twinIP))
      if (ip6Regex.test(this.twinIP)) {
        this.ipErrorMessage = ''
        return true
      } else {
        this.ipErrorMessage = 'IP address is not formatted correctly'
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
  /* background: linear-gradient(90deg, rgb(63, 63, 65) 35%, rgba(109,85,230,1) 100%); */
  background: rgba(109,85,230,1);
  margin: auto;
  margin-top: 1em;
  width: 50%;
  display: flex;
  flex-direction: column;
}

.v-card a {
  color: white;
}
</style>