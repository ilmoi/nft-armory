<template>
  <div>
    <div class="nes-container with-title">
      <p class="title">View NFTs by:</p>
      <div class="text-gray-400 mt-2 flex justify-between">
        <label>
          <input type="radio" class="nes-radio" value="address" v-model="chosenMethod" />
          <span>Address</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="wallet" v-model="chosenMethod" />
          <span>Wallet</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="creator" v-model="chosenMethod" />
          <span>Creator</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="authority" v-model="chosenMethod" />
          <span>Authority</span>
        </label>
        <label>
          <input type="radio" class="nes-radio" value="mint" v-model="chosenMethod" />
          <span>Mint</span>
        </label>
      </div>
    </div>

    <form @submit.prevent="emitSubmitForm" class="mt-10">
      <div v-if="byAddress" class="nes-field">
        <div><label for="addr">Wallet Address:</label></div>
        <input type="text" id="addr" class="nes-input" v-model="owner" :placeholder="owner" />
      </div>
      <div v-else-if="byWallet && !missingWallet" class="nes-field">
        <div><label for="walletAddr">Your Wallet Address:</label></div>
        <input
          type="text"
          id="walletAddr"
          class="nes-input text-gray-400"
          v-model="owner"
          :placeholder="owner"
          :disabled="true"
        />
      </div>
      <div v-else-if="byWallet && missingWallet" class="nes-field">
        <div><label for="missingWallet">Your Wallet Address:</label></div>
        <input
          type="text"
          id="missingWallet"
          class="nes-input text-red-500"
          v-model="missingWalletNotice"
          :disabled="true"
        />
      </div>
      <div v-else-if="byCreator" class="nes-field">
        <div class="flex">
          <label for="creator"> Creator Address: </label>
          <QuestionMark @click="showModal('tooltipCreator')" />
        </div>
        <input
          type="text"
          id="creator"
          class="nes-input"
          v-model="creator"
          :placeholder="creator"
        />
      </div>
      <div v-else-if="byAuthority" class="nes-field">
        <div><label for="authority">Update Authority Address:</label></div>
        <input
          type="text"
          id="authority"
          class="nes-input"
          v-model="authority"
          :placeholder="authority"
        />
      </div>
      <div v-else-if="byMint" class="nes-field">
        <div><label for="mint">Mint Address:</label></div>
        <input type="text" id="mint" class="nes-input" v-model="mint" :placeholder="mint" />
      </div>

      <div class="flex justify-between mt-5">
        <button
          class="nes-btn is-primary"
          :class="{ 'is-disabled': isLoading }"
          :disabled="isLoading"
          type="submit"
        >
          Load NFTs
        </button>
        <slot />
      </div>
    </form>

    <ModalWindow
      v-if="isModalVisible('tooltipCreator')"
      title="What's a creator?"
      @hide-modal="hideModal('tooltipCreator')"
    >
      <ContentTooltipCreator />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { PublicKey } from '@solana/web3.js';
import 'vue-json-pretty/lib/styles.css';
import { INFTParams } from '@/common/helpers/types';
import useWallet from '@/composables/wallet';
import QuestionMark from '@/components/QuestionMark.vue';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipCreator from '@/components/content/tooltip/ContentTooltipCreator.vue';
import useModal from '@/composables/modal';
import ContentTooltipJSON from '@/components/content/tooltip/ContentTooltipJSON.vue';

export default defineComponent({
  components: { ContentTooltipJSON, ContentTooltipCreator, ModalWindow, QuestionMark },
  props: {
    isLoading: Boolean,
  },
  emits: ['submit-form'],
  setup(props, ctx) {
    const owner = ref('AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX');
    const creator = ref('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA');
    const authority = ref('75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA');
    const mint = ref('3dsmKsQD5fpmGeecg4AAhUMfVrhDGkXefrGHEk4aWpc6');

    // --------------------------------------- choosing a method
    const chosenMethod = ref<string>('address');
    const byAddress = computed(() => chosenMethod.value === 'address');
    const byWallet = computed(() => chosenMethod.value === 'wallet');
    const byCreator = computed(() => chosenMethod.value === 'creator');
    const byAuthority = computed(() => chosenMethod.value === 'authority');
    const byMint = computed(() => chosenMethod.value === 'mint');

    // --------------------------------------- wallet
    const { wallet, getWalletAddress } = useWallet();
    watch(byWallet, () => {
      if (getWalletAddress()) owner.value = getWalletAddress()!.toBase58();
    });
    watch(wallet, () => {
      if (getWalletAddress()) owner.value = getWalletAddress()!.toBase58();
    });
    const missingWallet = computed(() => getWalletAddress() === null);
    const missingWalletNotice = 'Please connect your wallet above.';

    const prepareParams = (): INFTParams | null => {
      try {
        return {
          owner: byAddress.value || byWallet.value ? new PublicKey(owner.value) : undefined,
          creators: byCreator.value ? [new PublicKey(creator.value)] : undefined,
          updateAuthority: byAuthority.value ? new PublicKey(authority.value) : undefined,
          mint: byMint.value ? new PublicKey(mint.value) : undefined,
        } as INFTParams;
      } catch (e) {
        console.log('Bad PK:', e);
        // todo notify the user
        return null;
      }
    };

    const emitSubmitForm = () => {
      const params = prepareParams();
      if (params) ctx.emit('submit-form', params);
    };

    // --------------------------------------- modal
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipCreator');

    return {
      // params
      owner,
      creator,
      authority,
      mint,
      // method
      chosenMethod,
      byAddress,
      byWallet,
      byCreator,
      byAuthority,
      byMint,
      // wallet
      missingWallet,
      missingWalletNotice,
      // event
      emitSubmitForm,
      // modal
      isModalVisible,
      showModal,
      hideModal,
    };
  },
});
</script>

<style scoped>
input[type='radio']:checked + span {
  @apply text-black;
}
</style>
