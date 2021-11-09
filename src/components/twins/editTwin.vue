<template>
  <div class="text-center">
    <v-dialog
      v-model="open"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          :loading="loading"
          outlined
        >
          Edit Twin
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
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
  props: ['edit', 'loading', 'twinIP'],

  mounted () {
    this.newIP = this.twinIP
  },

  data: () => {
    return {
      open: false,
      newIP: ''
    }
  },

  methods: {
    editTwin() {
      this.open = false
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
.v-btn {
  background: white !important;
}
</style>