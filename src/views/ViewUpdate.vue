<template>
  <div>
    <ConfigPane />
    <NFTUpdateForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfigPane from '@/components/ConfigPane.vue';
import NFTUpdateForm from '@/components/NFTUpdateForm.vue';

export default defineComponent({
  components: { NFTUpdateForm, ConfigPane },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
