<template>
  <div>
    <p>The JSON you're looking at is custom-built and composed of a number of things:</p>
    <div class="lists">
      <ul class="mt-5 ml-4 nes-list is-disc">
        <li>Address (SPL token account currently holding the NFT)</li>
        <li>Mint address (on Solana each NFT has its own mint - unlike on Ethereum)</li>
        <li>Full SPL Token info</li>
        <li>Full SPL Mint info</li>
        <li>Metadata PDA address</li>
        <li>Metadata Onchain (stuff inside the metadata PDA)</li>
        <li>Metadata External (stuff stored on Arweave / IPFS)</li>
        <li>Edition Type (eg Master vs Print)</li>
        <li>Edition PDA address (if exists)</li>
        <li>Edition Data (stuff inside the edition PDA)</li>
        <li>Master PDA address</li>
        <li>Master Edition PDA (stuff inside the master PDA)</li>
      </ul>
    </div>
    <p class="mt-5">
      So quite a lot of stuff. The goal was to bring together all the information that a
      developer/artist might need to efficiently experiment/debug. If something is missing - LMK
      (twitter handle in footer).
    </p>
  </div>
</template>
