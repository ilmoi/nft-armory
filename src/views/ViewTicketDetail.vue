<template>
  <div>
    <TicketDetail />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TicketDetail from '@/components/TicketDetail.vue';

export default defineComponent({
  components: { TicketDetail },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>