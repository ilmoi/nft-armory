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
          :placeholder="editionMint"
        />
      </div>
      <div class="nes-field mt-5">
        <div>
          <label for="newMetadataData">New Metadata as JSON (optional):</label>
          <QuestionMark />
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
      <div class="nes-field mt-5">
        <div><label for="primarySaleHappened">Primary Sale Happened? (optional):</label></div>
        <select required id="primarySaleHappened" v-model="primarySaleHappened">
          <option :value="null">select</option>
          <option :value="false">no</option>
          <option :value="true">yes</option>
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
      Connect your wallet above to update your NFT.
    </NotifyError>
    <NotifyError v-if="error" class="mt-5"> Uh oh something went wrong - {{ error }} </NotifyError>
    <NotifyInfo v-if="isLoading" class="mt-5">Sit tight...</NotifyInfo>
    <NotifySuccess v-if="txId" class="mt-5">
      <p>Update successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!updatedNFT"
        >Loading your updated NFT...</LoadingIcon
      >
      <NFTViewCard v-else :n="updatedNFT" class="text-black" />
    </NotifySuccess>

    <!--modals-->
    <ModalWindow
      v-if="isModalVisible('tooltipMetadata')"
      title="How to format Metadata?"
      @hide-modal="hideModal('tooltipMetadata')"
    >
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

export default defineComponent({
  components: {
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
    const { error, clearError, setError, tryConvertToPk } = useError();

    const isLoading = ref<boolean>(false);
    const txId = ref<string | null>(null);
    const updatedNFT = ref<INFT | null>(null);

    const fetchUpdatedNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        // eslint-disable-next-line prefer-destructuring
        updatedNFT.value = (await getNFTs({ mint: new PublicKey(editionMint.value!) }))[0];
      } catch (e) {
        await fetchUpdatedNFT();
      }
    };

    const clearPreviousResults = () => {
      isLoading.value = false;
      txId.value = null;
      updatedNFT.value = null;
      clearError();
    };

    // --------------------------------------- update nft
    const editionMint = ref<string | null>('59NgveNYgXMsP5SJw7Fw7e3ah7EacaoskxX3PXEV1TFT');
    const newMetadataData = ref<any>(null);
    const newUpdateAuthority = ref<string | null>(null);
    const primarySaleHappened = ref<boolean | null>(null);
    const updateTheNFT = async () => {
      clearPreviousResults();
      isLoading.value = true;

      // todo need to error check the json provided metadata - what's the right format there even?

      // if PKs don't deserialize, we don't want to call the rest of the function
      const editionPk = tryConvertToPk(editionMint.value!);
      const updatePk = tryConvertToPk(newUpdateAuthority.value!);
      if (error.value) {
        return;
      }

      updateNFT(
        getWallet() as any,
        editionPk!,
        newMetadataData.value,
        updatePk as any, // null-undefined conflict
        primarySaleHappened as any // null-undefined conflict
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
