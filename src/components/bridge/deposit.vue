<template>
  <div>
    <v-dialog
      v-model="open"
      width="60vw"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          class="button"
          outlined
        >
          Deposit from Stellar
        </v-btn>
      </template>

      <v-card class="card">
        <v-card-title class="text-h5 grey lighten-2">
          Deposit TFT
        </v-card-title>

        <v-card-text>
          <div class="textContainer">
            Send a Stellar transaction with your TFT's to deposit to:
            <ul>
              <li>Destination: <b>{{ depositWallet }}</b></li>
              <li>Memo Text: <b>twin_{{twinID}}</b></li>
            </ul>

            <v-alert
              border="right"
              color="red lighten-2"
              dark
            >
              Important Note: Please check what memo text you need to send. 
              Failure to do so will result in unrecoverable loss of funds!
            </v-alert>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="open = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from '../../config'
export default {
  name: 'Deposit',
  props: ['twinID'],

  data () {
    return {
      open: false,
      depositWallet: config.bridgeTftAddress
    }
  },

  mounted () {
    console.log(process.env)
  }
}
</script>
<style scoped>
.textContainer {
  padding: 1em;
  font-size: 18px;
}
.textContainer ul {
  margin-top: 1em;
  margin-bottom: 2em;
}
.button {
  width: 100% !important;
}
</style>
