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
} from "../../lib/dedicatedNodes";
import { getTwinID } from "../../lib/twin";

export default {
  name: "ActionBtn",
  props: ["nodeId"],

  data() {
    return {
      status: "free",
      loading: false,
    };
  },

  created: async function () {
    this.loading = true;
    this.status = await this.getStatus();
    this.loading = false;
  },

  methods: {
    async getStatus() {
      const currentTwinID = await getTwinID(
        this.$store.state.api,
        this.$route.params.accountID
      );
      return await getRentStatus(
        this.$store.state.api,
        this.nodeId,
        currentTwinID
      );
    },

    reserveNode(nodeId) {
      this.loading = true;
      console.log(`reserving node ${nodeId}`);
      createRentContract(
        this.$store.state.api,
        this.$route.params.accountID,
        nodeId,
        (res) => {
          console.log(res);
          switch (res.status.type) {
            case "Ready":
              this.$toasted.show(
                `Transaction submitted: Reserving node ${nodeId}`
              );
              break;
            case "Finalized":
              this.$toasted.show(
                `Transaction successed: Node ${nodeId} reserved`
              );
              this.getStatus().then((status) => {
                this.status = status;
                this.loading = false;
              });
              break;
          }
        }
      ).catch((err) => {
        console.log(err.message);
        this.$toasted.show(`Error:  ${err.message}`, {
          type: "error",
        });
        this.loading = false;
      });
    },

    async unReserveNode(nodeId) {
      this.loading = true;
      console.log(`check for contracts on node ${nodeId}`);

      const contracts = await getActiveContracts(this.$store.state.api, nodeId);
      if (contracts.length > 0) {
        console.log(`node ${nodeId} has ${contracts.length} active contracts`);
        this.loading = false;
      } else {
        console.log(`unreserving node ${nodeId}`);
        const rentContractID = await getRentContractID(
          this.$store.state.api,
          nodeId
        );
        cancelRentContract(
          this.$store.state.api,
          this.$route.params.accountID,
          rentContractID,
          (res) => {
            console.log(res);
            switch (res.status.type) {
              case "Ready":
                this.$toasted.show(
                  `Transaction submitted: Unreserving node ${nodeId}`
                );
                break;
              case "Finalized":
                this.$toasted.show(
                  `Transaction successed: Node ${nodeId} Unreserved`
                );
                this.getStatus().then((status) => {
                  this.status = status;
                  this.loading = false;
                });
                break;
            }
          }
        ).catch((err) => {
          console.log(err.message);
          this.$toasted.show(`Error:  ${err.message}`, {
            type: "error",
          });
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style>
</style>
