import { readonly, ref } from 'vue';
import { Connection } from '@solana/web3.js';

export enum Cluster {
  Mainnet = 'https://rough-thrumming-haze.solana-mainnet.quiknode.pro/d94e66e565fc77b8b07563f5c5cef8113fcc15ec/',
  Devnet = 'https://api.devnet.solana.com',
  Testnet = 'https://api.testnet.solana.com',
  Localnet = 'http://localhost:8899',
}

const cluster = ref(Cluster.Devnet);

export default function useCluster() {
  const setCluster = (newCluster: Cluster) => {
    cluster.value = newCluster;
    console.log('Cluster updated, now', newCluster);
  };

  const getConnection = () => new Connection(cluster.value, 'processed');

  return {
    cluster: readonly(cluster),
    setCluster,
    getConnection,
  };
}
