<template>
  <div>
    <NotifyError v-if="!isConnected" class="mt-5">
      Connect your wallet above to mint new NFTs.
    </NotifyError>
    <NotifyError v-if="error" class="mt-5">
      Uh oh something went wrong - {{ error }}. See console for more details.
    </NotifyError>
    <NotifyInfo v-if="isLoading" class="mt-5">Sit tight...</NotifyInfo>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NotifyError from './notifications/NotifyError.vue';
import NotifyInfo from './notifications/NotifyInfo.vue';

export default defineComponent({
  components: { NotifyInfo, NotifyError },
  props: {
    isConnected: Boolean,
    error: String,
    isLoading: Boolean,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
