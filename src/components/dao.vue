<template>
  <div class="main">
    <h2>Proposals</h2>
    <div
      v-for="proposal in proposals"
      :key="proposal.hash"
    >
      <div
        class="proposal"
      >
        <div class="infoContainer">
          <span>Proposal: {{ proposal.hash }}</span>
          <span>Description: {{ proposal.description }}</span>
          <span>Link: {{ proposal.link }}</span>
        </div>

        <v-row class="votesContainer" v-if="proposal.ayes">
          <v-col
            xs="5"
            md="5"
            class="yesContainer"
            @click="voteProposal(proposal.hash, true)"
          >
            <span>Yes</span>
            <v-progress-circular
              v-if="proposal.hash === selectedProposal && loadingYes"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <span v-else class="counter">{{ proposal.ayes.length }}</span>
          </v-col>

          <v-col
            xs="5"
            md="5"
            class="noContainer"
            @click="voteProposal(proposal.hash, false)"
          >
            <span>No</span>
            <v-progress-circular
              v-if="proposal.hash === selectedProposal && loadingNo"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <span v-else class="counter">{{ proposal.nayes.length }}</span>
          </v-col>
          <v-progress-linear
            class="progress"
            color="light-blue"
            height="18"
            :value="getProgress(proposal.hash)"
            striped
          >
            <template v-slot:default="{ value }">
              <strong>{{ Math.ceil(value) }}% voted</strong>
            </template>
          </v-progress-linear>
        </v-row>

        <span class="tip">Click on yes/no to vote!</span>


        <span class="timer">You can vote until: {{ proposal.timeUntilEnd }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getProposals,
  vote
} from '../lib/dao'
import {
  getFarm,
} from '../lib/farm'
import { getTwinID } from '../lib/twin'
export default {
  async mounted () {
    this.$store.dispatch('getAPI')
    this.proposals = await getProposals(this.$store.state.api)
    this.twinID = await getTwinID(this.$store.state.api, this.$route.params.accountID)
    this.farms = await getFarm(this.$store.state.api, this.twinID)
  },

  computed: {
    // a computed getter
    progress: function (hash) {
      const proposal = this.proposals.filter(p => p.hash === hash)

      const total = proposal.votes.ayes.length + proposal.votes.nayes.length
      return (total / proposal.threshold) * 100
    }
  },

  data () {
    return {
      proposals: [],
      twinID: 0,
      farms: [],
      loadingVote: false,
      loadingYes: false,
      loadingNo: false,
      selectedProposal: undefined
    }
  },

  methods : {
    voteProposal (hash, approve) {
      if (this.farms.length === 0) {
        alert("You need to create a farm first")
        return
      }
      this.selectedProposal = hash
      this.setLoading(approve, true)
      vote(this.$route.params.accountID, this.$store.state.api, this.farms[0].id, hash, approve, (res) => {
        console.log(res)
        if (res instanceof Error) {
          console.log(res)
          return
        }
  
        const { events = [], status } = res
        console.log(`Current status is ${status.type}`)
        switch (status.type) {
          case 'Ready': this.$toasted.show(`Transaction submitted`)
        }
      
        if (status.isFinalized) {
          console.log(`Transaction included at blockHash ${status.asFinalized}`)
      
          // Loop through Vec<EventRecord> to display all events
          events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if (section === 'dao' && method === 'Voted') {
              this.$toasted.show('Voted for proposal!')
              this.setLoading(approve, false)
              getProposals(this.$store.state.api)
                .then(proposals => this.proposals = proposals)
            } else if (section === 'system' && method === 'ExtrinsicFailed') {
              this.$toasted.show('Vote failed')
              this.setLoading(approve, false)
            }
          })
        }
      }).catch(err => {
        this.$toasted.show(err.message)
        this.setLoading(approve, false)
      })
    },
    setLoading (approve, value) {
      if (approve) {
        this.loadingYes = value
      } else {
        this.loadingNo = value
      }
    },
    getProgress (hash) {
      const proposal = this.proposals.filter(p => p.hash === hash)[0]

      console.log(proposal)
      const total = proposal.ayes.length + proposal.nayes.length
      return (total / proposal.threshold) * 100
    }
  }
}
</script>
<style scoped>
.main {
  width: 100% !important;
  margin: auto;
}
.main h2 {
  text-align: center;
}
.link {
  color: white !important;
}
.proposal {
  display: flex;
  flex-direction: column;
  background: #252c48 !important;
  width: 70%;
  padding: 1em;
  padding-bottom: 2em;
  border-radius: 0.3em;
  margin: auto;
  margin-bottom: 1em;
  margin-top: 1em;
}
.proposal span {
  color: white;
}
.infoContainer {
  padding: 1em;
  display: flex;
  flex-direction: column;
}
.votesContainer {
  height: 5em;
  margin: 1em;
  margin-top: 0;
  margin-bottom: 2em;
  display: flex;
  justify-content: space-between !important;
}
.yesContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #86B049;
  border-radius: 0.3em;
  cursor: pointer;
}
.yesContainer span {
  color: white;
  font-size: 24px;
}
.noContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FF4359;
  border-radius: 0.3em;
  cursor: pointer !important;
}
.noContainer span {
  color: white;
  font-size: 24px;
}
.counter {
  color: white !important;
  font-size: 32px !important;
}
.tip {
  margin-top: 2em;
  text-align: center;
  color: rgb(160, 160, 160) !important;
  font-size: 20px;
}
.timer {
  margin-top: 1em;
  text-align: center;
  color: rgb(160, 160, 160) !important;
  font-size: 20px;
}
.progress {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
