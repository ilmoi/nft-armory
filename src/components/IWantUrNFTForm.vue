<template>
  <div>
      <div class="flex mt-10 text-white" style="background: #343A3F; ">
      <form v-if="isQuestion && !isLoading" @submit.prevent="createTicket" class="flex-grow">

        <input focus-visible type="text" id="nftName" placeholder="What's your question?" class="nes-input gmnh-question" v-model="nftName" />

        <button
          class="gmnh-question-submit"
          :class="{ 'is-disabled': isLoading || !isConnected }"
          :disabled="isLoading || !isConnected"
          type="submit"
        >
          Submit Question
        </button>
      </form>
      <form v-if="!isQuestion && !isLoading" @submit.prevent="createAnswer" class="flex-grow">
        <div><textarea focus-visible type="text" id="nftName" placeholder="Write answer here:" class="nes-input gmnh-answer" v-model="nftName" /></div>
        <button
          class="gmnh-answer-submit"
          :class="{ 'is-disabled': isLoading || !isConnected }"
          :disabled="isLoading || !isConnected"
          type="submit"
        >
          Answer Question
        </button>
      </form>

       <!--notifications-->
    
    <div class="flex-grow">
      <StdNotifications v-if="!mintResult" :is-question="isQuestion" :is-connected="isConnected" :is-loading="isLoading" :is-created="isCreated" />
      <StdNotifications v-else :is-question="isQuestion" :is-connected="isConnected" :is-loading="isLoading" :is-created="isCreated" :mint-id="mintResult.mint"  />
    </div>
   <!-- <NotifySuccess v-if="mintResult" class="mt-5">
      <p>Mint successful! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!newNFT"
        >Loading your new NFT... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <ExplorerLink :tx-id="mintResult.txId" />
        <NFTViewCard :n="newNFT" class="text-black" />
      </div>
    </NotifySuccess> -->

      <div v-if="isQuestion" class="display display-canvas" id="canvas" :style="{ fontSize: `${textSize}px`} ">
        <p>{{ nftName }}</p>
      </div>
      <div v-else class=" display-answer display-canvas" id="canvas" :style="{ fontSize: `${textSize}px`} ">
        <p>{{ nftName }}</p>
      </div>


   
  </div>
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
import {retrieveEmailAddressUsingWalletId} from '@/composables/airtable';
import {getQuestionUserWalletId} from '@/composables/pnftInteractions'


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
  props: {
    isQuestion: {type: Boolean},
    questionID: { type: String },
    uri: { type: String },
    hash: {type: String},
  },



  setup(props) {
    const { isConnected, getWallet, getWalletAddress } = useWallet();
    const { clearError, setError } = useError();

    const isLoading = ref<boolean>(false);
    const isCreated = ref<boolean>(false);
    const mintResult = ref<IMintResult | null>(null);
    const newNFT = ref<INFT | null>(null);

    const { uploadImg, uploadJSON, hashToURI, URIToHash, uploadJSONForAnswer, updatePinataMetadata, retrieveByMintId } = usePinata();


    //This is the HelpDesk treasury wallet (9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb) where all NFTs will be minted to
    //todo figure out way to not dox private key
    const helpDeskWallet = new NodeWallet(
      Keypair.fromSecretKey(
        new Uint8Array([
          247, 1, 238, 242, 163, 40, 18, 160, 99, 149, 90, 132, 55, 51, 84, 3, 211, 255, 176, 126,
          122, 79, 119, 229, 169, 138, 219, 91, 40, 47, 96, 183, 131, 38, 5, 227, 24, 77, 6, 14,
          158, 169, 248, 74, 231, 49, 207, 74, 241, 99, 23, 77, 11, 32, 122, 163, 63, 11, 211, 169,
          249, 69, 52, 48,
        ])
      )
    );

    const clearPreviousResults = () => {
      isLoading.value = false;
      isCreated.value = false;
      mintResult.value = null;
      newNFT.value = null;
      clearError();
    };

    const fetchNewNFT = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        [newNFT.value] = await NFTGet({ mint: new PublicKey(mintResult.value!.mint) });
        isCreated.value = true;
      } catch (e) {
        await fetchNewNFT();
      }

      //update IPFS metadata with mintId
      const newMetadata = {
        keyvalues: {
          mintId: newNFT.value!.mint.toBase58(),
        }
      };

      updatePinataMetadata(URIToHash(newNFT.value!.metadataOnchain.data.uri), newMetadata);
    };

    const fetchNewAnswer = async () => {
      // this will keep failing, while the network updates, for a while so keep retrying
      try {
        [newNFT.value] = await NFTGet({ mint: new PublicKey(mintResult.value!.mint) });
        isCreated.value = true;
      } catch (e) {
        await fetchNewNFT();
      }

      //update IPFS metadata with mintId for answer
      const newMetadata = {
        keyvalues: {
          mintId: newNFT.value!.mint.toBase58(),
        }
      };

      updatePinataMetadata(URIToHash(newNFT.value!.metadataOnchain.data.uri), newMetadata);
    
      //update question NFT with answerMintID and update status to "answered"
      const newMetadataForQuestion = {
        keyvalues: {
          answerMintId: newNFT.value!.mint.toBase58(),
          answerText: newNFT.value?.metadataExternal.description,
          status: 'answered',
        }
      };

      updatePinataMetadata(props.hash!, newMetadataForQuestion);
    };

    // --------------------------------------- prep metadata
    const nftName = ref('');
    const contactDets = ref('BLANK');
    const textSize = ref(16);

    const generateImg = async () => {
      const canvas = await html2canvas(document.getElementById('canvas')!);
      const img = canvas.toDataURL('image/png');
      const res = await fetch(img);
      return res.blob();
    };

    const prepareMetadata = async () => {
      const img = await generateImg();
      const imgHash = await uploadImg(img, helpDeskWallet.publicKey!);
      const jsonHash = await uploadJSON(imgHash, helpDeskWallet.publicKey!, nftName.value!, getWalletAddress()!);

      return hashToURI(jsonHash);
    };


    const prepareMetadataForAnswer = async () => {
      const img = await generateImg();
      const imgHash = await uploadImg(img, helpDeskWallet.publicKey!);
      const jsonHash = await uploadJSONForAnswer(imgHash, helpDeskWallet.publicKey!, nftName.value!, props.questionID!, getWalletAddress()!);

      return hashToURI(jsonHash);
    };

    // --------------------------------------- mint newe nft
    const createTicket = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const uri = await prepareMetadata();

      NFTMintMaster(helpDeskWallet as any, uri, 0)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
         // isLoading.value = false;
          //FYI, fetchNewNFT updates metadata in IPFS with mintID of NFT
          await fetchNewNFT();
        })
        .catch((e) => {
          setError(e);
       //   isLoading.value = false;
        });
    };




    const createAnswer = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const answerUri = await prepareMetadataForAnswer();

      NFTMintMaster(helpDeskWallet as any, answerUri, 0)
        .then(async (result) => {
          mintResult.value = result as IMintResult;
         // isLoading.value = false;
          //FYI, fetchNewNFT updates 
          //1. metadata in IPFS for answer with mintID of NFT
          //2. metadata in IPFS for question with mintID of answer + update status
          await fetchNewAnswer();
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });

        // todo: work-in-progress; fill in
        // const userWalletAnswered  = getWalletAddress() // would be of the user answering a question
        // retrieveEmailAddressUsingWalletId(userWalletAnswered? userWalletAnswered.toString() : '' )
         
        // // how to find user wallet who answered question
        if (typeof props.questionID != 'undefined'){
            console.log('questionID is: ', props.questionID)
            let questionUserIDWallet = ''

            retrieveByMintId(props.questionID) 
                .then((pinataTickets) => {
                  
                if (pinataTickets.length && pinataTickets.length == 1) {
                  questionUserIDWallet = getQuestionUserWalletId(pinataTickets[0]);
                  console.log('userWalletKey of question is ', questionUserIDWallet)
                  retrieveEmailAddressUsingWalletId((questionUserIDWallet.toString()))
              } else {
                console.log("no tickets found with mint id queried")
                  //TODO: add error message
              //  updateLoadingStdErr(ERR_NO_NFTS);
              }
            }) 
      
        }

    }

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipWant');

    return {
      isConnected,
      isCreated,
      isLoading,
      mintResult,
      newNFT,
      // prep
      nftName,
      contactDets,
      textSize,
      // mint
      createTicket,
      createAnswer,
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
  background-color: #219653;
  width: 250px;
  height: 250px;
  margin: 16px;
}

.display-answer {
  @apply text-center flex flex-col justify-center align-middle ml-10 mt-2;
  background-color: #219653;
  width: 250px;
  height: 250px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 0px;
}

.gmnh-question {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;

position: static;
width: 816px;
height: 57px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
margin: 16px 16px;
}

.gmnh-answer {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 16px;

position: static;
width: 416px;
height: 131px;
left: 0px;
top: 0px;

/* Gray-90 */

background: #21272A;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 0;
align-self: stretch;
flex-grow: 0;
}

.gmnh-question-submit {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 14px 20px;

position: static;
width: 169px;
height: 47px;
left: 0px;
top: 73px;

background: #082CAB;
/* Gray-90 */
box-sizing: border-box;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
margin: 16px 16px;
}

.gmnh-answer-submit {
  display: flex;
flex-direction: row;
align-items: flex-start;
padding: 14px 20px;

position: static;
width: 169px;
height: 47px;
left: 0px;
top: 73px;

background: #082CAB;
/* Gray-90 */
box-sizing: border-box;
border-radius: 4px;

/* Inside auto layout */

flex: none;
order: 1;
flex-grow: 0;
margin-top: 16px;
}
</style>
