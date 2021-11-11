import { readonly, ref } from 'vue';
import { Connection } from '@solana/web3.js';

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

const cluster = ref(Cluster.Devnet);

export default function useCluster() {
  const getClusterURL = (): string => clusterURLMapping[cluster.value];

  const getConnection = (): Connection => new Connection(getClusterURL(), 'processed');

  const setCluster = (newCluster: Cluster) => {
    cluster.value = newCluster;
    // todo sec vuln - should not be printing cluster to console (same in wallet)
    console.log(`Cluster updated, now ${newCluster} (${getClusterURL()})`);
  };

  return {
    cluster: readonly(cluster),
    getClusterURL,
    getConnection,
    setCluster,
  };
}
