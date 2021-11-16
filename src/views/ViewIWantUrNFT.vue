<template>
  <div>
    <ConfigPane />
    <IWantUrNFTForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfigPane from '@/components/ConfigPane.vue';
import IWantUrNFTForm from '@/components/IWantUrNFTForm.vue';

export default defineComponent({
  components: { IWantUrNFTForm, ConfigPane },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
