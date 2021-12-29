<template>
  <div>
    <ConfigPane />
    <TicketDetail />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ConfigPane from '@/components/ConfigPane.vue';
import TicketDetail from '@/components/TicketDetail.vue';

export default defineComponent({
  components: { ConfigPane, TicketDetail},
  setup() {
    return {};
  },
});
</script>

<style scoped></style>