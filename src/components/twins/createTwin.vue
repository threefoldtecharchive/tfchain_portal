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
        @click="createTwin()"
        :loading="loading"
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
      twinIP: '127.0.0.1',
    }
  },
  methods: {
    createTwin() {
      this.open = false
      console.log(this.twinIP)
      this.create(this.twinIP)
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