<template>
    <div class="question-nav"><a href="/" class="gmnh-back">&laquo; Back</a></div> 
    <div v-if="doesQuestionExist && !errorFinding" direction="vertical" class="gmnh-detail">
      <div v-for="(n, idx) in question" :key="n.id" :id="idx">     
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked XXX mins ago</div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            <hr style="border: 1px solid #697077;"/>
            <div v-if="!needsToBeAnswered(n)" class="gmnh-tab-content-status">{{getAnswer(n)}}</div>
<!--            <img class="gmnh-tab-content-nft" v-bind:src="getImageUrl(n)"/> -->
            <div v-else-if="!isConnected" style="margin: 0 auto;">
                    <span class="wallet-text" style="justify-content: center; display: flex; margin-top: 16px;">Connect your Solana wallet to answer this question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </div>
            <div v-else>
              <IWantUrNFTForm :questionID="getQuestionId(n)" :hash="getIPFSHash(n)" :fromQuestionDetail="true"/>
            </div>
      </div>

    </div>
    <div v-if="errorFinding" class="gmnh-detail gmnh-tab-content-title">
      Question Not Found!
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
// @ts-ignore
import { PublicKey } from '@solana/web3.js';

import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { INFT } from '@/common/helpers/types';
import { useRoute } from 'vue-router';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import useCluster, { Cluster } from '@/composables/cluster';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import usePinata from '@/composables/pinata';
import * as pnftInteractions from '@/composables/pnftInteractions';
import { PNFT } from '@/common/helpers/types';

const { isConnected, getWallet, getWalletAddress } = useWallet();
const question = ref<PNFT[]>([]); // this is everything fetched in mem

const ticket = ref<INFT | null>(null);
const ticketID = ref<string | null>(null);
const errorFinding = ref<boolean>(false);


export default defineComponent({
  components: {
    NFTViewCard, IWantUrNFTForm, ConfigPane
  },
  computed: {
    doesQuestionExist() {
      return question.value.length > 0;
    }
  },
  methods: {
      readTicketName: function(ticket: PNFT) {
      return pnftInteractions.readTicketName(ticket)
    }, getImageUrl: function(ticket: PNFT) {
      return pnftInteractions.getImageURL(ticket)
    }, getQuestionId: function(ticket: PNFT) {
      return pnftInteractions.readMintID(ticket);  
    }, getIPFSHash: function(ticket: PNFT) {
      return pnftInteractions.readIPFSHash(ticket);  
    }, getAnswer: function(ticket: PNFT) {
      return pnftInteractions.getAnswerText(ticket);
    }, needsToBeAnswered: function(ticket: PNFT) {
      return pnftInteractions.needsToBeAnswered(ticket);
    }, getDescription: function(ticket: PNFT) {
      return pnftInteractions.readDescription(ticket);
    }
  },
  setup() {

    //todo: temporary, but set to DEV for now
    const { cluster, setCluster, getClusterURL } = useCluster();
    /*
    const chosenCluster = computed({
      get() {
        return cluster.value;
      },
      set(newVal: Cluster) {
        setCluster(newVal);
      },
    }); */
    //setCluster(Cluster.Devnet);

    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const { error, clearError, setError } = useError();

    //grabbing ticketID from URL
    
      const route = useRoute();
      const {
        ticketID: goTicketID
      } = route.params;

      if (goTicketID !== undefined || goTicketID !== null) {
          ticketID.value = goTicketID as any as string;

          const { retrieveByMintId} = usePinata();

          retrieveByMintId(ticketID.value!) 
          .then((pinataTickets) => {
            
          if (pinataTickets.length && pinataTickets.length == 1) {
            question.value = pinataTickets;
        } else {
          errorFinding.value = true;
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      }) 

         // fetchTicket(ticketID.value);
      }

      
    

     return {
         isConnected,
        ticketID: ticketID,
        question: question,
        errorFinding
        };
  
  },
});
</script>

<style scoped>
.gmnh-detail {
  margin: 16px;
}

.gmnh-tab-content-title {
    font-size: 24px;
    color: #F2F4F8;
}

.gmnh-tab-content-byline {
    font-size: 13px;
    color: #878D96;
}

.gmnh-tab-content-status {
    font-size: 16px;
    font-weight: bold;
    color: #F2F4F8;
    margin-top: 10px;
}

.gmnh-tab-content-description {
    font-size: 14px;
    color: #878D96;
    margin-top: 8px;
}

.gmnh-tab-content-nft {
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    width: 150px;
}

a.gmnh-back {
  text-decoration: none;
  display: inline-block;
  padding: 8px 16px;
}

a.gmnh-back:hover {
  background-color: #ddd;
  color: black;
}

.gmnh-back {
  background-color: #f1f1f1;
  color: black;
}

.question-nav {
  margin: 16px;
}

.gmnh-answer-wallet-text {
  display: flex;
  justify-content: center;
}
</style>
