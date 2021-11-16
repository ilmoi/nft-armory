<template>
  <div>
    <p>It's dead simple:</p>
    <p class="mt-5">
      1. Enter the desired NFT name and your contact details. Adjust the text so that it fits inside
      the green square
    </p>
    <p>2. Connect your wallet and mint the new NFT</p>
    <p>3. It will appear it your wallet. Send it to whomever you want:)</p>
    <p class="mt-5">
      If you're wondering where the metadata is being stored - I'm using a burner Pinata account
      with 1GB free space. If you want more privacy, download the
      <a href="https://github.com/ilmoi/nft-armory" target="_blank" class="nes-text is-primary"
        >OSS code</a
      >
      and tweak the Pinata API key to use your own account.
    </p>
    <NotifyWarning class="mt-5"
      >With great power comes great responsibility. Please don't spam. We're all in this
      together.</NotifyWarning
    >
  </div>
</template>
<script>
import NotifyWarning from '@/components/notifications/NotifyWarning';

export default {
  components: { NotifyWarning },
};
</script>
