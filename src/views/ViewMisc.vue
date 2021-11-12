<template>
  <div>
    <ConfigPane />
    <NFTMiscForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfigPane from '@/components/ConfigPane.vue';
import NFTMiscForm from '@/components/NFTMiscForm.vue';

export default defineComponent({
  components: { NFTMiscForm, ConfigPane },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
