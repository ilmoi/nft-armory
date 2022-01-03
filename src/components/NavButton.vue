<template>
  <router-link :to="url" class="nav-link">
    {{ title }}
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: String,
    url: String,
  },
  setup() {
    return {};
  },
});
</script>
