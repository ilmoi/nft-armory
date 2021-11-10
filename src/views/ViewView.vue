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

    <!--must sit at the very bottom-->
    <infinite-loading
      @infinite="infiniteHandler"
      :identifier="
        new Date() //needs to be something thta dynamically updates, or won't work
      "
      spinner="spiral"
    ></infinite-loading>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
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
    InfiniteLoading,
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
    const displayedNFTs = ref<INFT[]>([]); // this is what's shown on FE
    const allFetchedNFTs = ref<INFT[]>([]); // this is everything fetched in mem

    const getNextBatch = (size: number): INFT[] => {
      if (allFetchedNFTs.value.length === 0) {
        return [];
      }
      if (allFetchedNFTs.value.length > size) {
        return allFetchedNFTs.value.splice(0, size);
      }
      return allFetchedNFTs.value.splice(0, allFetchedNFTs.value.length);
    };

    const fetchNFTs = (params: INFTParams) => {
      updateLoading({
        newStatus: LoadStatus.Loading,
        newProgress: 0,
        maxProgress: 50,
        newText: 'Looking for NFTs...',
      });

      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      // clear for new fetch
      displayedNFTs.value = [];
      allFetchedNFTs.value = [];

      getNFTs(params)
        .then((fetchedNFTs) => {
          if (fetchedNFTs.length) {
            allFetchedNFTs.value = fetchedNFTs;
            const nextBatch = getNextBatch(10);
            displayedNFTs.value.push(...nextBatch);
            updateLoadingStdWin();
          } else {
            updateLoadingStdErr(ERR_NO_NFTS);
          }
        })
        .catch(updateLoadingStdErr);
    };

    const handleSubmitForm = (params: INFTParams) => {
      fetchNFTs(params);
    };

    const infiniteHandler = ($state: any) => {
      const nextBatch = getNextBatch(10);
      if (nextBatch.length) {
        displayedNFTs.value.push(...nextBatch);
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    return {
      NFTs: displayedNFTs,
      progress,
      text,
      isLoading,
      isError,
      handleSubmitForm,
      infiniteHandler,
    };
  },
});
</script>

<style>
/*temp hackaround...*/
.infinite-status-prompt {
  @apply text-white !important;
}
</style>
