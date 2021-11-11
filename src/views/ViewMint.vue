<template>
  <div>
    <ConfigPane />
    <NFTMintForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfigPane from '@/components/ConfigPane.vue';
import NFTMintForm from '@/components/NFTMintForm.vue';

export default defineComponent({
  components: { NFTMintForm, ConfigPane },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
