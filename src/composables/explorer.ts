import useCluster from '@/composables/cluster';

const { cluster } = useCluster();

const clusterPostfixMapping = {
  mainnet: '',
  devnet: '?cluster=devnet',
  testnet: '?cluster=testnet',
  localnet: '?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899',
};

export default function useExplorer() {
  const getClusterPostfix = () => clusterPostfixMapping[cluster.value];

  const buildTxURI = (txId: string) =>
    `https://explorer.solana.com/tx/${txId}${getClusterPostfix()}`;

  return {
    getClusterPostfix,
    buildTxURI,
  };
}
