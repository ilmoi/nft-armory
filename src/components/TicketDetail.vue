<template>
    <div v-if="ticket" class="flex">
      <NFTViewCard :n="ticket" class="text-black" />
    </div>
    <div v-if="isDataLoaded">
      <IWantUrNFTForm :questionID="ticketID" :uri="ticket.metadataOnchain.data.uri"/>
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

const ticket = ref<INFT | null>(null);
const ticketID = ref<string | null>(null);

export default defineComponent({
  components: {
    NFTViewCard, IWantUrNFTForm
  },
  computed: {
    isDataLoaded() {
      return ticket.value;
    }
} ,
  setup() {

    //todo: temporary, but set to DEV for now
    const { cluster, setCluster, getClusterURL } = useCluster();
    const chosenCluster = computed({
      get() {
        return cluster.value;
      },
      set(newVal: Cluster) {
        setCluster(newVal);
      },
    });
    setCluster(Cluster.Devnet);

    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const { error, clearError, setError } = useError();

    
    const fetchTicket =  (ticketID:string) => {
       if (ticketID != null) {
            try {
                 NFTGet({ mint: new PublicKey(ticketID) })
                .then((fetchedNFT) => {
                    [ticket.value] = fetchedNFT;
                    console.log("ticket: ", ticket);
                });
            } catch (e) {
                console.log("something went wrong when fetching the ticket", e);
                return null;    
            }
        } 
    };

    //grabbing ticketID from URL
    onMounted(() => {
      const route = useRoute();
      const {
        ticketID: goTicketID
      } = route.params;

      if (goTicketID !== undefined || goTicketID !== null) {
          ticketID.value = goTicketID as any as string;
          fetchTicket(ticketID.value);
      }

      
    });

     return {
         isConnected,
        ticket: ticket,
        ticketID: ticketID,
        };
  
  },
});
</script>

<style scoped>
img {
  max-height: 200px;
  max-width: 200px;
}

p {
  @apply my-2;
}

.copy-father {
  position: relative;
}

.copy {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}
</style>
