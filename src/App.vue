<template>
  <TheNavBar />
  <div class="p-10 flex justify-center align-middle">
    <p class="text-4xl pt-3 px-1 text-black underline">NFT</p>
    <TheLogo />
    <p class="text-4xl pt-3 px-2 text-black underline">ARMORY</p>
  </div>

  <router-view />
  <div class="flex justify-center fork">
    <div v-if="showText" class="nes-balloon from-right balloon">
      <p>Fork me on Github</p>
    </div>
    <a href="https://github.com/ilmoi/nft-armory" target="_blank" class="cat">
      <i
        @mouseover="showText = true"
        @mouseleave="showText = false"
        class="nes-octocat animate"
      ></i>
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TheLogo from '@/components/TheLogo.vue';
import TheNavBar from '@/components/TheNavBar.vue';

export default defineComponent({
  components: { TheLogo, TheNavBar },
  setup() {
    const showText = ref(false);
    return {
      showText,
    };
  },
});
</script>

<style>
* {
  font-family: 'Press Start 2P', monospace;
}

.fork {
  position: fixed;
  bottom: 50px;
  right: 50px;
  height: 150px;
}

.balloon {
  width: 200px;
  align-self: flex-start;
}

.cat {
  align-self: flex-end;
}
</style>
