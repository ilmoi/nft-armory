<template>
     <!-- <NFTViewCard :n="ticket" class="text-white" /> -->
    <div v-if="isConnected && doesQuestionExist && !errorFinding" direction="vertical" class="gmnh-tab-content">
      <div v-for="(n, idx) in question" :key="n.id" :id="idx">     
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked by you 10 mins ago</div>
            <div class="gmnh-tab-content-status">{{getDescription(n)}}</div>
            <div class="gmnh-tab-content-status">{{getAnswer(n)}}</div>
            <hr style="border: 1px solid #697077;"/>
            <img class="gmnh-tab-content-nft" v-bind:src="getImageUrl(n)"/>

            <IWantUrNFTForm v-if="needsToBeAnswered(n)" :questionID="getQuestionId(n)" :hash="getIPFSHash(n)"/>

      </div>

 
    </div>
    <div v-if="errorFinding" class="gmnh-tab-content-title">
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
import { NFTGet } from '@/common/NFTget';
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
    NFTViewCard, IWantUrNFTForm
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
    margin-top: 7px;
}

.gmnh-tab-content-nft {
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
    width: 150px;
}
</style>
