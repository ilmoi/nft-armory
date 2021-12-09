import { PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { Account, programs } from '@metaplex/js';
import {
  Edition,
  EditionData,
  MasterEdition,
  Metadata,
  MetadataData,
  MetadataKey,
} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getEnumKeyByEnumValue, okToFailAsync } from './helpers/util';
import { deserializeTokenAccount, deserializeTokenMint } from './helpers/spl-token';
import { INFT, INFTParams } from './helpers/types';
import useCluster from '@/composables/cluster';
import { DEFAULTS, EE, ERR_NO_NFTS } from '@/globals';
import { estimateNFTLoadTime, IUpdateLoadingParams, LoadStatus } from '@/composables/loading';
import { processRarity } from '@/common/rarity';

const { getConnection } = useCluster();

// --------------------------------------- get tokens

interface IToken {
  mint: PublicKey;
  address: PublicKey;
  metadataPDA?: PublicKey;
  metadataOnchain?: MetadataData;
}

const baseFilters = [
  // Filter for MetadataV1 by key
  {
    memcmp: {
      offset: 0,
      bytes: bs58.encode(Buffer.from([MetadataKey.MetadataV1])),
    },
  },
].filter(Boolean);

async function getHolderByMint(mint: PublicKey): Promise<PublicKey> {
  const tokens = await getConnection().getTokenLargestAccounts(mint);
  return tokens.value[0].address; // since it's an NFT, we just grab the 1st account
}

function deserializeMetadata(rawMetadata: any) {
  const acc = new Account(rawMetadata.pubkey, rawMetadata.account);
  return Metadata.from(acc);
}

async function metadatasToTokens(rawMetadatas: any[]): Promise<IToken[]> {
  const promises = await Promise.all(
    rawMetadatas.map(async (m) => {
      try {
        const metadata = deserializeMetadata(m);
        const mint = new PublicKey(metadata.data.mint);
        const address = await getHolderByMint(mint);
        return {
          mint,
          address,
          metadataPDA: metadata.pubkey,
          metadataOnchain: metadata.data,
        } as IToken;
      } catch (e) {
        console.log('failed to deserialize one of the fetched metadatas');
      }
    })
  );
  return promises.filter((t) => !!t) as IToken[];
}

async function getTokensByCreator(creator: PublicKey): Promise<IToken[]> {
  const rawMetadatas = await getConnection().getProgramAccounts(
    new PublicKey(DEFAULTS.METADATA_PROGRAM_ID),
    {
      filters: [
        ...baseFilters,
        {
          memcmp: {
            offset: programs.metadata.computeCreatorOffset(0),
            bytes: creator.toBase58(),
          },
        },
      ],
    }
  );
  return metadatasToTokens(rawMetadatas);
}

async function getTokensByUpdateAuthority(updateAuthority: PublicKey): Promise<IToken[]> {
  const rawMetadatas = await getConnection().getProgramAccounts(
    new PublicKey(DEFAULTS.METADATA_PROGRAM_ID),
    {
      filters: [
        ...baseFilters,
        {
          memcmp: {
            offset: 1,
            bytes: updateAuthority.toBase58(),
          },
        },
      ],
    }
  );
  return metadatasToTokens(rawMetadatas);
}

async function getTokensByMint(mint: PublicKey): Promise<IToken[]> {
  return [
    {
      mint,
      address: await getHolderByMint(mint),
    },
  ];
}

