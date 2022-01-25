<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />
      
      <!-- tabs -->
      <div v-if="isConnected && $route.name !== 'Ticket Details'" class="container mt-3">
        <tabs>
          <tab title="Ask a Question">
                  <section class="mt-3">
                    <IWantUrNFTForm :is-question=true />
                  </section>
          </tab>
          <tab title="My Questions">
            <QuestionList tabType="myQuestions"/>
          </tab>
          <tab title="Open Questions">
            <QuestionList tabType="openQuestions"/>
          </tab>
        </tabs>
      </div>
      <div v-else-if="isConnected && $route.name == 'Ticket Details'">
        <TicketDetail/>
      </div>
      <div v-if="!isConnected" class="gmnh-wallet-center">
        <span class="wallet-text">Connect your wallet to ask a question!</span>
        <ConfigPane/>
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

export default defineComponent({
  components: { TheFooter, TheLogo, ConfigPane, TheNavBar, Tab, Tabs, IWantUrNFTForm, QuestionList, TicketDetail},

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

</style>
