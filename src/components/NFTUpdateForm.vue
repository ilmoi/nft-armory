<template>
  <div>
    <form @submit.prevent="updateNFT">
      <div class="nes-field">
        <div><label for="editionMint">NFT Mint:</label></div>
        <input
          type="text"
          id="editionMint"
          class="nes-input"
          v-model="editionMint"
          :placeholder="DEFAULTS.MASTER_MINT"
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
          :placeholder="DEFAULTS.METADATA"
        ></textarea>
      </div>
      <div class="nes-field mt-5">
        <div><label for="newUpdateAuthority">New Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="DEFAULTS.UPDATE_AUTHORITY"
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
    <StdNotifications :is-connected="isConnected" :is-loading="isLoading" :error="error" />
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
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { INFT } from '@/common/helpers/types';
import { NFTGet } from '@/common/NFTget';
import { NFTUpdate } from '@/common/NFTupdate';
import useModal from '@/composables/modal';
import ExplorerLink from '@/components/ExplorerLink.vue';
import { objectOneInsideObjectTwo } from '@/common/helpers/util';
import ContentTooltipMetadata from '@/components/content/tooltip/ContentTooltipMetadata.vue';
import StdNotifications from '@/components/StdNotifications.vue';
import { DEFAULTS } from '@/globals';

export default defineComponent({
  components: {
    StdNotifications,
    ContentTooltipMetadata,
    ExplorerLink,
    ModalWindow,
    NFTViewCard,
    LoadingIcon,
    NotifySuccess,
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
    const editionMint = ref<string | null>(null);
    const newMetadataData = ref<any>(null);
    const newUpdateAuthority = ref<string | null>(null);
    const primarySaleHappened = ref<boolean | null>(null);

    const fetchUpdatedNFT = async (): Promise<void> => {
      // retry recursively until new attributes confirmed on the network
      try {
        const [fetchedNFT] = await NFTGet({ mint: new PublicKey(editionMint.value!) });
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

    const updateNFT = async () => {
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

      NFTUpdate(
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
      DEFAULTS,
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
      updateNFT,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped></style>
