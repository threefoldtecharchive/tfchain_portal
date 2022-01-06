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
        >
          Deposit from Stellar
        </v-btn>
      </template>

      <v-card class="card">
        <v-card-title class="text-h5">
          Deposit TFT
        </v-card-title>

        <v-card-text>
          <div class="textContainer">
            Send a Stellar transaction with your TFT's to deposit to:
            <ul>
              <li>Destination: <b>{{ depositWallet }}</b></li>
              <li>Memo Text: <b>twin_{{twinID}}</b></li>
              <li>Amount: should be larger than {{ fee }} TFT <b>(deposit fee is: {{ fee }} TFT)</b></li>
            </ul>

            <v-divider/>

            <div class="qr">
              <span>Or use Threefold connect to scan this qr code</span>
              <qrcode-vue :value="qrCodeText" :size="400" level="H" />
            </div>

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
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'Deposit',
  props: ['twinID', 'fee'],

  data () {
    return {
      open: false,
      depositWallet: config.bridgeTftAddress,
      qrCodeText: `TFT:${config.bridgeTftAddress}?message=twin_${this.twinID}&sender=me`
    }
  },

  components: {
    QrcodeVue,
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
.qr {
  margin-top: 1em !important;
  margin-bottom: 1em !important;
  text-align: center;
  margin: auto;
}
.qr span {
  margin-top: 1em;
  margin-bottom: 0.2em !important;
}
.card {
  background: #252c48 !important;
}
</style>
