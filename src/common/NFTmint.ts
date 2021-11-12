import { actions, Wallet } from '@metaplex/js';
import { PublicKey } from '@solana/web3.js';
import { stringifyPubkeysAndBNsInObject } from './helpers/util';
import useCluster from '@/composables/cluster';

const { getConnection } = useCluster();

export async function NFTMintMaster(wallet: Wallet, uri: string, maxSupply?: number) {
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
