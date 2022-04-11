<template>
  <div class="container">
    <v-btn
      small
      outlined
      :loading="loading"
      color="green"
      v-if="status === 'free'"
      @click="reserveNode(nodeId)"
    >
      Reserve
    </v-btn>
    <v-btn
      small
      outlined
      color="red"
      :loading="loading"
      v-if="status === 'yours'"
      @click="unReserveNode(nodeId)"
    >
      Unreserve
    </v-btn>
    <v-btn small outlined disabled color="gray" v-if="status === 'taken'">
      Taken
    </v-btn>
  </div>
</template>

<script>
import {
  cancelRentContract,
  createRentContract,
  getActiveContracts,
  getRentContractID,
  getRentStatus,
} from "./../../lib/dNodes";
import { getTwinID } from "./../../lib/twin";

export default {
  name: "DNodeBtn",
  props: ["nodeId"],

  data() {
    return {
      status: "free",
      loading: false,
    };
  },

  created: async function () {
    const currentTwinID = await getTwinID(
      this.$store.state.api,
      this.$route.params.accountID
    );
    this.status = await getRentStatus(
      this.$store.state.api,
      this.nodeId,
      currentTwinID
    );
  },

  methods: {
    async reserveNode(nodeId) {
      this.loading = true;
      console.log(`reserving node ${nodeId}`);
      await createRentContract(
        this.$store.state.api,
        this.$route.params.accountID,
        nodeId,
        (res) => {
          console.log(res);
        }
      );
      this.loading = false;
    },

    async unReserveNode(nodeId) {
      this.loading = true;
      console.log(`check for contracts on node ${nodeId}`);

      let contracts = await getActiveContracts(nodeId);
      console.log(contracts);
      if (contracts.length > 0) {
        console.log(`node ${nodeId} has ${contracts.length} active contracts`);
      } else {
        console.log(`unreserving node ${nodeId}`);
        const rentContractID = await getRentContractID(
          this.$store.state.api,
          nodeId
        );
        await cancelRentContract(
          this.$store.state.api,
          this.$route.params.accountID,
          rentContractID,
          (res) => {
            console.log(res);
          }
        );
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>
