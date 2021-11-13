<template>
  <div class="cover">
    <img src="../assets/desktop6.gif" />
    <p class="text-xl text-white m-10">Sorry, currently desktop only.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped>
.cover {
  @apply fixed inset-0 flex flex-col justify-center align-middle text-center;
  z-index: 99999;
  background-color: black;
}
</style>
