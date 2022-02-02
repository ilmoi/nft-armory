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
  
  <tabs v-if="doMyQuestionsExist && (tabType == 'myQuestions')" direction="vertical" v-model="myQuestionList">
      <tab v-for="(n, idx) in myQuestionList" :key="n.id" :id="idx" :title='readTicketName(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked by you X mins ago</div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            <hr style="border: 1px solid #697077;"/>
            <div class="gmnh-tab-content-status">{{getAnswer(n)}}</div>
        </div> 
    </tab>
   </tabs>

    <tabs v-if="doOpenQuestionsExist && (tabType == 'openQuestions')" direction="vertical" v-model="openQuestionList" >
      <tab v-for="(n, idx) in openQuestionList" :key="n.id" :id="idx" :title='readTicketName(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked by someone X mins ago</div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            <IWantUrNFTForm @answer-submitted="answerSubmitted" :is-question=false :fromQuestionDetail=false :questionID="getQuestionId(n)" :hash="getIPFSHash(n)" v-bind:updateOpenQuestions="updateOpenQuestions"/>        
        </div> 
    </tab>
   </tabs>

   <tabs v-if="doAnsweredQuestionsExist && (tabType == 'answeredQuestions')" direction="vertical" v-model="answeredQuestions">
      <tab v-for="(n, idx) in answeredQuestions" :key="n.id" :id="idx" :title='readTicketName(n)'>     
        <div class="gmnh-tab-content">
            <div class="gmnh-tab-content-title">{{readTicketName(n)}}</div>
            <div class="gmnh-tab-content-byline">Asked by someone X mins ago</div>
            <div class="gmnh-tab-content-description">{{getDescription(n)}}</div>
            <hr style="border: 1px solid #697077;"/>
            <div class="gmnh-tab-content-status">{{getAnswer(n)}}</div>
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
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import { PNFT } from '@/common/helpers/types';
import QuestionItem from '@/components/QuestionItem.vue';
import usePinata from '@/composables/pinata';
import * as pnftInteractions from '@/composables/pnftInteractions'

const { isConnected, getWallet, getWalletAddress } = useWallet();
const myQuestions = ref<PNFT[]>([]); // this is everything fetched in mem
const openQuestions = ref<PNFT[]>([]); // this is everything fetched in mem
const answeredQuestions = ref<PNFT[]>([]); // this is everything fetched in mem

const { retrieveMyQuestions, retrieveOpenTickets, retrieveAnsweredQuestions} = usePinata();

export default defineComponent({
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: { 
    updateMyQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            retrieveMyQuestions(getWalletAddress()!) 
            .then((pinataTickets) => {
            if (pinataTickets.length) {
              myQuestions.value = pinataTickets;
            } else {
              //TODO: add error message
            //  updateLoadingStdErr(ERR_NO_NFTS);
            }
          })
        }
      }
    },
    updateOpenQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            retrieveOpenTickets(getWalletAddress()!) 
            .then((pinataTickets) => {
            if (pinataTickets.length) {
              openQuestions.value = pinataTickets;
            } else {
              //TODO: add error message
            //  updateLoadingStdErr(ERR_NO_NFTS);
            }
          })
        }
      }
    },
    updateAnsweredQuestions: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            retrieveAnsweredQuestions(getWalletAddress()!) 
            .then((pinataTickets) => {
            if (pinataTickets.length) {
              answeredQuestions.value = pinataTickets;
            } else {
              //TODO: add error message
            //  updateLoadingStdErr(ERR_NO_NFTS);
            }
          })
        }
      }
    },
   
  },
  components: {
        QuestionItem, Tabs, Tab, IWantUrNFTForm
  },
  computed: {
    doMyQuestionsExist() {
      return myQuestions.value.length > 0;
    },
    doOpenQuestionsExist() {
      return openQuestions.value.length > 0;
    },
    doAnsweredQuestionsExist() {
      return answeredQuestions.value.length > 0;
    }
  },
  props: {
    tabType: { type: String, required: true},
    updateMyQuestions: {type: Boolean},
    updateOpenQuestions: {type: Boolean},
    updateAnsweredQuestions: {type: Boolean},

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
    }, getDescription: function(ticket: PNFT) {
      return pnftInteractions.readDescription(ticket);
    }, answerSubmitted: function () {
      //console.log('answer submitted');
    } 
  },
  onUpdated() {
  },
  setup(props) {

    if (props.tabType && props.tabType == 'myQuestions') {

    retrieveMyQuestions(getWalletAddress()!) 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          myQuestions.value = pinataTickets;
        } else {
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      }) 

    } else if (props.tabType && props.tabType == 'openQuestions') {

    retrieveOpenTickets(getWalletAddress()!) 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          openQuestions.value = pinataTickets;
        } else {
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      }) 
    } else if (props.tabType && props.tabType == 'answeredQuestions') {

    retrieveAnsweredQuestions(getWalletAddress()!) 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          answeredQuestions.value = pinataTickets;
        } else {
            //TODO: add error message
        //  updateLoadingStdErr(ERR_NO_NFTS);
        }
      }) 

    }

    return {
      myQuestionList: myQuestions,
      openQuestionList: openQuestions,
      answeredQuestions: answeredQuestions
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
</style>
