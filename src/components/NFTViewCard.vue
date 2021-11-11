<template>
  <div class="my-5 nes-container with-title text-xs">
    <p class="title">{{ n.metadataExternal.name }} / {{ n.metadataExternal.symbol }}</p>
    <div class="flex flex-row">
      <img :alt="n.mint" :src="n.metadataExternal.image" />
      <div class="ml-5 text-gray-400">
        <p v-if="isMaster(n.editionType)" class="bg-pink-300 text-black p-2 inline-block">
          {{ n.editionType }}
        </p>
        <p v-else class="bg-gray-300 text-black p-2 inline-block">
          {{ n.editionType }} #{{ n.editionData.edition }}
        </p>
        <p>
          About:
          <span class="text-black">{{ n.metadataExternal.description }}</span>
        </p>
        <p>
          Mint: <span class="text-black">{{ n.mint }}</span>
        </p>
        <p>
          Address: <span class="text-black">{{ n.address }}</span>
        </p>
        <p>
          Owner: <span class="text-black">{{ n.splTokenInfo.owner }}</span>
        </p>
        <button class="nes-btn is-primary" @click="toggleJSON">{ full JSON }</button>
      </div>
    </div>
    <div v-if="fullJSON" class="bg-gray-200 mt-5 copy-father">
      <button class="nes-btn is-primary copy" @click="doCopy">{{ copyText }}</button>
      <vue-json-pretty class="text-xs" :data="stringifyPubkeysAndBNsInObject(n)"></vue-json-pretty>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import useClipboard from 'vue-clipboard3';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';

export default defineComponent({
  props: {
    n: Object,
  },
  components: {
    VueJsonPretty,
  },
  setup(props) {
    const isMaster = (editionType: string) => editionType.toLowerCase().includes('master');
    const fullJSON = ref(false);

    const toggleJSON = () => {
      fullJSON.value = !fullJSON.value;
    };

    // clipboard
    const copyText = ref('copy');
    const { toClipboard } = useClipboard();
    const doCopy = async () => {
      try {
        await toClipboard(JSON.stringify(stringifyPubkeysAndBNsInObject(props.n)));
        copyText.value = 'done!';
        setTimeout(() => {
          copyText.value = 'copy';
        }, 1000);
      } catch (e) {
        console.error(`Error when copying to clipboard - ${e}`);
      }
    };

    return {
      isMaster,
      fullJSON,
      toggleJSON,
      stringifyPubkeysAndBNsInObject,
      doCopy,
      copyText,
    };
  },
});
</script>

<style scoped>
img {
  max-height: 200px;
  max-width: 200px;
}

p {
  @apply my-2;
}

.copy-father {
  position: relative;
}

.copy {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}
</style>
