<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />
      
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
                    <span class="wallet-text">Connect your wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="Open Questions">
            <section v-if="isConnected">
              <QuestionList tabType="openQuestions" v-bind:updateOpenQuestions="updateOpenQuestions"/>
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your wallet to ask a question!</span>
                    <ConfigPane/>
                    <span class="no-wallet-text">Don't have a wallet? Download&nbsp;<a class="phantom-link" target="_blank" href="https://phantom.app/">Phantom</a>.</span>
            </section>
          </tab>
          <tab title="Answered Questions">
            <section v-if="isConnected">
              <QuestionList tabType="answeredQuestions" v-bind:updateAnsweredQuestions="updateAnsweredQuestions"/>
            </section>
            <section v-else class="gmnh-wallet-center">
                    <span class="wallet-text">Connect your wallet to ask a question!</span>
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
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import TheFooter from '@/components/TheFooter.vue';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';
import QuestionList from '@/components/QuestionList.vue';
import TicketDetail from '@/components/TicketDetail.vue';

import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import useWallet from './composables/wallet';

const clearAskQuestion = ref<Boolean>(false);
const updateMyQuestions = ref<Boolean>(false);
const updateOpenQuestions = ref<Boolean>(false);
const updateAnsweredQuestions = ref<Boolean>(false);

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
  setup() {
    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => {
      windowWidth.value = window.innerWidth;
    };
    onMounted(() => window.addEventListener('resize', onWidthChange));
    onUnmounted(() => window.removeEventListener('resize', onWidthChange));

    return {
      windowWidth,
      isConnected,
      clearAskQuestion,
      updateMyQuestions,
      updateOpenQuestions,
      updateAnsweredQuestions
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

</style>
