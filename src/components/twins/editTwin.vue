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
      newIP: ''
    }
  },

  methods: {
    editTwin() {
      this.edit(this.newIP)
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