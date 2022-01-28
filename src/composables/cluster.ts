import { readonly, ref } from 'vue';
import { Commitment, Connection } from '@solana/web3.js';
import { DEFAULTS } from '@/globals';

export enum Cluster {
  Mainnet = 'mainnet',
  Devnet = 'devnet',
  Testnet = 'testnet',
  Localnet = 'localnet',
}

const clusterURLMapping = {
  mainnet: process.env.VUE_APP_MAINNET_URL || 'https://api.mainnet-beta.solana.com',
  devnet: process.env.VUE_APP_DEVNET_URL || 'https://api.devnet.solana.com',
  testnet: process.env.VUE_APP_TESTNET_URL || 'https://api.testnet.solana.com',
  localnet: process.env.VUE_APP_LOCALNET_URL || 'http://localhost:8899',
};

const cluster = ref<Cluster>(DEFAULTS.CLUSTER as any);

export default function useCluster() {
  const getClusterURL = (): string => clusterURLMapping[cluster.value];

  const getConnection = (committment?: Commitment): Connection =>
    new Connection(getClusterURL(), committment ?? 'processed');

  const setCluster = (newCluster: Cluster) => {
    cluster.value = newCluster;
    // capping at 10 chars due to security (not to expose the token)
    console.log(`Cluster updated, now ${newCluster} (${getClusterURL().substr(0, 10)})`);
  };

  return {
    cluster: readonly(cluster),
    getClusterURL,
    getConnection,
    setCluster,
  };
}
