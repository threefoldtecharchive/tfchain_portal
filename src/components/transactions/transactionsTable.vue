<template>
  <v-data-table
    dark
    :headers="headers"
    :items="transfers"
    :items-per-page="10"
    class="table elevation-1"
    :loading="loading"
  >
    <template v-slot:item.amount="{ item }">
      <span
        :style="{ color: getColor(item) }"
        :color="getColor(item)"
      >
        {{ getPrefix(item) }}{{ item.amount / 1e7 }}
      </span>
    </template>
    <template v-slot:item.timestamp="{ item }">
      <span>
        {{ formatDate(item.timestamp) }}
      </span>
    </template>
  </v-data-table>
</template>
<script>
import { format } from 'date-fns'

export default {
  props: ['transfers', 'loading'],
  data () {
    return {
      headers: [
        { text: 'Value', value: 'amount' },
        {
          text: 'Date',
          align: 'start',
          sortable: false,
          value: 'timestamp',
        },
        { text: 'From', value: 'from' },
        { text: 'To', value: 'to' },
      ],
    }
  },
  methods: {
    getColor (transfer) {
      if (transfer.from === this.$route.params.accountID) {
        return 'red'
      } else {
        return 'green'
      }
    },
    getPrefix (transfer) {
      if (transfer.from === this.$route.params.accountID) {
        return '-'
      } else {
        return '+'
      }
    },
    formatDate (timestamp) {
      return format(new Date(parseInt(timestamp)), "yyyy/MM/dd HH:mm")
    }
  }
}
</script>
<style scoped>
.table {
  background: #252c48 !important;
}
</style>