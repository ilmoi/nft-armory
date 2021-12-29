import events from 'events';

export const EE = new events.EventEmitter.EventEmitter();

// --------------------------------------- errors

export const ERR_NO_NFTS = new Error('No NFTs Found:( Are you on the right network?');

// ---------------------------------------  defaults

export const DEFAULTS = {
  CLUSTER: 'devnet',

  OWNER: 'AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK',
  CREATOR: '2WJwPd4EG7wZmx2BjAASoMh1pfRYLLb1CHj4oMooPKb5',
  AUTHORITY: '2WJwPd4EG7wZmx2BjAASoMh1pfRYLLb1CHj4oMooPKb5',
  MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',

  URI: 'https://gateway.pinata.cloud/ipfs/Qmawjub6LNBQUZ9KnVLMobf3bUiKwjusKpb52p86k5SAZG',
  MAX_SUPPLY: null,

  MASTER_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  UPDATE_AUTHORITY: null,

  NFT_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  METADATA: null,
  PRIMARY_SALE: null,

  METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
};
