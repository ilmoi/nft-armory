import { actions, Connection, programs, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { UpdateMetadata } from './temp_borsh';

// --------------------------------------- update as edition owner

// update authority can update 3 things:
// 1) metadata if it's mutable (NOTE: limited editions are NEVER mutable - see mint_limited_edition, ie only master is mutable)
// 2) set another update authority
// 3) flip primary sale happened to true, but never back to false after that

export async function updateMetadata(
  connection: Connection,
  wallet: Wallet, // assume that wallet is the authority
  editionMint: PublicKey, // this can be master or limited
  newMetadataData?: any,
  newUpdateAuthority?: PublicKey,
  primarySaleHappened?: boolean
) {
  const metadata = await programs.metadata.Metadata.getPDA(editionMint);
  const updateTx = new UpdateMetadata(
    { feePayer: wallet.publicKey },
    {
      metadata,
      updateAuthority: wallet.publicKey,
      metadataData: newMetadataData,
      newUpdateAuthority,
      primarySaleHappened,
    }
  );
  // ---------------- send to metaplex
  const txId = await actions.sendTransaction({
    connection,
    signers: [],
    txs: [updateTx],
    wallet,
  });
  console.log(txId);
  return txId;
}

// // --------------------------------------- update as master owner
//
// // works on both master and normal editions
// // todo not sure if worth showing in FE, might bring more confusion than worth
// export async function updatePrimarySaleHappenedViaToken(
//   connection: Connection,
//   wallet: Wallet,
//   editionMint: PublicKey
// ) {
//   const metadata = await programs.metadata.Metadata.getPDA(editionMint);
//   const tokenAccount = await Token.getAssociatedTokenAddress(
//     ASSOCIATED_TOKEN_PROGRAM_ID,
//     TOKEN_PROGRAM_ID,
//     editionMint,
//     wallet.publicKey
//   );
//
//   const updateTx = new programs.metadata.UpdatePrimarySaleHappenedViaToken(
//     { feePayer: wallet.publicKey },
//     {
//       metadata,
//       owner: wallet.publicKey,
//       tokenAccount,
//     }
//   );
//   // ---------------- send to metaplex
//   const txId = await actions.sendTransaction({
//     connection,
//     signers: [],
//     txs: [updateTx],
//     wallet,
//   });
//   console.log(txId);
//   return txId;
// }
//
// // --------------------------------------- play
//
// export async function prepNewMetadataData(
//   uri: string,
//   wallet: Wallet
// ): Promise<programs.metadata.MetadataDataData> {
//   const { data } = await axios.get(uri);
//   const {
//     name,
//     symbol,
//     seller_fee_basis_points,
//     properties: { creators },
//   } = data as MetadataJson;
//
//   const creatorsData = creators.reduce<programs.metadata.Creator[]>(
//     (memo, { address, share }) => {
//       const verified = address === wallet.publicKey.toString();
//       const creator = new programs.metadata.Creator({
//         address,
//         share,
//         verified,
//       });
//       memo = [...memo, creator];
//       return memo;
//     },
//     []
//   );
//
//   return new programs.metadata.MetadataDataData({
//     name,
//     symbol,
//     uri,
//     sellerFeeBasisPoints: seller_fee_basis_points,
//     creators: creatorsData,
//   });
// }
//
// async function play() {
//   const newData = await prepNewMetadataData(
//     'https://ipfs.io/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4',
//     new LocalWallet()
//   );
//   // console.log(`new url will be ${newData.uri}`);
//   // console.log(newData)
//   await updateMetadata(
//     CONN,
//     new LocalWallet(),
//     masterMintDevnet,
//     newData,
//     undefined,
//     undefined
//   );
// }
//
// // play()
//
// // updateMetadata(
// //   CONN,
// //   new LocalWallet(),
// //   editionMintDevnet,
// //   undefined,
// //   undefined,
// //   true,
// // )
// //
// // updatePrimarySaleHappenedViaToken(
// //   CONN,
// //   new LocalWallet(),
// //   masterMintDevnet,
// // )
