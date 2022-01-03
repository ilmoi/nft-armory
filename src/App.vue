<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <div v-if="isConnected">
      <TheNavBar />
    </div>
    <div class="pt-10 px-10 flex justify-center align-middle">
      <TheLogo />
      <p class="text-4xl pt-3 px-1">🤝</p>
      <p class="text-4xl pt-3 px-1 text-black underline">HelpDesk</p>
      <p class="text-4xl pt-3 px-1">🤝</p>
    </div>
    <div v-if="!isConnected">
      <ConfigPane />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import ConfigPane from '@/components/ConfigPane.vue';
import TheFooter from '@/components/TheFooter.vue';
import ViewHome from '@/views/ViewHome.vue';
import TheCat from '@/components/TheCat.vue';
import TheMobileCover from '@/components/TheMobileCover.vue';
import useWallet from './composables/wallet';

export default defineComponent({
  components: { TheFooter, TheLogo, ConfigPane, TheNavBar },

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
* {
  font-family: 'Roboto', monospace;
}
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
