import { Account, actions, Connection, programs, Wallet } from '@metaplex/js';
import { Transaction } from '@metaplex/js/src/Transaction';

import { Keypair, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout,
  Token,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { CONN } from './helpers/constants';
import { loadKeypairSync, stringifyPubkeysInObject } from './helpers/util';

export class LocalWallet {
  keypair: Keypair;

  publicKey: PublicKey;

  constructor() {
    this.keypair = loadKeypairSync('/Users/ilmoi/.config/solana/id.json');
    this.publicKey = this.keypair.publicKey;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.keypair);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    txs.forEach(this.signTransaction);
    return txs;
  }
}

// --------------------------------------- mint new master

export async function mintNewNFT(
  wallet: Wallet,
  uri: string,
  maxSupply: number
) {
  const result = await actions.mintNFT({
    connection: CONN,
    wallet,
    uri,
    maxSupply,
  });
  console.log('Minted a new NFT!', stringifyPubkeysInObject(result));
  return result;
}

// --------------------------------------- mint new editions via token

export async function mintEditionFromMaser(
  connection: Connection,
  wallet: Wallet,
  masterEditionMint: PublicKey,
  updateAuthority?: PublicKey
) {
  const masterPDA = await programs.metadata.MasterEdition.getPDA(
    masterEditionMint
  );
  const masterMetaPDA = await programs.metadata.Metadata.getPDA(
    masterEditionMint
  );
  const masterInfo = await Account.getInfo(connection, masterPDA);
  const masterData = new programs.metadata.MasterEdition(masterPDA, masterInfo)
    .data;

  // const ME = (await getNFTs({mint: masterEditionMint}))[0];
  // console.log(JSON.stringify(ME, null, 4));

  const editionValue = masterData.supply.add(new BN(1));

  // ------------------ spl token mint & acc

  const mint = Keypair.generate();
  const mintRent = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );
  const createMintTx = new programs.CreateMint(
    { feePayer: wallet.publicKey },
    {
      newAccountPubkey: mint.publicKey,
      lamports: mintRent,
    }
  );

  const recipient = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint.publicKey,
    wallet.publicKey
  );

  const createAssociatedTokenAccountTx =
    new programs.CreateAssociatedTokenAccount(
      { feePayer: wallet.publicKey },
      {
        associatedTokenAddress: recipient,
        splTokenMintAddress: mint.publicKey,
      }
    );

  const mintToTx = new programs.MintTo(
    { feePayer: wallet.publicKey },
    {
      mint: mint.publicKey,
      dest: recipient,
      amount: 1,
    }
  );

  // ------------------ getting the address for the master token
  const tokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    masterEditionMint,
    wallet.publicKey
  );

  // ------------------ pdas + final ix
  const metadataPDA = await programs.metadata.Metadata.getPDA(mint.publicKey);
  // NOTE: requirest master's mint, not edition's mint
  const editionMarker = await programs.metadata.EditionMarker.getPDA(
    masterEditionMint,
    editionValue
  );
  const editionPDA = await programs.metadata.Edition.getPDA(mint.publicKey);

  const newEditionFromMasterTx =
    new programs.metadata.MintNewEditionFromMasterEditionViaToken(
      { feePayer: wallet.publicKey },
      {
        ///   1. `[writable]` New Edition (pda of ['metadata', program id, mint id, 'edition'])
        // MUST BE EMPTY
        edition: editionPDA,
        ///   0. `[writable]` New Metadata key (pda of ['metadata', program id, mint id])
        // MUST BE EMPTY
        metadata: metadataPDA,
        ///   9. `[]` Update authority info for new metadata
        // todo experiment with this - can we set this to anyone? who's the right choice?
        // yes can be set to arb value
        updateAuthority: updateAuthority || wallet.publicKey,
        ///   3. `[writable]` Mint of new token
        mint: mint.publicKey,
        ///   5. `[signer]` Mint authority of new mint
        // MUST BE THE CURRENT MINT AUTHORITY FOR THE MINT (SINCE WE'RE CREATING ABOVE = CURRENT WALLET)
        // AFTER THIS IX, THE AUTHORITY WILL BE MOVED AWAY FROM THIS ACC AND MOVED TO EDITION_PDA
        mintAuthority: wallet.publicKey,
        ///   2. `[writable]` Master Record Edition V2 (pda of ['metadata', program id, master metadata mint id, 'edition'])
        masterEdition: masterPDA,
        ///   10. `[]` Master record metadata account
        masterMetadata: masterMetaPDA,
        ///   4. `[writable]` Edition pda to mark creation - will be checked for pre-existence. (pda of ['metadata', program id, master metadata mint id, 'edition', edition_number])
        ///   where edition_number is NOT the edition number you pass in args but actually edition_number = floor(edition/EDITION_MARKER_BIT_SIZE).
        // CAN BE EMPTY IF WE NEVER CREATED EDITIONS BEFORE
        editionMarker,
        ///   7. `[signer]` owner of token account containing master token (#8)
        tokenOwner: wallet.publicKey,
        ///   8. `[]` token account containing token from master metadata mint
        tokenAccount,
        editionValue,
      }
    );

  // ---------------- send to metaplex
  const txId = await actions.sendTransaction({
    connection,
    signers: [mint],
    txs: [
      createMintTx,
      createAssociatedTokenAccountTx,
      mintToTx,
      newEditionFromMasterTx,
    ],
    wallet,
  });

  const x = {
    txId,
    mint: mint.publicKey,
    metadata: metadataPDA,
    edition: editionPDA,
  };

  console.log(stringifyPubkeysInObject(x));

  return x;
}

// --------------------------------------- play

// mintNewNFT(
//   new LocalWallet(),
//   "https://ipfs.io/ipfs/QmTA8bzAdsSPMUVM9gUoi3WcRphEXznPkqUH3uvjA9fHw9",
//   100
// );

export const masterMintDevnet = new PublicKey(
  'BLpau83HHv69KcgkfNqpv39J3uCS3aYapzSSz36UCAjV'
);
export const editionMintDevnet = new PublicKey(
  'FPxRKq2NGCHWW88HzBiu4HAG7cyrz1jBpLZJ9RQfCsFX'
);

// mintEditionFromMaser(
//   CONN,
//   new LocalWallet(),
//   masterMintDevnet,
// )
