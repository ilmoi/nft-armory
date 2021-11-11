import { actions, Wallet } from '@metaplex/js';
import { stringifyPubkeysAndBNsInObject } from './helpers/util';
import useCluster from '@/composables/cluster';

const { getConnection } = useCluster();

// todo fix max supply after PR accepted
export async function mintNewNFT(wallet: Wallet, uri: string, maxSupply: number) {
  const connection = getConnection();
  const result = await actions.mintNFT({
    connection,
    wallet,
    uri,
    maxSupply,
  });
  const strResult = stringifyPubkeysAndBNsInObject(result);
  console.log('Minted a new NFT:', strResult);
  return strResult;
}

// export async function mintEditionNFTFromMaster(wallet: Wallet, masterEditionMint: PublicKey) {
//   const connection = getConnection();
//   const result = await mintEditionFromMaster({ connection, wallet, masterEditionMint });
//   console.log('Minted a new Edition NFT from Master:', stringifyPubkeysAndBNsInObject(result));
//   return result;
// }
