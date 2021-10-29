<template>
  <div class="text-center">
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
              <li>Memo Text: <b>twin-{{twinID}}</b></li>
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
const TFT_BRIDGE_WALLET = process.env.TFT_BRIDGE_WALLET || 'GBJPPYMN7UABG7YGPENKY3C4LR4WIOKPFPXSYLOUH66Y3ST54OPDEMD4'
export default {
  name: 'Deposit',
  props: ['twinID'],

  data () {
    return {
      open: false,
      depositWallet: TFT_BRIDGE_WALLET
    }
  },
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
  margin-right: 1em !important;
}
</style>
