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
        <span>TF Chain Portal</span>
      </div>

      <v-spacer></v-spacer>
      
      <v-icon
        v-if="!!this.$route.params.accountID"
        @click="$router.push('/')"
      >
        mdi-logout
      </v-icon>
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