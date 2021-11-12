<template>
  <div class="relative h-full min-h-screen">
    <!--navbar + logo-->
    <TheNavBar />
    <div class="pt-10 px-10 flex justify-center align-middle">
      <p class="text-4xl pt-3 px-1 text-black underline">NFT</p>
      <TheLogo />
      <p class="text-4xl pt-3 px-2 text-black underline">ARMORY</p>
    </div>

    <!--body-->
    <div class="p-10">
      <router-view />
    </div>

    <!--cat + footer-->
    <TheCat />
    <TheFooter />

    <!-- no mobile -->
    <TheMobileCover v-if="windowWidth < 800" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheCat from '@/components/TheCat.vue';
import TheMobileCover from '@/components/TheMobileCover.vue';

export default defineComponent({
  components: { TheMobileCover, TheCat, TheFooter, TheLogo, TheNavBar },
  setup() {
    const windowWidth = ref(window.innerWidth);
    const onWidthChange = () => {
      windowWidth.value = window.innerWidth;
    };
    onMounted(() => window.addEventListener('resize', onWidthChange));
    onUnmounted(() => window.removeEventListener('resize', onWidthChange));

    return {
      windowWidth,
    };
  },
});
</script>

<style>
* {
  font-family: 'Press Start 2P', monospace;
}
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
