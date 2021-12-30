import { actions, Wallet } from '@metaplex/js';
import {Token, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { stringifyPubkeysAndBNsInObject } from './helpers/util';
import useCluster from '@/composables/cluster';
import useWallet from '@/composables/wallet';
import { help } from 'commander';


const { getConnection } = useCluster();
const { getWalletAddress } = useWallet();

//TODO: we cant store private key directly in code, this needs to be addressed
const helpDeskWallet = Keypair.fromSecretKey(
new Uint8Array([247,1,238,242,163,40,18,160,99,149,90,132,55,51,84,3,211,255,176,126,122,79,119,229,169,138,219,91,40,47,96,183,131,38,5,227,24,77,6,14,158,169,248,74,231,49,207,74,241,99,23,77,11,32,122,163,63,11,211,169,249,69,52,48]));


export async function NFTMintMaster(wallet: Wallet, uri: string, maxSupply?: number) {
  const connection = getConnection();
  const result = await actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });

  const strResult = stringifyPubkeysAndBNsInObject(result);
  
  //only transfer NFT to user if a wallet is connected
  //todo: move this into a separate function
  if (getWalletAddress() != null) {
  
    //now we need to transfer newly minted NFT to connected wallet from shared wallet

    //first, create a token representing the mint token
    const myToken = new Token(
      connection,
      result.mint,
      TOKEN_PROGRAM_ID,
      helpDeskWallet
    );

    // Create associated token accounts for my token if they don't exist yet
    var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      helpDeskWallet.publicKey
    );

    var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      getWalletAddress()!
    );

    // Add token transfer instructions to transaction 
    var transaction = new Transaction()
    .add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        helpDeskWallet.publicKey,
        [],
        1
        )
      );

    // Sign transaction, broadcast, and confirm
      var signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [helpDeskWallet]
    );

    console.log("Successfully transferred newly created NFT to receipient wallet: ", getWalletAddress()?.toBase58());

  }

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
