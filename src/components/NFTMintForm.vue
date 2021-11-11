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
      (!) NOTE: minting Standard Editions requires 1) that you have the Master Edition in your
      wallet and 2) that the max supply cap isn't hit.
      <a
        href="https://docs.metaplex.com/about/terminology#master-edition"
        target="_blank"
        class="nes-text is-primary"
        >Read more</a
      >.
    </NotifyWarning>

    <!--master-->
    <form v-if="chosenNFTType === 'master'" class="mt-10" @submit.prevent="mintNewMaster">
      <div class="nes-field">
        <div>
          <label for="uri">Arweave / IPFS URI:</label
          ><QuestionMark @click="showModal('tooltipArweave')" />
        </div>
        <input type="text" id="uri" class="nes-input" v-model="uri" :placeholder="uri" />
      </div>
      <div class="nes-field mt-5">
        <div>
          <label for="maxSupply">Max Supply (leave blank for uncapped):</label>
        </div>
        <input
          type="number"
          id="maxSupply"
          class="nes-input"
          v-model="maxSupply"
          :placeholder="maxSupply"
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
    <form v-else-if="chosenNFTType === 'print'" class="mt-5" @submit.prevent="mintNewPrint"></form>

    <!--notifications-->
    <NotifyError v-if="!isConnected" class="mt-5">
      Connect your wallet above to mint new NFTs.
    </NotifyError>
    <NotifyError v-if="err" class="mt-5"> Uh oh something went wrong - {{ err }}} </NotifyError>
    <NotifyInfo v-if="isLoading" class="mt-5">Sit tight...</NotifyInfo>
    <NotifySuccess v-if="mintResult" class="mt-5">
      <p>Mint successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!newNFT">Loading your new NFT...</LoadingIcon>
      <NFTViewCard v-else :n="newNFT" class="text-black" />
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
import { mintNewNFT } from '@/common/NFTmint';
import useWallet from '@/composables/wallet';
import NotifyError from '@/components/content/notifications/NotifyError.vue';
import NotifyWarning from '@/components/content/notifications/NotifyWarning.vue';
import NotifyInfo from '@/components/content/notifications/NotifyInfo.vue';
import NotifySuccess from '@/components/content/notifications/NotifySuccess.vue';
import { INFT } from '@/common/helpers/types';
import LoadingIcon from '@/components/LoadingIcon.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import { getNFTs } from '@/common/NFTget';
import useModal from '@/composables/modal';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipArweave from '@/components/content/tooltip/ContentTooltipArweave.vue';

interface IMintResult {
  txId: string;
  mint: PublicKey;
  metadata: PublicKey;
  edition: PublicKey;
}

export default defineComponent({
  components: {
    ContentTooltipArweave,
    ModalWindow,
    NFTViewCard,
    LoadingIcon,
    NotifySuccess,
    NotifyInfo,
    NotifyWarning,
    NotifyError,
    QuestionMark,
  },
  setup() {
    const { isConnected, getWallet } = useWallet();
    const chosenNFTType = ref('master');
    const isLoading = ref<boolean>(false);
    const mintResult = ref<IMintResult | null>(null);
    const newNFT = ref<INFT | null>(null);
    const err = ref<Error | null>(null);

    const fetchNewNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        newNFT.value = (await getNFTs({ mint: new PublicKey(mintResult.value!.mint) }))[0];
      } catch (e) {
        await fetchNewNFT();
      }
    };

    const clearPreviousResults = () => {
      isLoading.value = false;
      mintResult.value = null;
      newNFT.value = null;
      err.value = null;
    };

    // --------------------------------------- master
    const uri = ref<string>(
      'https://gateway.pinata.cloud/ipfs/QmNz2zB8AX15b4hp7JgkEMDLJh9ftwBZciCjo6z2TsxYi1'
    );
    const maxSupply = ref<number | null>(123);
    const mintNewMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;
      mintNewNFT(getWallet() as any, uri.value, maxSupply.value!)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
          isLoading.value = false;
          await fetchNewNFT();
        })
        .catch((e) => {
          err.value = e;
          isLoading.value = false;
        });
    };

    // --------------------------------------- print

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipArweave');

    return {
      chosenNFTType,
      mintResult,
      newNFT,
      isLoading,
      isConnected,
      err,
      // master
      uri,
      maxSupply,
      mintNewMaster,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped></style>
