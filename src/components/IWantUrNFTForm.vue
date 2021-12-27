<template>
  <div>

    <div class="flex mt-10">
      <form @submit.prevent="mintNewMaster" class="flex-grow">
        <div><label for="nftName">Enter Question:</label></div>
        <div><input type="text" id="nftName" class="nes-input" v-model="nftName" /></div>

        <button
          class="nes-btn is-primary mt-5"
          :class="{ 'is-disabled': isLoading || !isConnected }"
          :disabled="isLoading || !isConnected"
          type="submit"
        >
          Submit Ticket
        </button>
      </form>

      <div class="display" id="canvas" :style="{ fontSize: `${textSize}px` }">
        <p>{{ nftName }}</p>
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
import { PublicKey, Keypair } from '@solana/web3.js';
import { NodeWallet } from '@metaplex/js';

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

    //This is the HelpDesk treasury wallet (9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb) where all NFTs will be minted to
    //todo figure out way to not dox private key
    const helpDeskWallet = new NodeWallet(
      Keypair.fromSecretKey(
      new Uint8Array([247,1,238,242,163,40,18,160,99,149,90,132,55,51,84,3,211,255,176,126,122,79,119,229,169,138,219,91,40,47,96,183,131,38,5,227,24,77,6,14,158,169,248,74,231,49,207,74,241,99,23,77,11,32,122,163,63,11,211,169,249,69,52,48])));

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
    const nftName = ref('Crypto Question');
    const contactDets = ref('BLANK');
    const textSize = ref(12);

    const { uploadImg, uploadJSON, hashToURI } = usePinata();

    const generateImg = async () => {
      const canvas = await html2canvas(document.getElementById('canvas')!);
      const img = canvas.toDataURL('image/png');
      const res = await fetch(img);
      return res.blob();
    };

    const prepareMetadata = async () => {
      const img = await generateImg();
      const imgHash = await uploadImg(img, helpDeskWallet.publicKey!);
      const jsonHash = await uploadJSON(imgHash, helpDeskWallet.publicKey!, "HelpDesk Ticket NFT");

      return hashToURI(jsonHash);
    };


    // --------------------------------------- mint newe nft
    const mintNewMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const uri = await prepareMetadata();

      NFTMintMaster(helpDeskWallet as any, uri, 0)
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
