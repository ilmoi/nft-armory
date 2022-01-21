<template>
  <div style="padding: 16px;">
    <h4>Question Submitted</h4>
    <span v-if="isLoading && !isCreated">Generating a NFT (this may take a minute)...</span>
    <div v-if="isLoading && isCreated">
    <span>NFT created! </span><ExplorerLink :mint-id="mintId" />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ExplorerLink from '@/components/ExplorerLink.vue';

export default defineComponent({
  components: {
    ExplorerLink
  },
  props: {
    isCreated: Boolean,
    isLoading: Boolean,
    mintId: String
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>


</style>
