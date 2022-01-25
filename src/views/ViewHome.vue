<template>
  <div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ViewView from '@/views/ViewView.vue';
import ViewIWantUrNFT from '@/views/ViewIWantUrNFT.vue';
export default defineComponent({
  components: { ViewView, ViewIWantUrNFT },
  setup() {
    const showText = ref(false);
    return {
      showText,
    };
  },
});
</script>

<style scoped></style>
