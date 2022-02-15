<template>
  <v-card class="card">
    <v-card-title>
      Create a Validator
    </v-card-title>
    <v-card-text>
      <span>Create a Validator request if you wish to start validating on this TF Chain network.</span>
      <div class="text">
        <v-text-field
          label="Description why you want to become a validator"
          v-model="description"
          required
          outlined
          color="white"
        ></v-text-field>
        <v-text-field
          label="Threefold Connect ID"
          v-model="tfConnectID"
          required
          outlined
          color="white"
        ></v-text-field>
        <v-text-field
          label="Validator Node Account"
          v-model="validatorNodeAccount"
          required
          outlined
          color="white"
        ></v-text-field>
        <v-text-field
          label="Stash account (Current account)"
          v-model="this.$route.params.accountID"
          required
          outlined
          color="white"
          disabled
        ></v-text-field>
        <v-text-field
          label="Additional information"
          v-model="info"
          required
          outlined
          color="white"
        ></v-text-field>
      </div>
      <!-- <span class="infoSpan">More information on the Planetary Network: 
        <a
          target="blank"
          href="https://library.threefold.me/info/manual/#/manual__yggdrasil_client"
        >
          Click here
        </a>
      </span> -->
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="createRequest()"
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
      description: '',
      info: '',
      tfConnectID: 0,
      validatorNodeAccount: '',
      stashAccount: this.$route.params.accountID
    }
  },
  methods: {
    createRequest() {
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