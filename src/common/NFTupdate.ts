import { actions, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import useCluster from '@/composables/cluster';

const { getConnection } = useCluster();

export async function NFTUpdate(
  wallet: Wallet,
  editionMint: PublicKey,
  newMetadataData?: any,
  newUpdateAuthority?: PublicKey,
  primarySaleHappened?: boolean
) {
  const connection = getConnection();
  const txId = await actions.updateMetadata({
    connection,
    wallet,
    editionMint,
    newMetadataData,
    newUpdateAuthority,
    primarySaleHappened,
  });
  console.log('Updated NFT:', txId);
  return txId;
}
