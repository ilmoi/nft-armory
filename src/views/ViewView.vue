<template>
  <div>
    <ConfigPane />
    <NFTViewForm :is-loading="isLoading" @submit-form="handleSubmitForm" />

    <!--per NFT display-->
    <LoadingBar v-if="isLoading" :progress="progress" :text="text" class="my-5" />
    <ErrorNotice v-else-if="isError" :text="text" />
    <div v-else>
      <NFTViewCard v-for="n in NFTs" :key="n.mint" :n="n"></NFTViewCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { INFT } from '@/TEMP/helpers/types';
import 'vue-json-pretty/lib/styles.css';

import ConfigPane from '@/components/ConfigPane.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import { getNFTs } from '@/common/NFTget';
import NFTViewCard from '@/components/NFTViewCard.vue';
import useLoading, { LoadStatus } from '@/composables/loading';
import { EE, ERR_NO_NFTS } from '@/globals';
import ErrorNotice from '@/components/ErrorNotice.vue';
import { INFTParams } from '@/common/helpers/types';
import NFTViewForm from '@/components/NFTViewForm.vue';

export default defineComponent({
  components: {
    NFTViewForm,
    ErrorNotice,
    NFTViewCard,
    LoadingBar,
    ConfigPane,
  },
  setup() {
    const {
      progress,
      text,
      isLoading,
      isError,
      updateLoading,
      updateLoadingStdErr,
      updateLoadingStdWin,
    } = useLoading();
    const NFTs = ref<INFT[]>([]);

    const fetchNFTs = (params: INFTParams) => {
      updateLoading({
        newStatus: LoadStatus.Loading,
        newProgress: 0,
        maxProgress: 50,
        newText: 'Looking for NFTs...',
      });

      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      NFTs.value = []; // clear while loading
      getNFTs(params)
        .then((fetchedNFTs) => {
          NFTs.value = fetchedNFTs;
          if (NFTs.value.length === 0) {
            updateLoadingStdErr(ERR_NO_NFTS);
          } else {
            updateLoadingStdWin();
          }
        })
        .catch(updateLoadingStdErr);
    };

    const handleSubmitForm = (params: INFTParams) => {
      fetchNFTs(params);
    };

    return {
      NFTs,
      progress,
      text,
      isLoading,
      isError,
      handleSubmitForm,
    };
  },
});
</script>

<style scoped></style>
