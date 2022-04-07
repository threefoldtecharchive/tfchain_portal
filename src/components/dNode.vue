<template>
  <div class="container">
      <p style="font-size: 2rem">Dedicated Nodes</p>
      <DNodesTable />
  </div>
</template>

<script>
import DNodesTable from './nodes/dNodesTable.vue'

export default {
    name: "DNode",
    components: {
        DNodesTable
    },

    async created() {
        if (this.$store.getters.dNodes.length === 0) {
            await this.$store.dispatch('getDNodes')
        }
    }

}
</script>

<style>
.container {
    width: 90%;
    margin: 0 auto;
}
</style>