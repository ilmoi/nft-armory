<template>
  <div class="my-5">
    <p class="nes-text is-error">{{ text ?? 'Oh no something went wrong! Try again?' }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    text: String,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
