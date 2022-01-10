<template>
  <div>
    <!--all the config stuff-->
    <ConfigPane />
    <p class="title text-white"> Open Questions</p>

    <!--per NFT display-->
    <LoadingBar v-if="isLoading" :progress="progress" :text="text" class="my-5" />
    <NotifyError v-else-if="isError" class="mt-5">{{ text }}</NotifyError>
    <div v-else>
      <OpenQuestionView v-for="n in PNFTs" :key="n.id" :n="n"></OpenQuestionView>
    </div>

    <!--modals-->
    <ModalWindow
      v-if="isModalVisible('tooltipExport')"
      title="Wen export??"
      @hide-modal="hideModal('tooltipExport')"
    >
      <ContentTooltipExport />
    </ModalWindow>

    <!--must sit at the very bottom-->
    <infinite-loading
      @infinite="infiniteHandler"
      :identifier="
        +new Date() //needs to be something thta dynamically updates, or won't work
      "
      spinner="spiral"
    ></infinite-loading>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import InfiniteLoading from 'vue-infinite-loading';
import 'vue-json-pretty/lib/styles.css';
import ConfigPane from '@/components/ConfigPane.vue';
import LoadingBar from '@/components/LoadingBar.vue';
import { NFTGet } from '@/common/NFTget';
import NFTViewCard from '@/components/NFTViewCard.vue';
import OpenQuestionView from '@/components/OpenQuestionView.vue';
import useLoading, { LoadStatus } from '@/composables/loading';
import { EE, ERR_NO_NFTS } from '@/globals';
import { INFT, INFTParams, PNFT } from '@/common/helpers/types';
import NFTViewForm from '@/components/NFTViewForm.vue';
import useDownload from '@/composables/download';
import useCopy from '@/composables/copy';
import NotifyError from '@/components/notifications/NotifyError.vue';
import QuestionMark from '@/components/QuestionMark.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipExport from '@/components/content/tooltip/ContentTooltipExport.vue';
import useModal from '@/composables/modal';
import usePinata from '@/composables/pinata';

export default defineComponent({
  components: {
    ContentTooltipExport,
    ModalWindow,
    QuestionMark,
    NotifyError,
    NFTViewForm,
    NFTViewCard,
    OpenQuestionView,
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

    const { retrieveOpenTickets} = usePinata();

    const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem

    retrieveOpenTickets() 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          allPinataTickets.value = pinataTickets
        } else {
          updateLoadingStdErr(ERR_NO_NFTS);
        }
      })
      .catch(updateLoadingStdErr);

   
      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      

  
    // --------------------------------------- modal
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipExport');

    return {
      PNFTs: allPinataTickets,
      progress,
      text,
      isLoading,
      isError,
      retrieveOpenTickets,
      // export
      // share
      // modal
      isModalVisible,
      showModal,
      hideModal,
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
