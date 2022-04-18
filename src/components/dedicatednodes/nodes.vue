<template>
  <div class="container">
    <p style="font-size: 2rem">Dedicated Nodes</p>
    <NodesTable />
  </div>
</template>

<script>
import NodesTable from "./nodesTable.vue";

export default {
  name: "DedicatedNodes",
  components: {
    NodesTable,
  },

};
</script>

<style>
.container {
  width: 90%;
  margin: 0 auto;
}
</style>
