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
        <template v-slot:[`item.resources.mru`]="{ item }">
          {{ byteToGB(item.resources.mru) }} GB
        </template>
        <template v-slot:[`item.resources.sru`]="{ item }">
          {{ byteToGB(item.resources.sru) }} GB
        </template>
        <template v-slot:[`item.resources.hru`]="{ item }">
          {{ byteToGB(item.resources.hru) }} GB
        </template>

        <template v-slot:[`item.discount`]="{ item }">
          <v-tooltip bottom color="primary" close-delay="700" >
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">{{ item.discount }} *</span>
            </template>
            <span
              >Discounts: <br />
              <ul>
                <li>{{item.applyedDiscount.first}}% for the dedicated node</li>
                <li>{{item.applyedDiscount.second}}% for the twin balance</li>
              </ul>
              See
              <a target="_blank"
                href="https://library.threefold.me/info/threefold/#/tfgrid/grid/pricing?id=discount-levels"
                ><p style="color: blue; display: inline">discount levels</p></a
              ></span
            >
          </v-tooltip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <ActionBtn :nodeId="item.nodeId" />
        </template>

        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <NodeDetails :node="item" class="sheet" />
          </td>
        </template>
      </v-data-table>
    </template>
  </div>
</template>

<script>
import { getDNodes, byteToGB } from "../../lib/dedicatedNodes";
import ActionBtn from "./actionBtn.vue";
import NodeDetails from "./nodeDetaills.vue";

export default {
  name: "NodesTable",
  components: {
    ActionBtn,
    NodeDetails,
  },

  data() {
    return {
      headers: [
        { text: "Node ID", value: "nodeId" },
        { text: "Location", value: "location.country" },
        { text: "CRU", value: "resources.cru" },
        { text: "MRU", value: "resources.mru" },
        { text: "SRU", value: "resources.sru" },
        { text: "HRU", value: "resources.hru" },
        { text: "Price in USD", value: "discount" },
        { text: "Actions", value: "actions" },
      ],
      loading: false,
      dNodes: [],
      expanded: [],
    };
  },

  created: async function () {
    this.loading = true;
    this.dNodes = await getDNodes(
      this.$store.state.api,
      this.$route.params.accountID
    );
    this.loading = false;
  },

  methods: {
    byteToGB(capacity) {
      return byteToGB(capacity);
    },
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
.v-tooltip__content {
  pointer-events: initial;
}
</style>
