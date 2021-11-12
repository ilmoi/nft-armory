import { Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import useCluster from '@/composables/cluster';
import { updateMetadata } from '@/TEMP/update_v1';

const { getConnection } = useCluster();

// todo import from actual lib when PR accepted
export async function NFTUpdate(
  wallet: Wallet,
  editionMint: PublicKey,
  newMetadataData?: any,
  newUpdateAuthority?: PublicKey,
  primarySaleHappened?: boolean
) {
  const connection = getConnection();
  const txId = await updateMetadata(
    connection,
    wallet,
    editionMint,
    newMetadataData,
    newUpdateAuthority,
    primarySaleHappened
  );
  console.log('Updated NFT:', txId);
  return txId;
}
