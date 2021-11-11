<template>
  <div>
    <div v-if="align === 'left'" class="flex">
      <img src="../assets/pixel-cookie.gif" width="40" height="40" class="mr-5" />
      <slot />
    </div>
    <div v-else class="flex justify-center">
      <img src="../assets/pixel-cookie.gif" width="40" height="40" class="mr-5" />
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    align: String,
  },
  setup() {
    return {};
  },
});
</script>
