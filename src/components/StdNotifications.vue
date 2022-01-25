<template>
  <div>
    <NotifyError v-if="!isConnected" class="mt-5">
      Connect your wallet above to mint new NFTs.
    </NotifyError>
    <NotifyError v-if="error" class="mt-5">
      Uh oh something went wrong - {{ error }}. See console for more details.
    </NotifyError>
    <NotifyInfo v-if="isLoading || isCreated" :mint-id="mintId" :is-question="isQuestion" :is-loading="isLoading" :is-created="isCreated" class="mt-5"></NotifyInfo>
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
    isCreated: Boolean,
    error: String,
    mintId: String,
    isLoading: Boolean,
    isQuestion: Boolean
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
