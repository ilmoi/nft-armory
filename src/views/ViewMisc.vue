<template>
  <div>
    <TheConfigPane />
    <div>misc</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheConfigPane from '@/components/TheConfigPane.vue';

export default defineComponent({
  components: { TheConfigPane },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
