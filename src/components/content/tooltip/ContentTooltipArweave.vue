<template>
  <div>
    <p>
      To mint an NFT you need to first prepare certain metadata and store it on Arweave / IPFS (you
      could in theory use centalized storage like S3 but why would you?)
    </p>
    <p class="mt-5">
      Which should you choose? In short - Arweave. It's actually permanent unlike IPFS. Read more
      <a
        href="https://www.reddit.com/r/Arweave/comments/gu5elw/arweave_permaweb_vs_ipfs_someone_please_explain/fsnbj1t/?context=3"
        target="_blank"
        class="nes-text is-primary"
        >here</a
      >. I do still mention IPFS because in might be simpler / cheaper for experimentation. Don't
      use it for prod though.
    </p>
    <p class="mt-5">
      Here are some tutorials:
      <a
        href="https://medium.com/cypher-game/how-to-create-a-solana-nft-with-python-68f6f775f742"
        target="_blank"
        class="nes-text is-primary"
        >Arweave</a
      >,
      <a
        href="https://medium.com/scrappy-squirrels/tutorial-nft-metadata-ipfs-and-pinata-9ab1948669a3"
        target="_blank"
        class="nes-text is-primary"
        >IPFS (via Pinata)</a
      >. The IPFS tut is for Ethereum, but it works exactly the same on Solana. The
      <a
        href="https://docs.metaplex.com/nft-standard#json-structure"
        target="_blank"
        class="nes-text is-primary"
        >NFT standard (what goes into the JSON file)</a
      >
      is the same.
    </p>
    <NotifyWarning class="mt-5"
      >(!) You must pass the minter wallet as one of the creators, or the transaction will
      fail.</NotifyWarning
    >
  </div>
</template>
<script>
import NotifyWarning from '@/components/notifications/NotifyWarning';

export default {
  components: { NotifyWarning },
};
</script>
