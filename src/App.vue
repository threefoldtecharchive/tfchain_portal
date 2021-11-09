<template>
  <v-app class="main">
    <v-app-bar
      app
      color="#252c48"
      dark
    >
      <div class="home d-flex align-center">
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
      
      <div class="explorer">
        <span @click="$router.push('/explorer')">Capacity Explorer</span>
      </div>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
        v-if="!connected"
      >
        <span class="mr-2">Connect</span>
      </v-btn>
      <span v-else class="mr-2">Connected</span>
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
.home {
  cursor: pointer;
}
.explorer {
  margin-right: 1em;
  background: rgb(241, 239, 239);
  padding: 0.2em;
  padding-right: 0.4em;
  padding-left: 0.4em;
  border-radius: 0.2em;
}
.explorer span {
  cursor: pointer;
  color: black;
}
.v-main {
  background: #1b203a !important;
}
</style>