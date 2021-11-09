import { PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo } from '@solana/spl-token';
import {
  EditionData,
  MasterEditionData,
  MetadataData,
} from '@metaplex/js/lib/programs/metadata';

export interface INFT {
  // spl
  mint: PublicKey;
  address: PublicKey;
  splTokenInfo?: AccountInfo;
  splMintInfo?: MintInfo;
  // metadata stuff
  metadataPDA?: PublicKey;
  metadataOnchain: MetadataData;
  metadataExternal?: any; // maybe one day I'll define this:)
  // edition stuff
  editionType?: string;
  editionPDA?: PublicKey;
  editionData?: EditionData;
  masterEditionPDA?: PublicKey;
  masterEditionData?: MasterEditionData;
}

export interface INFTParams {
  owner?: PublicKey;
  creators?: PublicKey[];
  mint?: PublicKey;
  updateAuthority?: PublicKey;
}
