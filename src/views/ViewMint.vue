<template>
  <div>
    <NFTMintForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NFTMintForm from '@/components/NFTMintForm.vue';

export default defineComponent({
  components: { NFTMintForm },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
