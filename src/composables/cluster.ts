import { readonly, ref } from 'vue';

export enum Cluster {
  Mainnet = 'https://api.mainnet-beta.solana.com',
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
  return {
    cluster: readonly(cluster),
    setCluster,
  };
}
