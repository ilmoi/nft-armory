<template>
  <div v-if="isQuestion" style="padding: 16px;">
    <h4>Question Submitted</h4>
    <span v-if="isLoading && !isCreated">Generating a NFT (this may take a minute)...</span>
    <div v-if="isLoading && isCreated">
    <span>GMNH Question NFT created! </span><ExplorerLink :mint-id="mintId" />
    </div>
  </div>
  <div v-else style="padding: 16px;">
    <h4>Answer Submitted</h4>
    <span v-if="isLoading && !isCreated">Generating a NFT (this may take a minute)...</span>
    <div v-if="isLoading && isCreated">
    <span>GMNH Answer NFT created! </span><ExplorerLink :mint-id="mintId" />
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
    isQuestion: Boolean,
    mintId: String
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>


</style>
