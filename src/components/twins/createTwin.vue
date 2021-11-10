<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          :loading="loading"
          class="btn"
          color="primary"
        >
          Create Twin
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5">
          Create Twin
        </v-card-title>

        <v-card-text>
          <div class="text">
            <v-text-field
              label="Twin IP"
              v-model="twinIP"
              required
              outlined
            ></v-text-field>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createTwin()"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
  background: #252c48 !important;
}
</style>