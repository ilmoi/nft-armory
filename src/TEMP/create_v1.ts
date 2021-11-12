import { actions, Connection, programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { stringifyPubkeysInObject } from './helpers/util';

// NOTE: requires the edition mint to have 0 decimals. At this stage ATA / single token not required.
export async function createMetadata(
  connection: Connection,
  wallet: Wallet,
  editionMint: PublicKey,
  metadataData: programs.metadata.MetadataDataData,
  updateAuthority?: PublicKey
) {
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);

  const createMetadataTx = new programs.metadata.CreateMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      metadataData,
      updateAuthority: updateAuthority || wallet.publicKey,
      mint: editionMint,
      mintAuthority: wallet.publicKey,
    }
  );
  // ---------------- send to metaplex
  const txId = await actions.sendTransaction({
    connection,
    signers: [],
    txs: [createMetadataTx],
    wallet,
  });
  const x = {
    txId,
    metadata,
  };

  console.log(stringifyPubkeysInObject(x));
  return txId;
}

// NOTE 1: a metadata account must already exist or this will fail
// NOTE 2: must have exactly 1 token outstanding
export async function createMasterEdition(
  connection: Connection,
  wallet: Wallet,
  editionMint: PublicKey, // any mint with 0 decimals
  updateAuthority?: PublicKey,
  maxSupply?: BN
) {
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);
  const edition = await programs.metadata.MasterEdition.getPDA(editionMint);

  const createMetadataTx = new programs.metadata.CreateMasterEdition(
    { feePayer: wallet.publicKey },
    {
      edition,
      metadata,
      updateAuthority: updateAuthority || wallet.publicKey,
      mint: editionMint,
      mintAuthority: wallet.publicKey,
      maxSupply,
    }
  );
  // ---------------- send to metaplex
  const txId = await actions.sendTransaction({
    connection,
    signers: [],
    txs: [createMetadataTx],
    wallet,
  });
  const x = {
    txId,
    edition,
  };

  console.log(stringifyPubkeysInObject(x));
  return txId;
}

// // --------------------------------------- play
//
// async function play() {
//   const tokenMint = new PublicKey(
//     '3zLq4GrccYVAb9JqBQ8cVv3i17fvJo4YATa4i6b47mR3'
//   );
//   const data = await prepNewMetadataData(
//     'https://ipfs.io/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
//     new LocalWallet()
//   );
//
//   await createMetadata(CONN, new LocalWallet(), tokenMint, data);
//
//   // if you don't give it a couple seconds to propage, the 2nd one will fail
//   await createMasterEdition(CONN, new LocalWallet(), tokenMint);
// }
//
// // play()
