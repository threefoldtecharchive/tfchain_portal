<template>
  <div>
    <v-dialog
      v-model="open"
      fullscreen
      persistent
    >
        <v-divider></v-divider>
      <div
        class="tc"
      >
        <iframe
          :src="documentLink" 
          height="100%"
          width="100%"
        />
      </div>
      <div class="footer">
        <span>If you accept these terms and conditions, you will get prompted to sign using your account on TFchain.</span>
      </div>
      <v-btn
        class="btn"
        text
        @click="accept"
        :loading="loading"
      >
        Accept Terms & Conditions
      </v-btn>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Deposit',
  props: ['open', 'accept', 'documentLink', 'loading'],
}
</script>
<style scoped>
.tc {
  margin-top: 5em;
  margin-bottom: 1em;
  width: 70% !important;
  height: 70% !important;
  margin-left: auto;
  margin-right: auto;
}
.btn {
  font-size: 26px;
  width: 70%;
  background: grey;
  display: flex;
  margin: auto;
}
.footer {
  width: 70%;
  background: white;
  color: black;
  margin: auto;
  margin-bottom: 1em;
  height: 50px;
  padding: 0.3em;
  text-align: center;
  border-radius: 0.3em;
  font-size: 16px;
}
</style>
