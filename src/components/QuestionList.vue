<template>
  <!-- <MDBTabs v-model="activeTabId4" vertical>
    <MDBTabNav pills tabsClasses="mb-3 text-center">
    <QuestionItem v-for="(n, index) in PNFTs" :key="n.id" :id="index" :n="n"/>
      </MDBTabNav> 

    <MDBTabContent>
      <MDBTabPane tabId="ex4-0">Tab 1 content</MDBTabPane>
      <MDBTabPane tabId="ex4-1">Tab 2 content</MDBTabPane>
      <MDBTabPane tabId="ex4-2">Tab 1 content</MDBTabPane>
      <MDBTabPane tabId="ex4-3">Tab 2 content</MDBTabPane>
    </MDBTabContent>
  </MDBTabs>  -->
  
  <tabs v-if="doesArrayExist" direction="vertical">
      <tab v-for="(n, idx) in PNFTs" :key="n.id" :id="idx" :title='readTicketName(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked by you 10 mins ago</div>
            <div class="gmnh-tab-content-status">Awaiting answer...</div>
            <hr style="border: 1px solid #697077;"/>
            <img class="gmnh-tab-content-nft" v-bind:src="getImageUrl(n)"/>
        </div> 
    </tab>
   </tabs>

<!--
       <QuestionItem v-for="n in PNFTs" :key="n.id" :n="n"></QuestionItem>

    -->
        
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'; 
import 'vue-json-pretty/lib/styles.css'; 
import useWallet from '@/composables/wallet';
import Tabs from '@/components/Tabs.vue';
import Tab from '@/components/Tab.vue';
import { PNFT } from '@/common/helpers/types';
import QuestionItem from '@/components/QuestionItem.vue';
import usePinata from '@/composables/pinata';
import * as pnftInteractions from '@/composables/pnftInteractions'
import {MDBTabs, MDBTabNav, MDBTabContent, MDBTabItem, MDBTabPane} from 'mdb-vue-ui-kit';

const { isConnected, getWallet, getWalletAddress } = useWallet();
const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem


export default defineComponent({
  data() {
    return {
      componentKey: 0,
    };
  },
  components: {
        QuestionItem,  Tabs, Tab, MDBTabs, MDBTabNav, MDBTabContent, MDBTabItem, MDBTabPane
  },
  computed: {
    doesArrayExist() {
      return allPinataTickets.value.length > 0;
    }
  },
  methods: {
      readTicketName: function(ticket: PNFT) {
      return pnftInteractions.readTicketName(ticket)
    }, getImageUrl: function(ticket: PNFT) {
      return pnftInteractions.getImageURL(ticket)
    },
  },
  setup() {
    
    const { retrieveMyQuestions} = usePinata();


    retrieveMyQuestions(getWalletAddress()!) 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
            console.log("Retrieved");
          allPinataTickets.value = pinataTickets;
        } else {
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      })  

      
    return {
      PNFTs: allPinataTickets,
      retrieveMyQuestions,
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
