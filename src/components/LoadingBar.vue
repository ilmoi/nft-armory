<template>
  <div>
    <div class="flex flex-col justify-center text-center">
      <progress
        v-if="progress > 66"
        class="nes-progress is-success"
        :value="progress"
        max="100"
      ></progress>
      <progress
        v-else-if="progress > 33"
        class="nes-progress is-warning"
        :value="progress"
        max="100"
      ></progress>
      <progress v-else class="nes-progress is-error" :value="progress" max="100"></progress>
      <div class="flex justify-center">
        <img src="../assets/pixel-cookie.gif" width="40" height="40" class="mr-5" />
        <p class="mt-2">{{ text ?? 'Loading...' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    progress: Number,
    text: String,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
