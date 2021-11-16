<template>
  <div>
    <div>
      Ever wanted to buy an NFT off someone but didn't know who they were / how to contact them?
      Send them an NFT with your contact details - maybe they'll reach out ¯\_(ツ)_/¯
    </div>

    <div class="mt-10">
      <a href="#" class="nes-text is-primary" @click="showModal('tooltipWant')"
        >How does it work?
      </a>
    </div>

    <div class="flex mt-10">
      <form @submit.prevent="mintNewMaster" class="flex-grow">
        <div><label for="nftName">NFT name:</label></div>
        <div><input type="text" id="nftName" class="nes-input" v-model="nftName" /></div>

        <div><label for="contactDets" class="mt-5">Contact Details:</label></div>
        <div><input type="text" id="contactDets" class="nes-input" v-model="contactDets" /></div>

        <div><label for="textSize" class="mt-5">Text Size:</label></div>
        <div><input type="number" id="textSize" class="nes-input" v-model="textSize" /></div>

        <button
          class="nes-btn is-primary mt-5"
          :class="{ 'is-disabled': isLoading || !isConnected }"
          :disabled="isLoading || !isConnected"
          type="submit"
        >
          Mint NFT
        </button>
      </form>

      <div class="display" id="canvas" :style="{ fontSize: `${textSize}px` }">
        <p>I want ur {{ nftName }} NFT.</p>
        <p class="mt-2">Hmu {{ contactDets }}</p>
      </div>
    </div>

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
      v-if="isModalVisible('tooltipWant')"
      title="How does it work?"
      @hide-modal="hideModal('tooltipWant')"
    >
      <ContentTooltipIWantUrNFT />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import html2canvas from 'html2canvas';
// @ts-ignore
import { PublicKey } from '@solana/web3.js';
import usePinata from '@/composables/pinata';
import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import { IMintResult, INFT } from '@/common/helpers/types';
import StdNotifications from '@/components/StdNotifications.vue';
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import ExplorerLink from '@/components/ExplorerLink.vue';
import NFTViewCard from '@/components/NFTViewCard.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipIWantUrNFT from '@/components/content/tooltip/ContentTooltipIWantUrNFT.vue';
import useModal from '@/composables/modal';
import { NFTMintMaster } from '@/common/NFTmint';
import { NFTGet } from '@/common/NFTget';

export default defineComponent({
  components: {
    ContentTooltipIWantUrNFT,
    ModalWindow,
    NFTViewCard,
    ExplorerLink,
    LoadingIcon,
    NotifySuccess,
    StdNotifications,
  },
  setup() {
    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const { error, clearError, setError } = useError();

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

    // --------------------------------------- prep metadata
    const nftName = ref('SMB #1355');
    const contactDets = ref('on twitter: @myname');
    const textSize = ref(23);

    const { uploadImg, uploadJSON, hashToURI } = usePinata();

    const generateImg = async () => {
      const canvas = await html2canvas(document.getElementById('canvas')!);
      const img = canvas.toDataURL('image/png');
      const res = await fetch(img);
      return res.blob();
    };

    const prepareMetadata = async () => {
      const img = await generateImg();
      const imgHash = await uploadImg(img, getWalletAddress()!);
      const jsonHash = await uploadJSON(imgHash, getWalletAddress()!);
      return hashToURI(jsonHash);
    };

    // --------------------------------------- mint newe nft
    const mintNewMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const uri = await prepareMetadata();

      NFTMintMaster(getWallet() as any, uri, 0)
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
    registerModal('tooltipWant');

    return {
      isConnected,
      isLoading,
      mintResult,
      newNFT,
      // prep
      nftName,
      contactDets,
      textSize,
      // mint
      mintNewMaster,
      // modals
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped>
.display {
  @apply text-center flex flex-col justify-center align-middle ml-10 mt-2;
  background-color: rgb(30, 255, 0);
  width: 250px;
  height: 250px;
}
</style>
