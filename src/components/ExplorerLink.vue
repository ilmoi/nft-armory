<template>
  View NFT <a class="nes-text is-primary" :href="uri" target="_blank">here</a>.
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useExplorer from '../composables/explorer';

export default defineComponent({
  props: {
    mintId: { type: String, required: true },
  },
  setup(props) {
    const { buildMintUrl } = useExplorer();
    const uri = buildMintUrl(props.mintId);

    return {
      uri,
    };
  },
});
</script>
