<template>
  <div>
    <ConfigPane />
    <div class="p-10">
      <div class="nes-field">
        <label for="addr">Wallet Address:</label>
        <input type="text" id="addr" class="nes-input" v-model="owner" :placeholder="owner" />
      </div>
      <button class="nes-btn is-primary mt-5" @click="fetchNFTs">Load NFTs</button>

      <!--per NFT display-->
      <LoadingBar v-if="isLoading" :progress="progress" :text="text" class="my-5" />
      <div v-else-if="isError" class="nes-text is-error my-5">
        Oh no something went wrong! Try again?
      </div>
      <div v-else>
        <NFTView v-for="n in NFTs" :key="n.mint" :n="n"> </NFTView>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PublicKey } from '@solana/web3.js';
import { INFT } from '@/TEMP/helpers/types';
import 'vue-json-pretty/lib/styles.css';

import ConfigPane from '@/components/ConfigPane.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import { getNFTs } from '@/common/NFTget';
import NFTView from '@/components/NFTView.vue';
import useLoading, { LoadStatus } from '@/composables/loading';
import { EE } from '../globals';

export default defineComponent({
  components: {
    NFTView,
    LoadingBar,
    ConfigPane,
  },
  setup() {
    const owner = ref('AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX');
    const NFTs = ref<INFT[]>([]);

    const { progress, text, isLoading, isError, updateLoading } = useLoading();

    const fetchNFTs = () => {
      updateLoading({ newStatus: LoadStatus.Loading, maxProgress: 50 });

      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      NFTs.value = []; // clear while loading
      getNFTs({ owner: new PublicKey(owner.value) })
        .then((n) => {
          NFTs.value = n;
          updateLoading({ newStatus: LoadStatus.Success });
        })
        .catch((e) => {
          updateLoading({ newStatus: LoadStatus.Error });
        });
    };

    return {
      owner,
      NFTs,
      progress,
      text,
      isLoading,
      isError,
      fetchNFTs,
    };
  },
});
</script>

<style scoped></style>
