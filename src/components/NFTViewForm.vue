<template>
  <div class="p-10">
    <div class="nes-container with-title">
      <p class="title">View NFTs by:</p>
      <div class="text-gray-400 mt-2">
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

    <form @submit.prevent="fetchNFTs" class="mt-10">
      <div v-if="byAddress" class="nes-field">
        <label for="addr">Wallet Address:</label>
        <input type="text" id="addr" class="nes-input" v-model="owner" :placeholder="owner" />
      </div>
      <div v-else-if="byWallet && !missingWallet" class="nes-field">
        <label for="walletAddr">Your Wallet Address:</label>
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
        <label for="missingWallet">Your Wallet Address:</label>
        <input
          type="text"
          id="missingWallet"
          class="nes-input text-red-500"
          v-model="missingWalletNotice"
          :disabled="true"
        />
      </div>
      <div v-else-if="byCreator" class="nes-field">
        <label for="creator">Creator Address:</label>
        <input
          type="text"
          id="creator"
          class="nes-input"
          v-model="creator"
          :placeholder="creator"
        />
      </div>
      <div v-else-if="byAuthority" class="nes-field">
        <label for="authority">Authority Address:</label>
        <input
          type="text"
          id="authority"
          class="nes-input"
          v-model="authority"
          :placeholder="authority"
        />
      </div>
      <div v-else-if="byMint" class="nes-field">
        <label for="mint">Mint Address:</label>
        <input type="text" id="mint" class="nes-input" v-model="mint" :placeholder="mint" />
      </div>

      <button
        class="nes-btn is-primary mt-5"
        :class="{ 'is-disabled': isLoading }"
        :disabled="isLoading"
      >
        Load NFTs
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { PublicKey } from '@solana/web3.js';
import { INFT } from '@/TEMP/helpers/types';
import 'vue-json-pretty/lib/styles.css';

import { getNFTs } from '@/common/NFTget';
import useLoading, { LoadStatus } from '@/composables/loading';
import { EE } from '@/globals';
import { INFTParams } from '@/common/helpers/types';
import useWallet from '@/composables/wallet';

export default defineComponent({
  props: {
    owner: String,
    creator: String,
    authority: String,
    mint: String,
  },
  setup(props, context) {
    const chosenMethod = ref<string>('address');
    const byAddress = computed(() => chosenMethod.value === 'address');
    const byWallet = computed(() => chosenMethod.value === 'wallet');
    const byCreator = computed(() => chosenMethod.value === 'creator');
    const byAuthority = computed(() => chosenMethod.value === 'authority');
    const byMint = computed(() => chosenMethod.value === 'mint');

    const { wallet, getWalletAddress } = useWallet();
    watch(byWallet, () => {
      if (getWalletAddress()) owner.value = getWalletAddress()!.toBase58();
    });
    watch(wallet, () => {
      if (getWalletAddress()) owner.value = getWalletAddress()!.toBase58();
    });
    const missingWallet = computed(() => getWalletAddress() === null);
    const missingWalletNotice = 'Please connect your wallet above.';

    // fetch NFTs
    const { progress, text, isLoading, isError, updateLoading } = useLoading();
    const NFTs = ref<INFT[]>([]);
    const fetchNFTs = () => {
      updateLoading({
        newStatus: LoadStatus.Loading,
        newProgress: 0,
        maxProgress: 50,
        newText: 'Looking for NFTs...',
      });

      EE.removeAllListeners();
      EE.on('loading', updateLoading);

      NFTs.value = []; // clear while loading

      // todo need bad pk error
      const params = {
        owner: byAddress.value || byWallet.value ? new PublicKey(owner.value) : undefined,
        creators: byCreator.value ? [new PublicKey(creator.value)] : undefined,
        updateAuthority: byAuthority.value ? new PublicKey(authority.value) : undefined,
        mint: byMint.value ? new PublicKey(mint.value) : undefined,
      } as INFTParams;

      getNFTs(params)
        .then((fetchedNFTs) => {
          NFTs.value = fetchedNFTs;
          updateLoading({
            newStatus: LoadStatus.Success,
            newProgress: 0,
            maxProgress: 0,
            newText: 'Successfully loaded!',
          });
        })
        .catch((e) => {
          updateLoading({
            newStatus: LoadStatus.Error,
            newProgress: 0,
            maxProgress: 0,
            newText: `Uh oh something went wrong: ${e}`,
          });
        });
    };

    return {
      // select method
      chosenMethod,
      byAddress,
      byWallet,
      byCreator,
      byAuthority,
      byMint,
      // params
      owner,
      creator,
      authority,
      mint,
      missingWallet,
      missingWalletNotice,
      // fetch
      NFTs,
      progress,
      text,
      isLoading,
      isError,
      fetchNFTs,
    };
  },
});
</script>

<style scoped>
input[type='radio']:checked + span {
  @apply text-black;
}

label {
  @apply mr-1;
}
</style>
