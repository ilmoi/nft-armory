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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';
import TheFooter from '@/components/TheFooter.vue';
import TheCat from '@/components/TheCat.vue';

export default defineComponent({
  components: { TheCat, TheFooter, TheLogo, TheNavBar },
  setup() {
    return {};
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
