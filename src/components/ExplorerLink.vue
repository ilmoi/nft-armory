<template>
  <p>View <a class="nes-text is-primary" :href="uri" target="_blank">confirmed transaction</a>.</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useExplorer from '../composables/explorer';

export default defineComponent({
  props: {
    txId: { type: String, required: true },
  },
  setup(props) {
    const { buildTxURI } = useExplorer();
    const uri = buildTxURI(props.txId);

    return {
      uri,
    };
  },
});
</script>
