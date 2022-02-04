<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />
      
  <div v-if="isConnected && shouldShowEmailModal" class="modal" tabindex="-1" style="display: block">
  <div class="modal-dialog" style="margin-top: 200px;">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Enter Email Address</h5>
        <button type="button" v-on:click="shouldShowEmailModal=false" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form v-if="!emailSubmitted" @submit.prevent="enterEmail" class="flex-grow">
        <div style="margin: 10px">Enter your email address so we can notify you when your questions get answered.</div>
        <input type="text" id="emailAddress" placeholder="What's your email address?" class="nes-input gmnh-question focus-visible" v-model="emailAddress" />
        <div class="modal-footer">
        <button v-on:click="shouldShowEmailModal=false" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button
          class="btn btn-primary"
          type="submit"
        >
          Get Notified
        </button>
        </div>
      </form>
      <div v-if="emailSubmitted" style="margin: 10px">
        Thank you for submitting your email.
      </div>
    </div>
  </div>
</div>

      <!-- tabs -->
      <div v-if="$route.name !== 'Ticket Details'" class="container mt-3">
        <tabs @tabChanged="tabChanged">
          <tab title="Trending Questions">
              <section class="wallet-text">
                This section (coming soon!) will feature our top answered questions...
              </section>
          </tab>
          <tab title="Ask a Question" >
                  <section v-if="isConnected" class="mt-3">
                    <IWantUrNFTForm :is-question=true v-bind:clearAskQuestion="clearAskQuestion"/>
                  </section>
                  <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
                  </section>
          </tab>
          <tab title="My Questions">
            <section v-if="isConnected">
              <QuestionList tabType="myQuestions" v-bind:updateMyQuestions="updateMyQuestions" />
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="Open Questions">
            <section v-if="isConnected">
              <QuestionList tabType="openQuestions" v-bind:updateOpenQuestions="updateOpenQuestions"/>
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="Answered Questions">
            <section v-if="isConnected">
              <QuestionList tabType="answeredQuestions" v-bind:updateAnsweredQuestions="updateAnsweredQuestions"/>
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your Solana wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
        </tabs>
      </div>
      <div v-else-if="$route.name == 'Ticket Details'">
        <TicketDetail/>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed} from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import TheFooter from '@/components/TheFooter.vue';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import QuestionList from '@/components/QuestionList.vue';
import TicketDetail from '@/components/TicketDetail.vue';

import {hasUserBeenAsked} from '@/composables/airtable';

import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import useWallet from './composables/wallet';
import {addEmailAddress} from './composables/airtable';

const clearAskQuestion = ref<Boolean>(false);
const updateMyQuestions = ref<Boolean>(false);
const updateOpenQuestions = ref<Boolean>(false);
const updateAnsweredQuestions = ref<Boolean>(false);
const shouldShowEmailModal = ref<Boolean>(false);
const emailSubmitted = ref<Boolean>(false);

const { isConnected, getWallet, getWalletAddress } = useWallet();

const emailAddress = ref('');

export default defineComponent({
  components: { TheFooter, TheLogo, ConfigPane, TheNavBar, Tab, Tabs, IWantUrNFTForm, QuestionList, TicketDetail},
  methods: {
    tabChanged: function (index:Number) {
      if (index == 1) {
        clearAskQuestion.value = true;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = false;
      }
      if (index == 2) {
        clearAskQuestion.value = false;
        updateMyQuestions.value = true;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = false;
      } else if (index == 3) {
        clearAskQuestion.value = false;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = true;
        updateAnsweredQuestions.value = false;
      } else if (index == 4) {
        clearAskQuestion.value = false;
        updateMyQuestions.value = false;
        updateOpenQuestions.value = false;
        updateAnsweredQuestions.value = true;
      }
    }
  },
  watch: { 
    isConnected: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
            hasUserBeenAsked(getWalletAddress()!.toBase58()).
            then(async (result) => {
              //if the user has been asked, then we should not show email (that's why its the opposite)
              shouldShowEmailModal.value = !result;
            });
        }
      }
    }   
  },
  setup() {
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => {
      windowWidth.value = window.innerWidth;
    };
    onMounted(() => window.addEventListener('resize', onWidthChange));
    onUnmounted(() => window.removeEventListener('resize', onWidthChange));

    const enterEmail = async () => {
      if (isConnected.value) {

        addEmailAddress(getWalletAddress()!.toBase58(), emailAddress.value).
            then(async (result) => {
              //once email address has been added, set value to true so we can update modal
              emailSubmitted.value = true;
            });

        ;
      }
    }

    return {
      windowWidth,
      isConnected,
      clearAskQuestion,
      updateMyQuestions,
      updateOpenQuestions,
      updateAnsweredQuestions,
      emailAddress,
      shouldShowEmailModal,
      enterEmail,
      emailSubmitted
    };
  },
});
</script>

<style>
.gmnh-wallet-center {
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.wallet-text {
  font-family: Inter;
  font-weight: 700;
  font-size: 16px;
  color: #F2F4F8;
}

.no-wallet-text {
  font-family: Inter;
  font-weight: 700;
  font-size: 14px;
  color: #F2F4F8;
  justify-content: center;
  display: flex;
  margin-top: 16px;
}

a.phantom-link {
  color: #0d6efd;
  text-decoration: underline;
}

#emailAddress {
  margin: 10px; 
  width: 400px; 
  padding: 5px;

}

</style>
