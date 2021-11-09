import { Connection, PublicKey } from '@solana/web3.js';

const url = 'https://api.devnet.solana.com';
console.log('CONNECTED TO:', url);
export const CONN = new Connection(url);
export const METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);
