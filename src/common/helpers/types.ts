import { PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo } from '@solana/spl-token';
import { EditionData, MasterEditionData, MetadataData } from '@metaplex/js/lib/programs/metadata';
import { RarityCategory } from '@/common/rarity';

export interface INFT {
  // spl stuff
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
  // rarity
  rarityScore?: number;
  rarityRank?: number;
  rarityCategory?: RarityCategory;
}

export interface INFTParams {
  owner?: PublicKey;
  creators?: PublicKey[];
  mint?: PublicKey;
  updateAuthority?: PublicKey;
}

export interface IMintResult {
  txId: string;
  mint: PublicKey;
  metadata: PublicKey;
  edition: PublicKey;
}
