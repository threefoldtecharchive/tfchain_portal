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
      <DNodeBtn 
        :nodeId = "item.nodeId"
      />
    </template>

  </v-data-table>
</template>

<script>
import DNodeBtn from "./../../components/nodes/dNodeBtn.vue";

export default {
    name: "DNodesTable",
    components: {
        DNodeBtn
    },
    
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

    created:
        async function() {
          console.log("created")
          const api = this.$store.state.api
          const res = await api.query.tfgridModule.pricingPolicies(0)
          console.log(res.toJSON())
        }
    }


</script>

<style scoped>
.v-data-table {
  background: #252c48;
}
</style>