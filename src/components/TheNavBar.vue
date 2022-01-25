<template>
  <nav class="navbar navbar-expand-lg">
      <div class="container">
        <a class="fs-5 fw-bold text-decoration-none primary-color" href="#">GMneedhelp</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14 primary-color" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
            </svg>
          </span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div class="d-flex">
            <div class="d-flex align-items-center">
              <div class="placeholder me-2"></div>
              <ConfigPane />
            </div>
          </div>
        </div>
      </div>
    </nav>
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
