import events from 'events';
import * as dotenv from 'dotenv';

export const EE = new events.EventEmitter.EventEmitter();

// --------------------------------------- errors

export const ERR_NO_NFTS = new Error('No NFTs Found:( Are you on the right network?');

// ---------------------------------------  defaults

dotenv.config();

export const DEFAULTS = {
  CLUSTER: process.env.VUE_APP_SOLANA_ENV ? process.env.VUE_APP_SOLANA_ENV : 'testnet',

  // yes this is INTENTIONALLY LEAKED for local dev testing. Production values are stored securely elsewhere.
  PINATA_API_KEY: process.env.VUE_APP_PINATA_API_KEY ? process.env.VUE_APP_PINATA_API_KEY : '7ed5a3f0849f19876a1e',
  PINATA_API_SECRET: process.env.VUE_APP_PINATA_API_SECRET ? process.env.VUE_APP_PINATA_API_SECRET :'3d79c1f0f2293450b9c949cacc293c22223eeb8a33b24124e2d750c86627cbc9',

  OWNER: 'AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK',
  CREATOR: '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  AUTHORITY: '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',

  URI: 'https://gateway.pinata.cloud/ipfs/Qmawjub6LNBQUZ9KnVLMobf3bUiKwjusKpb52p86k5SAZG',
  MAX_SUPPLY: null,

  MASTER_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  UPDATE_AUTHORITY: null,

  NFT_MINT: 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  METADATA: null,
  PRIMARY_SALE: null,

  METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',

  AIRTABLE_API_KEY: '',
  AIRTABLE_APP_BASE_ID: '',
  AIRTABLE_GMNH_USER_TABLE_NAME: '',
  GMNH_EMAIL_HANDLE: '',

  EMAILJS_SERVICE_ID: '',
  EMAILJS_TEMPLATE_ID: '',
  EMAILJS_USER_ID: '',
  APP_URL: "https://gmnh.vercel.app/"
};
