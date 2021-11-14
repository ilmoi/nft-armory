<template>
  <div>
    <h1>GM anon 👋</h1>
    <p class="mt-5">
      NFT Armory is a simple tool to
      <router-link to="/view" class="nes-text is-primary">view</router-link>,
      <router-link to="/mint" class="nes-text is-primary">mint</router-link>, and
      <router-link to="/update" class="nes-text is-primary">update</router-link>
      your Metaplex NFTs on Solana.
    </p>
    <p class="mt-5">
      It's primarily meant for developers / artists for quick experimentation and debugging.
    </p>
    <p class="mt-5">
      Click around and have fun exploring. Also check out
      <a
        href="https://github.com/ilmoi/awesome-solana-nfts"
        target="_blank"
        class="nes-text is-primary"
        >other awesome Solana NFT tools</a
      >!
    </p>
    <button class="nes-btn is-primary mt-5" @click="showText = !showText">Why the name?</button>
    <div v-if="showText" class="mt-5 bg-black text-white p-5">
      <p>
        I spent my childhood in MMOs, most of it in WoW. If you did too, you'll remember WoW Armory.
      </p>
      <p class="mt-5">
        The original idea for this tool was something that would let you view / manage / share your
        NFT collection. That sounded a lot like WoW Armory to me, but for NFTs, so I called it that.
      </p>
      <p class="mt-5">Dunno maybe I'm weird ¯\_(ツ)_/¯</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const showText = ref(false);
    return {
      showText,
    };
  },
});
</script>

<style scoped></style>
