<template>
  <div>
    <TheConfigPane />
    <div class="p-10">
      <div class="nes-field">
        <label for="addr">Wallet Address:</label>
        <input type="text" id="addr" class="nes-input" v-model="owner" :placeholder="owner" />
      </div>
      <button class="nes-btn is-primary mt-5" @click="fetchNFTs">Show NFTs!</button>

      <div v-for="n in NFTs" :key="n.mint" class="my-5 nes-container with-title text-xs">
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
            <button class="nes-btn is-primary" @click="toggleJSON(n.mint)">{ full JSON }</button>
          </div>
        </div>

        <div v-if="openJSONs.indexOf(n.mint) > -1" class="bg-gray-200 mt-5">
          <vue-json-pretty class="text-xs" :data="stringifyPubkeysInObject(n)"></vue-json-pretty>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { PublicKey } from '@solana/web3.js';
import VueJsonPretty from 'vue-json-pretty';
import { getNFTs } from '@/TEMP/get';
import { INFT } from '@/TEMP/helpers/types';
import 'vue-json-pretty/lib/styles.css';
import { stringifyPubkeysInObject } from '@/TEMP/helpers/util';
import TheConfigPane from '@/components/TheConfigPane.vue';

// {{ JSON.stringify(n, undefined, 2); }}

export default defineComponent({
  components: {
    TheConfigPane,
    VueJsonPretty,
  },
  setup() {
    const owner = ref('AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX');
    const NFTs = reactive<INFT[]>([]);
    const openJSONs = reactive<string[]>([]);

    const fetchNFTs = async () => {
      const pulledNFTs = await getNFTs({ owner: new PublicKey(owner.value) });
      pulledNFTs.forEach((n) => NFTs.push(n));
      console.log('done', NFTs);
    };

    const isMaster = (editionType: string) => editionType.toLowerCase().includes('master');

    const toggleJSON = (mint: string) => {
      const idx = openJSONs.indexOf(mint);
      if (idx === -1) {
        openJSONs.push(mint);
      } else {
        openJSONs.splice(idx, 1);
      }
    };

    return {
      owner,
      NFTs,
      openJSONs,
      fetchNFTs,
      isMaster,
      VueJsonPretty,
      toggleJSON,
      stringifyPubkeysInObject,
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
</style>
