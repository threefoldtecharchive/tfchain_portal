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
        <v-btn color="primary" @click="$router.push('/explorer')">Capacity Explorer</v-btn>
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

    <v-main >
      <router-view v-if="!loadingApi" />
      <v-overlay v-else>
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
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

  data () {
    return {
      loadingApi: true,
    }
  },

  async mounted () {
    await this.$store.dispatch('getAPI')
    this.loadingApi = false
  }
};
</script>
<style scoped>
.home {
  cursor: pointer;
}
.explorer {
  margin-right: 1em;
}
.explorer span {
  cursor: pointer;
  color: black;
}
.v-main {
  background: #1b203a !important;
}
</style>