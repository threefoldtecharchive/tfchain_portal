<template>
<div>
    <template>
    <v-data-table
      :headers="headers"
      :items="dNodes"
      :expanded.sync="expanded"
      item-key="nodeId"
      show-expand
      single-expand
      class="elevation-1"
      :items-per-page="10"
      :loading="loading"
      dark
    >
      <template v-slot:[`item.actions`]="{ item }">
        <ActionBtn :nodeId="item.nodeId" />
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <NodeDetails :node="item" class="sheet"/>
        </td>
      </template>

    </v-data-table>
  </template>
</div>
  
</template>

<script>
import { getDNodes } from '../../lib/dedicatedNodes';
import ActionBtn from "./actionBtn.vue";
import NodeDetails from "./nodeDetaills.vue";

export default {
  name: "NodesTable",
  components: {
    ActionBtn,
    NodeDetails
  },

  data() {
    return {
      headers: [
        { text: "Node ID", value: "nodeId" },
        { text: "Location", value: "location.country" },
        { text: "Price In USD", value: "price" },
        { text: "After Discount", value: "discount" },
        { text: "Actions", value: "actions" },
      ],
      loading: false,
      dNodes: [],
      expanded: [],
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

.sheet {
  margin: 10px;
}
</style>
