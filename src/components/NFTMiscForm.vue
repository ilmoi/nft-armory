<template>
  <div>
    <div class="nes-container with-title">
      <p class="title">Choose Action:</p>
      <div class="text-gray-400 mt-2 flex justify-around">
        <label>
          <input type="radio" class="nes-radio" value="signMetadata" v-model="chosenAction" />
          <span>Sign Metadata</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="createMetadata" v-model="chosenAction" />
          <span>Create Metadata PDA</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="createMaster" v-model="chosenAction" />
          <span>Create Master PDA</span>
        </label>
      </div>
    </div>

    <NotifyWarning
      class="mt-5"
      v-if="chosenAction === 'createMetadata' || chosenAction === 'createMaster'"
    >
      (!) Only use this if you know what you're doing. If all you want is to mint a new NFT, go to
      mint tab, all PDAs will be created for you.
    </NotifyWarning>
    <NotifyWarning class="mt-5" v-if="chosenAction === 'createMaster'">
      (!) You will need to have created a Metadata PDA first.
    </NotifyWarning>

    <!--sign-->
    <form v-if="chosenAction === 'signMetadata'" class="mt-10" @submit.prevent="signMetadata">
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
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Sign Metadata
      </button>
    </form>

    <!--create meta-->
    <form
      v-else-if="chosenAction === 'createMetadata'"
      class="mt-5"
      @submit.prevent="createMetadata"
    >
      <div class="nes-field">
        <div>
          <label for="editionMint2">New SPL Token Mint:</label>
          <QuestionMark @click="showModal('nftToken')" />
        </div>
        <input
          type="text"
          id="editionMint2"
          class="nes-input"
          v-model="editionMint"
          :placeholder="DEFAULTS.MASTER_MINT"
        />
      </div>
      <div class="nes-field mt-5">
        <div>
          <label for="newMetadataData">Metadata as JSON:</label>
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
        <div><label for="newUpdateAuthority">Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="DEFAULTS.UPDATE_AUTHORITY"
        />
      </div>
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Create Metadata PDA
      </button>
    </form>

    <!--create master-->
    <form v-else-if="chosenAction === 'createMaster'" class="mt-5" @submit.prevent="createMaster">
      <div class="nes-field">
        <div>
          <label for="editionMint3">New SPL Token Mint:</label>
          <QuestionMark @click="showModal('nftToken')" />
        </div>
        <input
          type="text"
          id="editionMint3"
          class="nes-input"
          v-model="editionMint"
          :placeholder="DEFAULTS.MASTER_MINT"
        />
      </div>
      <div class="nes-field mt-5">
        <div><label for="newUpdateAuthority2">Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority2"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="DEFAULTS.UPDATE_AUTHORITY"
        />
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
        Create Master PDA
      </button>
    </form>

    <!--notifications-->
    <StdNotifications :is-connected="isConnected" :is-loading="isLoading" :error="error" />
    <NotifySuccess v-if="txId" class="mt-5">
      <p>Done! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!confirmed"
        >Waiting for transaction to confirm... (might take a few sec)</LoadingIcon
      >
      <div v-else>
        <div v-if="pda">Newly created PDA: {{ pda }}</div>
        <ExplorerLink :tx-id="txId" />
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
    <ModalWindow
      v-if="isModalVisible('nftToken')"
      title="What token is this?"
      @hide-modal="hideModal('nftToken')"
    >
      <ContentTooltipNftToken />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NotifyWarning from './notifications/NotifyWarning.vue';
import StdNotifications from '@/components/StdNotifications.vue';
import NotifySuccess from '@/components/notifications/NotifySuccess.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import ExplorerLink from '@/components/ExplorerLink.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipMetadata from '@/components/content/tooltip/ContentTooltipMetadata.vue';
import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import useModal from '@/composables/modal';
import QuestionMark from '@/components/QuestionMark.vue';
import { NFTSignMetadata } from '@/common/NFTsign';
import useCluster from '@/composables/cluster';
import { pause } from '@/common/helpers/util';
import ContentTooltipNftToken from '@/components/content/tooltip/ContentTooltipNftToken.vue';
import { NFTCreateMaster, NFTCreateMetadata } from '@/common/NFTcreate';
import { DEFAULTS } from '@/globals';

export default defineComponent({
  components: {
    ContentTooltipNftToken,
    QuestionMark,
    ContentTooltipMetadata,
    ModalWindow,
    ExplorerLink,
    LoadingIcon,
    NotifySuccess,
    StdNotifications,
    NotifyWarning,
  },
  setup() {
    const { isConnected, getWallet } = useWallet();
    const { error, clearError, setError, tryConvertToPk, tryParseJSON, tryParseMetadataData } =
      useError();
    const { getConnection } = useCluster();

    const chosenAction = ref<string>('signMetadata');
    const isLoading = ref<boolean>(false);
    const txId = ref<string | null>(null);
    const pda = ref<string | null>(null);
    const confirmed = ref<boolean>(false);

    const clearPreviousResults = () => {
      isLoading.value = false;
      txId.value = null;
      pda.value = null;
      confirmed.value = false;
      clearError();
    };

    const checkConfirmed = async (sig: string) => {
      const conn = getConnection('confirmed');
      const tx = await conn.getConfirmedTransaction(sig);
      if (!tx) {
        await pause(1000);
        await checkConfirmed(sig);
        return;
      }
      confirmed.value = true;
    };

    // --------------------------------------- sign metadata
    const editionMint = ref<string | null>(null);

    const signMetadata = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const editionPk = tryConvertToPk(editionMint.value);
      if (error.value) {
        return;
      }

      NFTSignMetadata(getWallet() as any, editionPk!)
        .then(async (result: string) => {
          txId.value = result;
          isLoading.value = false;
          await checkConfirmed(txId.value!);
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- create metadata
    const newMetadataData = ref<any>(null);
    const newUpdateAuthority = ref<string | null>(null);

    const createMetadata = async () => {
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

      NFTCreateMetadata(
        getWallet() as any,
        editionPk!,
        parsedMetadata as any, // null-undefined conflict
        updatePk as any // null-undefined conflict
      )
        .then(async (result: any) => {
          txId.value = result.txId;
          pda.value = result.metadata;
          isLoading.value = false;
          await checkConfirmed(txId.value!);
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- create master
    const maxSupply = ref<number | null>(null);

    const createMaster = async () => {
      clearPreviousResults();
      isLoading.value = true;

      const editionPk = tryConvertToPk(editionMint.value);
      const updatePk = tryConvertToPk(newUpdateAuthority.value);
      if (error.value) {
        return;
      }

      NFTCreateMaster(
        getWallet() as any,
        editionPk!,
        updatePk as any, // null-undefined conflict
        maxSupply.value as any // null-undefined conflict
      )
        .then(async (result: any) => {
          txId.value = result.txId;
          pda.value = result.edition;
          isLoading.value = false;
          await checkConfirmed(txId.value!);
        })
        .catch((e) => {
          setError(e);
          isLoading.value = false;
        });
    };

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipMetadata');
    registerModal('nftToken');

    return {
      DEFAULTS,
      isConnected,
      error,
      chosenAction,
      isLoading,
      txId,
      pda,
      confirmed,
      // sign
      editionMint,
      signMetadata,
      // create metadata
      newMetadataData,
      newUpdateAuthority,
      createMetadata,
      // create master
      maxSupply,
      createMaster,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped></style>
