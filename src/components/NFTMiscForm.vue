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
      (!) NOTE: Only use this if you know what you're doing. If all you want is to mint a new NFT,
      go to mint tab, all PDAs will be created for you.
    </NotifyWarning>
    <NotifyWarning class="mt-5" v-if="chosenAction === 'createMaster'">
      (!) NOTE: You will need to have created a Metadata PDA first.
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
          :placeholder="editionMint"
        />
      </div>
      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading || !isConnected }"
        :disabled="isLoading || !isConnected"
        type="submit"
      >
        Sign an NFT
      </button>
    </form>

    <!--create meta-->
    <form v-else-if="chosenAction === 'createMetadata'" @submit.prevent="createMetadata">
      <div class="nes-field">
        <div><label for="editionMint2">NFT Mint:</label></div>
        <input
          type="text"
          id="editionMint2"
          class="nes-input"
          v-model="editionMint"
          :placeholder="editionMint"
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
          :placeholder="newMetadataData"
        ></textarea>
      </div>
      <div class="nes-field mt-5">
        <div><label for="newUpdateAuthority">Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="newUpdateAuthority"
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
    <form v-else-if="chosenAction === 'createMaster'" @submit.prevent="createMaster">
      <div class="nes-field">
        <div><label for="editionMint3">NFT Mint:</label></div>
        <input
          type="text"
          id="editionMint3"
          class="nes-input"
          v-model="editionMint"
          :placeholder="editionMint"
        />
      </div>
      <div class="nes-field mt-5">
        <div><label for="newUpdateAuthority2">Update Authority (optional):</label></div>
        <input
          type="text"
          id="newUpdateAuthority2"
          class="nes-input"
          v-model="newUpdateAuthority"
          :placeholder="newUpdateAuthority"
        />
      </div>
      <div class="nes-field mt-5">
        <div><label for="maxSupply">Max Supply (leave blank for uncapped):</label></div>
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
        Create Metadata PDA
      </button>
    </form>

    <!--notifications-->
    <StdNotifications :is-connected="isConnected" :is-loading="isLoading" :error="error" />
    <NotifySuccess v-if="txId" class="mt-5">
      <p>Done! 🎉</p>
      <LoadingIcon align="left" class="mt-5" v-if="!result"
        >Waiting for transaction to confirm... (might take a min or two)</LoadingIcon
      >
      <div v-else>
        <div>{{ result }}</div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import NotifyWarning from './content/notifications/NotifyWarning.vue';
import StdNotifications from '@/components/StdNotifications.vue';
import NotifySuccess from '@/components/content/notifications/NotifySuccess.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import ExplorerLink from '@/components/ExplorerLink.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipMetadata from '@/components/content/tooltip/ContentTooltipMetadata.vue';
import useWallet from '@/composables/wallet';
import useError from '@/composables/error';
import useModal from '@/composables/modal';
import QuestionMark from '@/components/QuestionMark.vue';

export default defineComponent({
  components: {
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

    const chosenAction = ref<string>('signMetadata');
    const isLoading = ref<boolean>(false);
    const txId = ref<string | null>(null);
    const result = ref<string | null>(null);

    const clearPreviousResults = () => {
      isLoading.value = false;
      txId.value = null;
      const result = null;
      clearError();
    };

    // --------------------------------------- sign metadata
    const editionMint = ref<string | null>('49GGYd6PyascDX5rb12s8oP5XNhjfF2bvaMteFxLeEud');

    const signMetadata = () => {};

    // --------------------------------------- create metadata
    const newMetadataData = ref<any>(null);
    const newUpdateAuthority = ref<string | null>(null);

    const createMetadata = () => {};

    // --------------------------------------- create master
    const maxSupply = ref<number | null>(123);

    const createMaster = () => {};

    // --------------------------------------- modals
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipMetadata');

    return {
      isConnected,
      error,
      chosenAction,
      isLoading,
      txId,
      result,
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
