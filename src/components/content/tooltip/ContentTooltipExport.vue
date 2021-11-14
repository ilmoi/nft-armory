<template>
  <div>
    <p>
      If you're exporting a collection of 10,000 NFTs, export can be a bit slow. But it will work
      eventually.
    </p>
    <NotifyWarning class="mt-5">
      (!) The main thing is - DO NOT SWITCH TABS. If you switch tabs export prepartion pauses.
    </NotifyWarning>
    <p class="mt-5">
      You can switch to a different app, or even open a new browser window, just don't switch tabs
      in the window where you have NFT Armory running, or the export will stall. It's weird, but
      that's how it is.
    </p>
  </div>
</template>
<script>
import NotifyWarning from '@/components/notifications/NotifyWarning';

export default {
  components: { NotifyWarning },
};
</script>
