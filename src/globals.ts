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

  OWNER: process.env.VUE_APP_OWNER ? process.env.VUE_APP_OWNER : 'AEahaRpDFzg74t7NtWoruabo2fPJQjKFM9kQJNjH7obK',
  CREATOR: process.env.VUE_APP_CREATOR ? process.env.VUE_APP_CREATOR : '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  AUTHORITY: process.env.VUE_APP_AUTHORITY ? process.env.VUE_APP_AUTHORITY : '9px36ZsECEdSbNAobezC77Wr9BfACenRN1W8X7AUuWAb',
  MINT: process.env.VUE_APP_MINT ? process.env.VUE_APP_MINT : 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',

  URI: process.env.VUE_APP_URI ?  process.env.VUE_APP_URI : 'https://gateway.pinata.cloud/ipfs/Qmawjub6LNBQUZ9KnVLMobf3bUiKwjusKpb52p86k5SAZG',
  MAX_SUPPLY: process.env.VUE_APP_MAX_SUPPLY ? process.env.VUE_APP_MAX_SUPPLY : null,

  MASTER_MINT: process.env.VUE_APP_MASTER_MINT ? process.env.VUE_APP_MASTER_MINT : 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  UPDATE_AUTHORITY: process.env.VUE_APP_UPDATE_AUTHORITY ? process.env.VUE_APP_UPDATE_AUTHORITY : null,

  NFT_MINT: process.env.VUE_APP_NFT_MINT ? process.env.VUE_APP_NFT_MINT : 'A3wpue1mWdnfiU7VVLQeMAuVR4LcVrEsTtxysX1hPKLZ',
  METADATA: process.env.VUE_APP_METADATA ? process.env.VUE_APP_METADATA: null,
  PRIMARY_SALE: process.env.VUE_APP_PRIMARY_SALE ? process.env.VUE_APP_PRIMARY_SALE: null,

  METADATA_PROGRAM_ID: process.env.VUE_APP_METADATA_PROGRAM_ID ? process.env.VUE_APP_METADATA_PROGRAM_ID: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',

  AIRTABLE_API_KEY: process.env.VUE_APP_AIRTABLE_API_KEY ? process.env.VUE_APP_AIRTABLE_API_KEY: '',
  AIRTABLE_APP_BASE_ID: process.env.VUE_APP_AIRTABLE_APP_BASE_ID ? process.env.VUE_APP_AIRTABLE_APP_BASE_ID: '',
  AIRTABLE_GMNH_USER_TABLE_NAME: process.env.VUE_APP_AIRTABLE_GMNH_USER_TABLE_NAME ? process.env.VUE_APP_AIRTABLE_GMNH_USER_TABLE_NAME: 'GMNH User',
  GMNH_EMAIL_HANDLE: process.env.VUE_APP_GMNH_EMAIL_HANDLE ? process.env.VUE_APP_GMNH_EMAIL_HANDLE: 'gm@gmneedhelp.xyz',

  EMAILJS_SERVICE_ID: process.env.VUE_APP_EMAILJS_SERVICE_ID ? process.env.VUE_APP_EMAILJS_SERVICE_ID: '',
  EMAILJS_TEMPLATE_ID: process.env.VUE_APP_EMAILJS_TEMPLATE_ID ? process.env.VUE_APP_EMAILJS_TEMPLATE_ID: '',
  EMAILJS_USER_ID: process.env.VUE_APP_EMAILJS_USER_ID ? process.env.VUE_APP_EMAILJS_USER_ID: '',
  APP_URL: process.env.VUE_APP_APP_URL ? process.env.VUE_APP_APP_URL:"https://gmnh.vercel.app/"

};



