<template>
  <div>
   <Tabs direction="vertical">
    <Tab v-for="i in testArray" v-bind:key="i" title="test2">     
        <h3>test4</h3>
    </Tab>
   </Tabs>


                      <!--    <QuestionItem v-for="n in PNFTs" :key="n.id" :n="n"></QuestionItem> -->

        
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'; 
import 'vue-json-pretty/lib/styles.css';
import useWallet from '@/composables/wallet';
import Tabs from '@/components/Tabs.vue';
import Tab from '@/components/Tab.vue';
import Test from '@/components/Test.vue'
import { PNFT } from '@/common/helpers/types';
import QuestionItem from '@/components/QuestionItem.vue';
import usePinata from '@/composables/pinata';

const { isConnected, getWallet, getWalletAddress } = useWallet();

export default defineComponent({
  data() {
    return {
      componentKey: 0,
    };
  },
  components: {
        QuestionItem,  Tabs, Tab, Test
  },
  methods: {
    forceRerender() {
      this.componentKey += 1;
    }
  },

  setup() {
    
    const { retrieveMyQuestions} = usePinata();
    const testArray = [1,2];
    console.log(testArray);

    const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem

    retrieveMyQuestions(getWalletAddress()!) 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          allPinataTickets.value = pinataTickets;
        } else {
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      })  
    // --------------------------------------- modal
  
    return {
      PNFTs: allPinataTickets,
      retrieveMyQuestions,
      testArray
    };
  },
});
</script>

<style>
</style>
