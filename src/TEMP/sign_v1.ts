import { actions, Connection, programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';

export async function signMetadata(connection: Connection, wallet: Wallet, editionMint: PublicKey) {
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);
  const signTx = new programs.metadata.SignMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      creator: wallet.publicKey,
    }
  );
  // ---------------- send to metaplex
  const txId = await actions.sendTransaction({
    connection,
    signers: [],
    txs: [signTx],
    wallet,
  });
  console.log(txId);
  return txId;
}

// signMetadata(
//   CONN,
//   new LocalWallet(),
//   editionMintDevnet,
// )
