<template>
  <div>
    <v-dialog
      v-model="open"
      width="70vw"
      v-on:click:outside="close"
    >
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

            <div class="spanContainer">
              <h3>Or use Threefold connect to scan this qr code</h3>
            </div>
            <div class="qr">
              <qrcode-vue :value="qrCodeText" :size="400" level="M" render-as="svg" />
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
            @click="close"
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
  props: ['open', 'close', 'twinID', 'fee'],

  data () {
    return {
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
.spanContainer {
  margin-top: 1em;
  text-align: center;
  margin-bottom: 1em;
}
.qr {
  margin-bottom: 1em !important;
  text-align: center;
  margin: auto;
  width: 450px;
  padding: 1em;
  height: 100%;
  background: white;
}
.card {
  background: #252c48 !important;
}
</style>
