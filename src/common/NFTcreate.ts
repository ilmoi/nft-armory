import { actions, programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import useCluster from '@/composables/cluster';

const { getConnection } = useCluster();

export async function NFTCreateMetadata(
  wallet: Wallet,
  editionMint: PublicKey,
  metadataData: any,
  updateAuthority?: PublicKey
) {
  const connection = getConnection();
  const txId = await actions.createMetadata({
    connection,
    wallet,
    editionMint,
    metadataData,
    updateAuthority,
  });
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);
  console.log('Created Metadata:', txId, metadata.toBase58());
  return { txId, metadata };
}

export async function NFTCreateMaster(
  wallet: Wallet,
  editionMint: PublicKey,
  updateAuthority?: PublicKey,
  maxSupply?: number
) {
  const connection = getConnection();
  const txId = await actions.createMasterEdition({
    connection,
    wallet,
    editionMint,
    updateAuthority,
    maxSupply: maxSupply ? new BN(maxSupply) : undefined,
  });
  const edition = await programs.metadata.MasterEdition.getPDA(editionMint);
  console.log('Created Master Edition:', txId, edition.toBase58());
  return { txId, edition };
}
