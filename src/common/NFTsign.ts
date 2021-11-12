import { programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import useCluster from '@/composables/cluster';
import { signMetadata } from '@/TEMP/sign_v1';

const { getConnection } = useCluster();

// todo import from actual lib when PR accepted
export async function NFTSignMetadata(wallet: Wallet, editionMint: PublicKey) {
  const connection = getConnection();
  const txId = await signMetadata(connection, wallet, editionMint);
  console.log('Signed NFT:', txId);
  return txId;
}
