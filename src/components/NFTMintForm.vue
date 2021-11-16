<template>
  <div>
    <div class="nes-container with-title">
      <p class="title">
        Type of NFT to mint:
        <QuestionMark external="https://docs.metaplex.com/about/terminology#master-edition" />
      </p>
      <div class="text-gray-400 mt-2 flex justify-around">
        <label>
          <input type="radio" class="nes-radio" value="master" v-model="chosenNFTType" />
          <span>Master Edition</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="print" v-model="chosenNFTType" />
          <span>Standard Edition (Print)</span>
        </label>
      </div>
    </div>

    <NotifyWarning class="mt-5" v-if="chosenNFTType === 'print'">
      (!) Minting Standard Editions requires 1) that you have the Master Edition in your wallet and
      2) that the max supply cap isn't hit. Read more
      <a
        href="https://docs.metaplex.com/about/terminology#master-edition"
        target="_blank"
        class="nes-text is-primary"
        >here</a
      >.
    </NotifyWarning>

    <!--master-->
    <form v-if="chosenNFTType === 'master'" class="mt-10" @submit.prevent="mintNewMaster">
      <div class="nes-field">
        <div>
          <label for="uri">Arweave / IPFS URI:</label
          ><QuestionMark @click="showModal('tooltipArweave')" />
        </div>
        <input type="text" id="uri" class="nes-input" v-model="uri" :placeholder="DEFAULTS.URI" />
      </div>
      <div class="nes-field mt-5">
        <div><label for="maxSupply">Max Supply (leave blank for uncapped):</label></div>
        <input
          type="number"
          id="maxSupply"
          class="nes-input"
          v-model="maxSupply"
          :placeholder="DEFAULTS.MAX_SUPPLY"
        />
      </div>
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Mint new Master NFT
      </button>
    </form>

    <!--print-->
    <form v-else-if="chosenNFTType === 'print'" class="mt-5" @submit.prevent="mintNewPrint">
      <div class="nes-field mt-5">
        <div><label for="masterEditionMint">Master Edition Mint:</label></div>
        <input
          type="text"
          id="masterEditionMint"
          class="nes-input"
          v-model="masterEditionMint"
          :placeholder="DEFAULTS.MASTER_MINT"
        />
      </div>
      <div class="nes-field mt-5">
        <div><label for="updateAuthority">Update Authority (leave blank for default):</label></div>
        <input
          type="text"
          id="updateAuthority"
          class="nes-input"
          v-model="updateAuthority"
          :placeholder="DEFAULTS.UPDATE_AUTHORITY"
        />
      </div>
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Mint new Print NFT
      </button>
    </form>

    <!--notifications-->
    <StdNotifications :is-connected="isConnected" :is-loading="isLoading" :error="error" />
    <NotifySuccess v-if="mintResult" class="mt-5">
      <p>Mint successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!newNFT"
        >Loading your new NFT... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <ExplorerLink :tx-id="mintResult.txId" />
        <NFTViewCard :n="newNFT" class="text-black" />
      </div>
    </NotifySuccess>

    <!--modals-->
    <ModalWindow
      v-if="isModalVisible('tooltipArweave')"
      title="What's this URI?"
      @hide-modal="hideModal('tooltipArweave')"
    >
      <ContentTooltipArweave />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PublicKey } from '@solana/web3.js';
import QuestionMark from '@/components/QuestionMark.vue';
import { NFTMintEditionFromMaster, NFTMintMaster } from '@/common/NFTmint';
import useWallet from '@/composables/wallet';
import NotifyWarning from '@/components/notifications/NotifyWarning.vue';
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import { IMintResult, INFT } from '@/common/helpers/types';
import LoadingIcon from '@/components/LoadingIcon.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import { NFTGet } from '@/common/NFTget';
import useModal from '@/composables/modal';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipArweave from '@/components/content/tooltip/ContentTooltipArweave.vue';
import useError from '@/composables/error';
import ExplorerLink from '@/components/ExplorerLink.vue';
import StdNotifications from '@/components/StdNotifications.vue';
import { DEFAULTS } from '@/globals';

export default defineComponent({
  components: {
    StdNotifications,
    ExplorerLink,
    ContentTooltipArweave,
    ModalWindow,
    NFTViewCard,
    LoadingIcon,
    NotifySuccess,
    NotifyWarning,
    QuestionMark,
  },
  setup() {
    const { isConnected, getWallet } = useWallet();
    const { error, clearError, setError, tryConvertToPk } = useError();

    const chosenNFTType = ref('master');
    const isLoading = ref<boolean>(false);
    const mintResult = ref<IMintResult | null>(null);
    const newNFT = ref<INFT | null>(null);

    const clearPreviousResults = () => {
      isLoading.value = false;
      mintResult.value = null;
      newNFT.value = null;
      clearError();
    };

    const fetchNewNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        [newNFT.value] = await NFTGet({ mint: new PublicKey(mintResult.value!.mint) });
      } catch (e) {
        await fetchNewNFT();
      }
    };

    // --------------------------------------- master
    const uri = ref<string | null>(null);
    const maxSupply = ref<number | null>(null);
    const mintNewMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;
      NFTMintMaster(getWallet() as any, uri.value!, maxSupply.value as any)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
          isLoading.value = false;
          await fetchNewNFT();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- print
    const masterEditionMint = ref<string | null>(null);
    const updateAuthority = ref<string | null>();

    const mintNewPrint = async () => {
      clearPreviousResults();
      isLoading.value = true;

      // if PKs don't deserialize, we don't want to call the rest of the function
      const masterPk = tryConvertToPk(masterEditionMint.value!);
      const updatePk = tryConvertToPk(updateAuthority.value!);
      if (error.value) {
        return;
      }

      NFTMintEditionFromMaster(getWallet() as any, masterPk!, updatePk as any)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
          isLoading.value = false;
          await fetchNewNFT();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipArweave');

    return {
      DEFAULTS,
      isConnected,
      error,
      chosenNFTType,
      isLoading,
      mintResult,
      newNFT,
      // master
      uri,
      maxSupply,
      mintNewMaster,
      // print
      masterEditionMint,
      updateAuthority,
      mintNewPrint,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped></style>
