<template>
  <div>
    <p>Here's an example:</p>
    <div class="bg-gray-200 mt-5 copy-father">
      <button class="nes-btn is-primary copy" @click="doCopyJSON(data)">
        {{ copyText }}
      </button>
      <vue-json-pretty class="text-xs" :data="data"></vue-json-pretty>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import useCopy from '@/composables/copy';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';

export default defineComponent({
  components: { VueJsonPretty },
  setup() {
    const data = JSON.parse(`
    {
      "name": "new_name",
      "symbol": "new_symbol",
      "uri": "https://gateway.pinata.cloud/ipfs/QmNQh8noRHn7e7zt9oYNfGWuxHgKWkNPducMZs1SiZaYw4",
      "sellerFeeBasisPoints": 10,
      "creators": [
        {
          "address": "75ErM1QcGjHiPMX7oLsf9meQdGSUs4ZrwS2X8tBpsZhA",
          "verified": false,
          "share": 50
        },
        {
          "address": "AGsJu1jZmFcVDPdm6bbaP54S3sMEinxmdiYWhaBBDNVX",
          "verified": false,
          "share": 50
        }
      ]
    }
    `);

    // --------------------------------------- clipboard
    const { copyText, doCopyJSON } = useCopy();

    return {
      data,
      copyText,
      doCopyJSON,
      stringifyPubkeysAndBNsInObject,
    };
  },
});
</script>

<style scoped>
.copy-father {
  position: relative;
}

.copy {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
}
</style>
