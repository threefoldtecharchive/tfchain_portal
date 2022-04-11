<template>
  <v-data-table
    :headers="headers"
    :items="dNodes"
    :items-per-page="10"
    :loading="loading"
    class="elevation-1"
    dark
  >
    <template v-slot:[`item.actions`]="{ item }">
      <DNodeBtn :nodeId="item.nodeId" />
    </template>
  </v-data-table>
</template>

<script>
import { getDNodes } from '../../lib/dNodes';
import DNodeBtn from "./../../components/nodes/dNodeBtn.vue";

export default {
  name: "DNodesTable",
  components: {
    DNodeBtn,
  },

  data() {
    return {
      headers: [
        { text: "Node ID", value: "nodeId" },
        { text: "Location", value: "location" },
        { text: "Price In USD", value: "price" },
        { text: "After Discount", value: "discount" },
        { text: "Actions", value: "actions" },
      ],
      loading: false,
      dNodes: [],
    };
  },

  created: async function () {
    this.loading = true;
    this.dNodes = await getDNodes(this.$store.state.api);
    this.loading = false;
  },
};
</script>

<style scoped>
.v-data-table {
  background: #252c48;
}
</style>
