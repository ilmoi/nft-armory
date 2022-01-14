<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-black py-30 px-30">
    <a class="navbar-brand ml-200" href="#">
      GMneedhelp
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <ConnectWalletButton />

    <div class="collapse navbar-collapse justify-end flex" id="navbarSupportedContent">
      <ul class="navbar-nav justify-end align-items-end">
        <li v-if="isConnected" class="nav-item">
          <a class="nav-link" href="/view">See Open Questions</a>
        </li>
        <li v-if="isConnected" class="nav-item">
          <a class="nav-link" href="/urnft">Ask Question</a>
        </li>
        <li class="nav-item">
          <ConfigPane />
        </li>
      </ul>
    </div>
  </nav>
  <!--
  <nav class="navbar navbar-expand-lg justify-end">
    <a class="navbar-brand" href="#">HelpDesk</a>
    <NavButton
      v-for="i in menu"
      :key="i.name"
      :title="i.name"
      :url="i.url"
      :class="'justify-end nav-item' + { active: path === i.url }"
    />
  </nav>-->
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavButton from '@/components/NavButton.vue';
import ConfigPane from './ConfigPane.vue';
import useWallet from '../composables/wallet';

export default defineComponent({
  components: { NavButton, ConfigPane },
  setup() {
    const route = useRoute();
    const path = computed(() => route.path);
    const { isConnected, getWallet, getWalletAddress } = useWallet();


    const menu = [
      { name: 'See Open Questions', url: '/view' },
      { name: 'Ask Question', url: '/urnft' },
    ];

    return {
      menu,
      path,
      isConnected,
    };
  },
});
</script>

<style scoped>
.active {
  @apply text-green-500;
}

.more {
  @apply px-10 py-3 text-green-500
  hover:text-green-500;
  outline: none;
}
</style>
