import { readonly, ref } from 'vue';
import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  Wallet,
  WalletName,
} from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { Cluster } from '@/composables/cluster';

const walletClass = ref<Wallet | null>(null);
const walletAdapter = ref<WalletAdapter | null>(null);

const walletMapping = {
  Phantom: getPhantomWallet,
  Sollet: getSolletWallet,
  'Sollet (Extension)': getSolletExtensionWallet,
  Solflare: getSolflareWallet,
};

export default function useWallet() {
  const setWallet = (newWallet: string | null, network: Cluster) => {
    const gottenWallet = (walletMapping as any)[newWallet!]({ network });
    const connectedAdapter = gottenWallet.adapter();
    connectedAdapter
      .connect()
      .then(() => {
        // only set the two if the call succeeds
        walletClass.value = gottenWallet;
        walletAdapter.value = connectedAdapter;
        console.log('wallet updated, now', newWallet, network);
      })
      .catch(() => {
        console.log('oh no, failed to connect to wallet, try again');
        walletClass.value = null;
        walletAdapter.value = null;
      });
  };

  const getWalletName = (): WalletName | null => {
    if (walletClass.value) {
      return walletClass.value.name;
    }
    return null;
  };

  const getWalletAddress = (): PublicKey | null => {
    if (walletAdapter.value) {
      return walletAdapter.value.publicKey;
    }
    return null;
  };

  return {
    wallet: readonly(walletAdapter),
    setWallet,
    getWalletName,
    getWalletAddress,
  };
}
