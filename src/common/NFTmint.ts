import { actions, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { stringifyPubkeysAndBNsInObject } from './helpers/util';
import useCluster from '@/composables/cluster';
import { mintEditionFromMaster } from '@/TEMP/mint_v1';

const { getConnection } = useCluster();

// todo fix max supply after PR accepted
// todo make sure that a call with 0 produces capped and null actually produces uncapped
export async function mintNewNFT(wallet: Wallet, uri: string, maxSupply: number) {
  const connection = getConnection();
  const result = await actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });
  const strResult = stringifyPubkeysAndBNsInObject(result);
  console.log('Minted a new master NFT:', strResult);
  return strResult;
}

// todo import from actual lib when PR accepted
export async function mintEditionNFTFromMaster(
  wallet: Wallet,
  masterEditionMint: PublicKey,
  updateAuthority?: PublicKey
) {
  const connection = getConnection();
  const result = await mintEditionFromMaster(
    connection,
    wallet,
    masterEditionMint,
    updateAuthority
  );
  const strResult = stringifyPubkeysAndBNsInObject(result);
  console.log('Minted a new print NFT:', strResult);
  return strResult;
}
