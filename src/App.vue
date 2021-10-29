<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/3fold_logo.png"
          transition="scale-transition"
          width="40"
          @click="$router.push('/')"
        />
        <span>TF Chain UI</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
        v-if="!connected"
      >
        <span class="mr-2">Connect</span>
      </v-btn>
      <v-btn
        v-else
        disabled
      >
        <span class="mr-2">Connected</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',

  computed: mapState([
    'connected'
  ]),

  async mounted () {
    this.$store.dispatch('getAPI')
  }
};
</script>
<style scoped>
.v-main {
  background-color: rgb(236, 236, 236) !important;
}
</style>