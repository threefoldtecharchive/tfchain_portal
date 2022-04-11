<template>
  <div class="container">
    <p style="font-size: 2rem">Dedicated Nodes</p>
    <DNodesTable />
  </div>
</template>

<script>
import DNodesTable from "./nodes/dNodesTable.vue";

export default {
  name: "DNode",
  components: {
    DNodesTable,
  },

};
</script>

<style>
.container {
  width: 90%;
  margin: 0 auto;
}
</style>
