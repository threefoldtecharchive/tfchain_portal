<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      @keydown.esc="dialog = false"
      @click:outside="dialog = false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-web</v-icon>
        </v-btn>
      </template>
      <v-card
    class="mx-auto"
  >
    <v-card
    class="mx-auto"
  >
    <v-list>

      <v-list-group
        :value="false"
        prepend-icon="mdi-database"
      >
        <template v-slot:activator>
          <v-list-item-title>Development</v-list-item-title>
        </template>

        <v-list-item class="item">

          <v-list-item-icon>
            <v-icon>mdi-server</v-icon>
          </v-list-item-icon>

          <v-list-item-content >
            <v-list-item-title @click='changeNetwork("dev")' prepend-icon="mdi-database">wss://tfchain.dev.grid.tf</v-list-item-title>
          </v-list-item-content>

        </v-list-item>

       
      </v-list-group>
    </v-list>


    <v-list>
      <v-list-group
        :value="false"
        prepend-icon="mdi-test-tube"
      >
        <template v-slot:activator>
          <v-list-item-title>Testing</v-list-item-title>
        </template>

        <v-list-item class="item">

          <v-list-item-icon>
            <v-icon>mdi-server</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
              <v-list-item-title @click='changeNetwork("test")'>wss://tfchain.test.grid.tf</v-list-item-title>
            </v-list-item-content>

        </v-list-item>


      </v-list-group>
    </v-list>

  </v-card>
  </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

  export default {

    data: () => ({
      dialog: false,
      network: "dev"
    }),

    methods: {
     
      async changeNetwork(network) {
        await this.$store.commit('setNetwork', { network })
        await this.$store.dispatch('getAPI')
      
        this.dialog = false;
      }
    }
  }
</script>
<style scoped>
.item {
  cursor: pointer;
}
</style>


