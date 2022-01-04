<template>
  <div>
    <!--all the config stuff-->
    <ConfigPane />
    <p class="title"> Open Questions</p>

    <!--per NFT display-->
    <LoadingBar v-if="isLoading" :progress="progress" :text="text" class="my-5" />
    <NotifyError v-else-if="isError" class="mt-5">{{ text }}</NotifyError>
    <div v-else>
      <OpenQuestionView v-for="n in PNFTs" :key="n.metadata.keyvalues.mintID" :n="n"></OpenQuestionView>
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

    const t1L = performance.now();
    // TODO: adjust from INFT work
    const allPinataTickets = ref<PNFT[]>([]); // this is everything fetched in mem

    retrieveOpenTickets() 
      .then((pinataTickets) => {
        if (pinataTickets.length) {
          console.log("yasss")
          allPinataTickets.value = pinataTickets
              console.log("here are pinata tickets")
          console.log(allPinataTickets.value)
          console.log("see", allPinataTickets.value.length, "tickets ")

        } else {
          updateLoadingStdErr(ERR_NO_NFTS);
        }
      })
      .catch(updateLoadingStdErr);

    const t2L = performance.now();
    console.log('Time viewView:', (t2L - t1L) / 1000);


    // TODO: generalize logic more + page to allow multiple calls/groups
    // based on different values ('open', 'closed', etc.)
     function filterForOpenTickets (tickets: Array<INFT>) {
       // Takes in an array of NFTs & filters to just "open" ones
      return tickets.filter(n => n.metadataExternal.hasOwnProperty("attributes") ?  n.metadataExternal.attributes.some((tt: { trait_type: string, value: string; }) => tt.trait_type == 'status' && tt.value == 'open'): undefined)      
     }
  
    
    const displayedNFTs = ref<INFT[]>([]); // this is what's shown on FE
    const allFetchedNFTs = ref<INFT[]>([]); // this is everything fetched in mem
    const fetchParams = ref<INFTParams | null>(null);
    const NFTCount = computed(() => displayedNFTs.value.length + allFetchedNFTs.value.length);



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
        newText: 'Looking for NFTs... ETA: <1 min',
      });

      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      // clear for new fetch
      displayedNFTs.value = [];
      allFetchedNFTs.value = [];

      NFTGet(params, filterForOpenTickets) 
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
      fetchParams.value = params;
      fetchNFTs(params);
    };

    // --------------------------------------- display
    const infiniteHandler = ($state: any) => {
      const nextBatch = getNextBatch(10);
      if (nextBatch.length) {
        displayedNFTs.value.push(...nextBatch);
        $state.loaded();
      } else {
        $state.complete();
      }
    };

    // --------------------------------------- export
    const { exportJSONZip } = useDownload();
    const exportBtnText = ref(`Export ${NFTCount.value} NFTs`);
    const disableExport = ref(false);
    watch(NFTCount, (newCount) => {
      exportBtnText.value = `Export ${newCount} NFTs`;
    });

    const parseParams = (): [string, string] => {
      let returnKey: string;
      let returnPk: string;
      for (const [k, v] of Object.entries(fetchParams.value!)) {
        if (v && v instanceof Array) {
          returnKey = k;
          returnPk = v[0].toBase58(); // get the first creator
        } else if (v) {
          returnKey = k;
          returnPk = v.toBase58();
        }
      }
      return [returnKey!, returnPk!];
    };

    const doneExportingCallback = () => {
      disableExport.value = false;
      exportBtnText.value = `Export ${NFTCount.value} NFTs`;
    };

    const exportNFTs = () => {
      disableExport.value = true;
      exportBtnText.value = 'preparing...';
      const allNFTs = displayedNFTs.value.concat(allFetchedNFTs.value);
      const now = +new Date();
      const [k, v] = parseParams();
      exportJSONZip(allNFTs, 'mint', `${k}-${v}-${now}`, doneExportingCallback);
    };

    // --------------------------------------- sharing
    const { copyText, setCopyText, doCopy } = useCopy();
    setCopyText('Share Link');

    const copyShareLink = async () => {
      const host = window.location.origin;
      if (fetchParams.value!.owner) {
        await doCopy(`${host}/view/address/${fetchParams.value!.owner.toBase58()}`);
      } else if (fetchParams.value!.creator) {
        await doCopy(`${host}/view/creator/${fetchParams.value!.creator.toBase58()}`);
      } else if (fetchParams.value!.updateAuthority) {
        await doCopy(`${host}/view/authority/${fetchParams.value!.updateAuthority.toBase58()}`);
      } else if (fetchParams.value!.mint) {
        await doCopy(`${host}/view/mint/${fetchParams.value!.mint.toBase58()}`);
      }
    };

    // --------------------------------------- modal
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipExport');

    return {
      NFTs: displayedNFTs,
      PNFTs: allPinataTickets,
      progress,
      text,
      isLoading,
      isError,
      exportNFTs,
      handleSubmitForm,
      infiniteHandler,
      retrieveOpenTickets,
      // export
      exportBtnText,
      disableExport,
      // share
      copyText,
      copyShareLink,
      doCopy,
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
