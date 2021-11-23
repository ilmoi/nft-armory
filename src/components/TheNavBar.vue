<template>
  <nav class="bg-black flex flex-row justify-center align-middle">
    <NavButton
      v-for="i in menu"
      :key="i.name"
      :title="i.name"
      :url="i.url"
      :class="{ active: path === i.url }"
    />
    <a class="more" href="https://github.com/ilmoi/awesome-solana-nfts" target="_blank">🔗</a>
    <a class="more" href="https://nftape.me/" target="_blank">🍌</a>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavButton from '@/components/NavButton.vue';

export default defineComponent({
  components: { NavButton },
  setup() {
    const route = useRoute();
    const path = computed(() => route.path);

    const menu = [
      { name: '/', url: '/' },
      { name: 'VIEW', url: '/view' },
      { name: 'MINT', url: '/mint' },
      { name: 'UPDATE', url: '/update' },
      { name: 'MISC', url: '/misc' },
      { name: 'I WANT UR NFT', url: '/urnft' },
    ];

    return {
      menu,
      path,
    };
  },
});
</script>

<style scoped>
.active {
  @apply bg-white text-black;
}

.more {
  @apply px-10 py-3 text-white
  hover:bg-white hover:text-black;
  outline: none;
}
</style>
