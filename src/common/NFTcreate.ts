import { programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import useCluster from '@/composables/cluster';
import { createMasterEdition, createMetadata } from '@/TEMP/create_v1';

const { getConnection } = useCluster();

// todo import from actual lib when PR accepted
export async function NFTCreateMetadata(
  wallet: Wallet,
  editionMint: PublicKey,
  metadataData: any,
  updateAuthority?: PublicKey
) {
  const connection = getConnection();
  const txId = await createMetadata(connection, wallet, editionMint, metadataData, updateAuthority);
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);
  console.log('Created Metadata:', txId, metadata.toBase58());
  return { txId, metadata };
}

// todo import from actual lib when PR accepted
export async function NFTCreateMaster(
  wallet: Wallet,
  editionMint: PublicKey,
  updateAuthority?: PublicKey,
  maxSupply?: number
) {
  const connection = getConnection();
  const txId = await createMasterEdition(
    connection,
    wallet,
    editionMint,
    updateAuthority,
    maxSupply ? new BN(maxSupply) : undefined
  );
  const edition = await programs.metadata.MasterEdition.getPDA(editionMint);
  console.log('Created Master Edition:', txId, edition.toBase58());
  return { txId, edition };
}
