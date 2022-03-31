<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
      v-on:click:outside="close"
    >
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          :loading="loading"
        >
          Edit Twin
        </v-btn>
      </template> -->

      <v-card>
        <v-card-title class="text-h5">
          Edit Twin
        </v-card-title>

        <v-card-text>
          <div class="text">
            <v-text-field
              label="Twin IP"
              v-model="newIP"
              required
              outlined
              :error-messages="ipErrorMessage"
              :rules="[
                () => !!newIP || 'This field is required',
                ipCheck
              ]"
            ></v-text-field>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="editTwin()"
            :loading="loading"
            :disabled="!!ipErrorMessage"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: ['open', 'close', 'edit', 'loading', 'twinIP'],

  mounted () {
    this.newIP = this.twinIP
  },

  data: () => {
    return {
      newIP: '',
      ipErrorMessage: ''
    }
  },

  methods: {
    editTwin() {
      this.edit(this.newIP)
    },
    ipCheck () {
      const ip6Regex = new RegExp('(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))[0-9]{1,3}$')
      console.log(this.newIP)
      console.log(ip6Regex.test(this.newIP))
      if (ip6Regex.test(this.newIP)) {
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
  background: #252c48 !important;
}
</style>