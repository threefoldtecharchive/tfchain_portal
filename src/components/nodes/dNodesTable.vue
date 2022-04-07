<template>
  <v-data-table
    :headers="headers"
    :items="$store.getters.dNodes"
    :items-per-page="10"
    :loading="$store.getters.loadingDNodes"
    class="elevation-1"
    dark
  >

    <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          @click="reserveNode(item.nodeID)"
          small
          outlined
        >
        Reserve
        </v-btn>
    </template>"
  </v-data-table>
</template>

<script>
import { createRentContract } from "./../../lib/dNodes";

export default {
    name: "DNodesTable",
    
    data () {
        return {
            headers: [
                { text: 'Node ID', value: 'nodeId' },
                { text: 'Location', value: 'location' },
                { text: 'Price In USD', value: 'price' },
                { text: 'After Discount', value: 'disc' },
                { text: 'Actions', value: 'actions' },
            ],
        }
    },

    methods: {
        async reserveNode(nodeId) {
            console.log(`reserve node ${nodeId}`)
            await createRentContract(this.$store.state.api, this.$route.params.accountID, nodeId, (res) => {
                console.log(res)
            })

        }
    }
}


</script>

<style scoped>
.v-data-table {
  background: #252c48;
}
</style>