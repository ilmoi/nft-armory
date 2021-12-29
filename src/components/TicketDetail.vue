<template>
    <div v-if="ticket" class="flex">
      <NFTViewCard :n="ticket" class="text-black" />
    </div>
</template>


<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
// @ts-ignore
import { PublicKey } from '@solana/web3.js';

import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { INFT, INFTParams } from '@/common/helpers/types';
import { useRoute } from 'vue-router';
import NFTViewCard from '@/components/NFTViewCard.vue';
import { NFTGet } from '@/common/NFTget';
import useCluster, { Cluster } from '@/composables/cluster';

export default defineComponent({
  components: {
    NFTViewCard, 
  },
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

    console.log("HERE!");

    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const { error, clearError, setError } = useError();

   //const ticketID = ref<string | null>(null);

    const ticket = ref<INFT | null>(null);
    const ticketID = ref<string | null>(null);

   // var fetchedTickets = ref<INFT[]>([]); 

        console.log("HERE2!");

    const chosenMethod = ref<string>('ticketID');


    //console.log("TICKET ID", ticketID);

    const fetchTicket = async (ticketID:string) => {
        console.log("in fetch ticket with ticketID!", ticketID);

       if (ticketID != null) {
            try {
                await NFTGet({ mint: new PublicKey(ticketID) })
                .then((fetchedNFT) => {
                    console.log(fetchedNFT);
                    [ticket.value] = fetchedNFT;
                });          
            } catch (e) {
                console.log("error", e);
                return null;    
            }

        } 
       
    };
        console.log("HERE3!");

    // --------------------------------------- sharing links
    onMounted(() => {
      const route = useRoute();
      const {
        ticketID: goTicketID
      } = route.params;

      if (goTicketID !== undefined || goTicketID !== null) {
          ticketID.value = goTicketID as any as string;
          fetchTicket(ticketID.value);
      }

      /* console.log("route params", route.params);
            console.log("route params", route.params.ticketID);

      console.log("ticketID", goTicketID);
      */

    });

     return {
         isConnected,
        ticket: ticket,
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
