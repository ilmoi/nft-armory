import { actions, Wallet } from '@metaplex/js';
import {Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { stringifyPubkeysAndBNsInObject } from './helpers/util';
import useCluster from '@/composables/cluster';
import useWallet from '@/composables/wallet';


const { getConnection } = useCluster();
const { getWalletAddress } = useWallet();

//TODO: we cant store private key directly in code, this needs to be addressed
const helpDeskWallet = Keypair.fromSecretKey(
new Uint8Array([247,1,238,242,163,40,18,160,99,149,90,132,55,51,84,3,211,255,176,126,122,79,119,229,169,138,219,91,40,47,96,183,131,38,5,227,24,77,6,14,158,169,248,74,231,49,207,74,241,99,23,77,11,32,122,163,63,11,211,169,249,69,52,48]));


export async function NFTMintMaster(wallet: Wallet, uri: string, maxSupply?: number) {

  //mint the NFT
  const connection = getConnection();
  const mintResult  = await actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });

  const strResult = stringifyPubkeysAndBNsInObject(mintResult);

  // Setup listener so that we only attempt to create account info/transfer token..
  //once NFT mint has been CONFIRMED on-chain
  connection.onSignatureWithOptions(
    mintResult.txId,
    async (notification, context) => {
      if (notification.type === 'status') {

        const { result } = notification;
        if (!result.err) {
          console.log('NFT Minted!');

            //only transfer NFT to user if a wallet is connected
          if (getWalletAddress() != null) {
            
            //first, create a token representing the mint token
            const myToken = new Token(
            connection,
            mintResult.mint,
            TOKEN_PROGRAM_ID,
            helpDeskWallet);

          try {
            var transaction = new Transaction();
            const fromTokenAccount = await (myToken.getOrCreateAssociatedAccountInfo(
            helpDeskWallet.publicKey
            )); 

            //instead of creating a token account for the destination, this GH issue 
            //takes a diff approach and appears to work: https://github.com/solana-labs/solana-program-library/issues/2497
            const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
              myToken.associatedProgramId,
              myToken.programId,
              mintResult.mint,
              getWalletAddress()!
            );
        
            const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);
                        
            if (receiverAccount !== null && receiverAccount.owner.toBase58() !== getWalletAddress()!.toBase58()) {
            // derived account of original owner was at one point transferred, so we transfer our account (only works with NFTs, not fungibles). I opened https://github.com/solana-labs/solana-program-library/issues/2514 to figure out fungibles
            transaction.add(
              Token.createSetAuthorityInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                getWalletAddress()!,
                "AccountOwner",
                helpDeskWallet.publicKey,
                []
              )
            );
            } else {
            if (receiverAccount === null) {
              transaction.add(
                Token.createAssociatedTokenAccountInstruction(
                  myToken.associatedProgramId,
                  myToken.programId,
                  mintResult.mint,
                  associatedDestinationTokenAddr,
                  getWalletAddress()!,
                  helpDeskWallet.publicKey
                )
              )
            }
              transaction.add(
                Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                associatedDestinationTokenAddr,
                helpDeskWallet.publicKey,
                [],
                1
              )
            );
          }
  
        // Sign transaction and broadcast once confirmed
          var signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [helpDeskWallet],
          {commitment: 'confirmed'},
          );

          console.log("Successfully transferred newly created NFT to receipient wallet: ", getWalletAddress()?.toBase58());

          } catch (err) {
            console.log('error when transferring NFT back to user', err)
          }
    
        }

        }
      }
    },
    { commitment: 'confirmed' },
  );

  return strResult;
}

export async function NFTMintEditionFromMaster(
  wallet: Wallet,
  masterEditionMint: PublicKey,
  updateAuthority?: PublicKey
) {
  const connection = getConnection();
  const result = await actions.mintEditionFromMaster({
    connection,
    wallet,
    masterEditionMint,
    updateAuthority,
  });
  const strResult = stringifyPubkeysAndBNsInObject(result);
  console.log('Minted a new print NFT:', strResult);
  return strResult;
}
