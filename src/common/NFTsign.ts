import { actions, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import useCluster from '@/composables/cluster';

const { getConnection } = useCluster();

export async function NFTSignMetadata(wallet: Wallet, editionMint: PublicKey) {
  const connection = getConnection();
  const txId = await actions.signMetadata({ connection, wallet, editionMint });
  console.log('Signed NFT:', txId);
  return txId;
}
