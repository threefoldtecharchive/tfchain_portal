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
        >
          Create Farm
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5">
          Create Farm
        </v-card-title>

        <v-card-text>
          <div class="text">
            <v-text-field
              label="Farm Name"
              v-model="name"
              required
              outlined
              :error-messages="farmNameErrorMessage"
              :rules="[
                () => !!name || 'This field is required',
                nameCheck
              ]"
            ></v-text-field>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="!!farmNameErrorMessage || name === ''"
            color="primary"
            text
            @click="createFarm()"
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
      name: '',
      farmNameErrorMessage: '',
    }
  },
  methods: {
    createFarm() {
      this.open = false
      console.log(this.name)
      this.create(this.name)
    },
    nameCheck () {
      const nameRegex = new RegExp('^[a-zA-Z0-9_-]*$')
      if (nameRegex.test(this.name)) {
        this.farmNameErrorMessage = ''
        return true
      } else {
        this.farmNameErrorMessage = 'Name is not formatted correctly (All letters + numbers and (-,_) are allowed'
        return false
      }
    },
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