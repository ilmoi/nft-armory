import { readonly, ref } from 'vue';
import {
  getPhantomWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
  Wallet,
} from '@solana/wallet-adapter-wallets';
import { Cluster } from '@/composables/cluster';

const wallet = ref<Wallet | null>(null);

const walletMapping = {
  Phantom: getPhantomWallet,
  Sollet: getSolletWallet,
  'Sollet (Extension)': getSolletExtensionWallet,
  Solflare: getSolflareWallet,
};

export default function useWallet() {
  const setWallet = (newWallet: string | null, network: Cluster) => {
    wallet.value = (walletMapping as any)[newWallet!]({ network });
    console.log('Wallet updated, now', newWallet, network);
  };
  return {
    wallet: readonly(wallet),
    setWallet,
  };
}
