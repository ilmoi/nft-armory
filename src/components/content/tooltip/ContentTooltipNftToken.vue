<template>
  <div>
    <p>
      This is the SPL Token Mint that will effectively become an NFT once the metadata/edition PDA
      is created.
    </p>
    <p class="mt-5">It should have 0 decimals and exactly 1 token outstanding.</p>
    <p class="mt-5">
      You can create one using
      <a class="nes-text is-primary" href="https://www.spl-token-ui.com/#/" target="_blank"
        >this UI</a
      >.
    </p>
    <NotifyWarning class="mt-5">
      (!) You should paste the MINT here, not the address holding the token.
    </NotifyWarning>
    <NotifyWarning class="mt-5">
      (!) If you're using the above UI tool, make sure you've created the token on the right network
      (change in top right-hand corner).
    </NotifyWarning>
    <NotifyWarning class="mt-5">
      (!) Your wallet MUST hold the minting authority for the token. In other words you must have
      created it (or got assigned authority later).
    </NotifyWarning>
  </div>
</template>

<script>
import NotifyWarning from '@/components/notifications/NotifyWarning';

export default {
  components: { NotifyWarning },
};
</script>
