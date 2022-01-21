<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />

      
      <!-- tabs -->
      <div v-if="isConnected" class="container mt-3">
        <tabs>
          <tab title="Ask a Question">
                  <section class="mt-3 gmnh-wallet-center">
                    <IWantUrNFTForm  isQuestion="true" />
                    <!--  <router-view /> -->
                  </section>
          </tab>
          <tab title="My Questions">
           <h3>This is Tab 2</h3>
          </tab>
        </tabs>
      </div>

  <!--
        <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active ps-0" aria-current="page" href="#">Ask a Question</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">My Questions</a>
        </li>
      </ul>
      -->
      <!-- body -->

    <div v-else> 
      <div class="gmnh-wallet-center">
        <span class="wallet-text">Connect your wallet to ask a question!</span>
        <ConfigPane/>
      </div>
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
import Tab from '@/components/Tab.vue';
import Tabs from '@/components/Tabs.vue';
import ViewHome from '@/views/ViewHome.vue';
import TheCat from '@/components/TheCat.vue';
import TheMobileCover from '@/components/TheMobileCover.vue';
import useWallet from './composables/wallet';

export default defineComponent({
  components: { TheFooter, TheLogo, ConfigPane, TheNavBar, Tab, Tabs, IWantUrNFTForm },

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

input[type='radio']:checked + span {
  @apply text-black;
}

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
