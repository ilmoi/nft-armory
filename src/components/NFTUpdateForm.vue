<template>
  <div>
    <form @submit.prevent="updateTheNFT">
      <div class="nes-field">
        <div><label for="editionMint">NFT Mint:</label></div>
        <input
          type="text"
          id="editionMint"
          class="nes-input"
          v-model="editionMint"
          :placeholder="editionMint"
        />
      </div>
      <div class="nes-field mt-5">
        <div>
          <label for="newMetadataData">New Metadata as JSON (optional):</label>
          <QuestionMark @click="showModal('tooltipMetadata')" />
        </div>
        <textarea
          rows="5"
          id="newMetadataData"
          class="nes-input"
          v-model="newMetadataData"
          :placeholder="newMetadataData"
        ></textarea>
      </div>
      <div class="nes-field mt-5">
        <div><label for="newUpdateAuthority">New Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="newUpdateAuthority"
        />
      </div>
      <div>
        <label for="primarySaleHappened" class="mt-5">Primary Sale Happened? (optional):</label>
        <QuestionMark external="https://docs.metaplex.com/nft-standard#token-metadata-program" />
      </div>
      <div class="nes-select">
        <select required id="primarySaleHappened" v-model="primarySaleHappened">
          <option :value="null">select</option>
          <option :value="true">yes, it's over</option>
        </select>
      </div>
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Update NFT
      </button>
    </form>

    <!--notifications-->
    <NotifyError v-if="!isConnected" class="mt-5">
      Connect your wallet above to update an NFT.
    </NotifyError>
    <NotifyError v-if="error" class="mt-5">
      Uh oh something went wrong - {{ error }}. See console for more details.</NotifyError
    >
    <NotifyInfo v-if="isLoading" class="mt-5">Sit tight...</NotifyInfo>
    <NotifySuccess v-if="txId" class="mt-5">
      <p>Update successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!updatedNFT"
        >Loading your updated NFT... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <ExplorerLink :tx-id="txId" />
        <NFTViewCard :n="updatedNFT" class="text-black" />
      </div>
    </NotifySuccess>

    <!--modals-->
    <ModalWindow
      v-if="isModalVisible('tooltipMetadata')"
      title="How to format Metadata?"
      @hide-modal="hideModal('tooltipMetadata')"
    >
      <ContentTooltipMetadata />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PublicKey } from '@solana/web3.js';
import QuestionMark from '@/components/QuestionMark.vue';
import NotifyError from '@/components/content/notifications/NotifyError.vue';
import NotifySuccess from '@/components/content/notifications/NotifySuccess.vue';
import NotifyInfo from '@/components/content/notifications/NotifyInfo.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { INFT } from '@/common/helpers/types';
import { getNFTs } from '@/common/NFTget';
import { updateNFT } from '@/common/NFTupdate';
import useModal from '@/composables/modal';
import ExplorerLink from '@/components/ExplorerLink.vue';
import { objectOneInsideObjectTwo } from '@/common/helpers/util';
import ContentTooltipMetadata from '@/components/content/tooltip/ContentTooltipMetadata.vue';

export default defineComponent({
  components: {
    ContentTooltipMetadata,
    ExplorerLink,
    ModalWindow,
    NFTViewCard,
    LoadingIcon,
    NotifyInfo,
    NotifySuccess,
    NotifyError,
    QuestionMark,
  },
  setup() {
    const { isConnected, getWallet } = useWallet();
    const { error, clearError, setError, tryConvertToPk, tryParseJSON, tryParseMetadataData } =
      useError();

    const isLoading = ref<boolean>(false);
    const txId = ref<string | null>(null);
    const updatedNFT = ref<INFT | null>(null);

    const clearPreviousResults = () => {
      isLoading.value = false;
      txId.value = null;
      updatedNFT.value = null;
      clearError();
    };

    // --------------------------------------- update nft
    const editionMint = ref<string | null>('49GGYd6PyascDX5rb12s8oP5XNhjfF2bvaMteFxLeEud');
    const newMetadataData = ref<any>(null);
    const newUpdateAuthority = ref<string | null>(null);
    const primarySaleHappened = ref<boolean | null>(null);

    const fetchUpdatedNFT = async (): Promise<void> => {
      // retry recursively until new attributes confirmed on the network
      try {
        // eslint-disable-next-line prefer-destructuring
        const fetchedNFT = (await getNFTs({ mint: new PublicKey(editionMint.value!) }))[0];
        // if any of the below conditions fail, then we need to fetch again
        if (
          (newMetadataData.value &&
            !objectOneInsideObjectTwo(
              tryParseMetadataData(tryParseJSON(newMetadataData.value)),
              fetchedNFT.metadataOnchain.data
            )) ||
          (newUpdateAuthority.value &&
            newUpdateAuthority.value !== fetchedNFT.metadataOnchain.updateAuthority) ||
          // primary sale can only be set to "true" = the only use case we're checking
          (primarySaleHappened.value &&
            (fetchedNFT.metadataOnchain.primarySaleHappened as any as number) !== 1)
        ) {
          return await fetchUpdatedNFT();
        }

        updatedNFT.value = fetchedNFT;
      } catch (e) {
        await fetchUpdatedNFT();
      }
    };

    const updateTheNFT = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const parsedJSON = tryParseJSON(newMetadataData.value);
      let parsedMetadata;
      if (parsedJSON) parsedMetadata = tryParseMetadataData(parsedJSON);
      const editionPk = tryConvertToPk(editionMint.value);
      const updatePk = tryConvertToPk(newUpdateAuthority.value);
      if (error.value) {
        return;
      }

      updateNFT(
        getWallet() as any,
        editionPk!,
        parsedMetadata as any, // null-undefined conflict
        updatePk as any, // null-undefined conflict
        primarySaleHappened.value as any // null-undefined conflict
      )
        .then(async (result: string) => {
          txId.value = result;
          isLoading.value = false;
          await fetchUpdatedNFT();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipMetadata');

    return {
      isConnected,
      error,
      isLoading,
      txId,
      updatedNFT,
      // update
      editionMint,
      newMetadataData,
      newUpdateAuthority,
      primarySaleHappened,
      updateTheNFT,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped></style>