async function getTokensByOwner(owner: PublicKey): Promise<IToken[]> {
  const tokens = await getConnection().getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
  return tokens.value
    .filter((t) => {
      const amount = t.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map((t) => ({
      address: new PublicKey(t.pubkey),
      mint: new PublicKey(t.account.data.parsed.info.mint),
    }));
}

// --------------------------------------- enrich with useful stuff

async function getMetadataByMint(
  mint: PublicKey,
  metadataPDA?: PublicKey,
  metadataOnchain?: MetadataData
) {
  const pda = metadataPDA ?? (await Metadata.getPDA(mint));
  const onchain = metadataOnchain ?? (await Metadata.load(getConnection(), pda)).data;
  const metadataExternal = (await axios.get(onchain.data.uri)).data;
  return {
    metadataPDA: pda,
    metadataOnchain: onchain,
    metadataExternal,
  };
}

async function getEditionInfoByMint(mint: PublicKey) {
  // untriaged
  const pda = await Edition.getPDA(mint);
  const info = await Account.getInfo(getConnection(), pda);
  const key = info?.data[0];

  const editionType = getEnumKeyByEnumValue(MetadataKey, key);
  let editionPDA;
  let editionData;
  let masterEditionPDA;
  let masterEditionData;

  // triaged
  switch (key) {
    case MetadataKey.EditionV1:
      editionPDA = pda;
      editionData = new Edition(pda, info).data;
      // we can further get master edition info, since we know the parent
      ({ masterEditionPDA, masterEditionData } = await okToFailAsync(getParentEdition, [
        editionData,
      ]));
      break;
    case MetadataKey.MasterEditionV1:
    case MetadataKey.MasterEditionV2:
      masterEditionData = new MasterEdition(pda, info).data;
      masterEditionPDA = pda;
      break;
  }

  return {
    editionType,
    editionPDA,
    editionData,
    masterEditionPDA,
    masterEditionData,
  };
}

async function getParentEdition(editionData: EditionData) {
  const masterEditionPDA = new PublicKey(editionData.parent);
  const masterInfo = await Account.getInfo(getConnection(), masterEditionPDA);
  const masterEditionData = new MasterEdition(masterEditionPDA, masterInfo).data;
  return { masterEditionPDA, masterEditionData };
}

async function tokensToEnrichedNFTs(tokens: IToken[]): Promise<INFT[]> {
  return Promise.all(
    tokens.map(async (t) =>
      // console.log(`Processing Mint ${t.mint}`)
      ({
        mint: t.mint,
        address: t.address,
        splTokenInfo: await okToFailAsync(deserializeTokenAccount, [t.mint, t.address]),
        splMintInfo: await okToFailAsync(deserializeTokenMint, [t.mint]),
        ...(await okToFailAsync(
          getMetadataByMint,
          [t.mint, t.metadataPDA, t.metadataOnchain],
          true
        )),
        ...(await okToFailAsync(getEditionInfoByMint, [t.mint], true)),
      })
    )
  );
}

// --------------------------------------- helpers

function filterOutIncompleteNFTs(NFTs: INFT[]): INFT[] {
  return NFTs.filter(
    (n) =>
      n.mint && // guaranteed
      n.metadataOnchain && // guaranteed
      n.metadataExternal // requirement, otherwise no picture
  );
}

// --------------------------------------- interface

export async function NFTGet(
  { owner, creator, mint, updateAuthority } = {} as INFTParams
): Promise<INFT[]> {
  const t1 = performance.now();

  let tokens: IToken[] = [];
  if (owner) {
    console.log('Time to get em NFTs by owner:', owner.toBase58());
    tokens = await getTokensByOwner(owner);
  } else if (creator) {
    console.log('Time to get em NFTs by creator:', creator.toBase58());
    tokens = await getTokensByCreator(creator);
  } else if (mint) {
    console.log('Time to get em NFTs by mint:', mint.toBase58());
    tokens = await getTokensByMint(mint);
  } else if (updateAuthority) {
    console.log('Time to get em NFTs by authority:', updateAuthority.toBase58());
    tokens = await getTokensByUpdateAuthority(updateAuthority);
  } else {
    throw new Error('You must pass one of owner / creator / authority / mint');
  }

  if (tokens.length === 0) {
    throw ERR_NO_NFTS;
  }

  EE.emit('loading', {
    newStatus: LoadStatus.Loading,
    newProgress: 50,
    maxProgress: 90,
    newText: `Found ${
      tokens.length
    } potential NFTs. Fetching metadata... ETA: <${estimateNFTLoadTime(tokens.length)} min`,
  } as IUpdateLoadingParams);

  const t2 = performance.now();
  console.log(`Found ${tokens.length} tokens`);
  console.log('Time:', (t2 - t1) / 1000);

  const nfts = await tokensToEnrichedNFTs(tokens);
  const t3 = performance.now();
  console.log(`Prepared a total ${nfts.length} NFTs`);
  console.log('Time:', (t3 - t2) / 1000);
  console.log('TOTAL time:', (t3 - t1) / 1000);

  const validNFTs = filterOutIncompleteNFTs(nfts);
  let finalNFts = validNFTs;

  // process rarity - for creators / updateAuth only
  if (creator || updateAuthority) {
    try {
      finalNFts = processRarity(validNFTs);
    } catch (e) {
      console.log('Failed to calc rarity with error', e);
    }
  }

  return finalNFts;
}
