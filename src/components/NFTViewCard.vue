<template>
  <div class="my-5 nes-container with-title text-xs">
    <p class="title">
      {{ n.metadataExternal.name }} {{ n.metadataExternal.symbol ? '/' : '' }}
      {{ n.metadataExternal.symbol }}
    </p>
    <div class="flex flex-row">
      <img :alt="n.mint" :src="n.metadataExternal.image" />
      <div class="ml-5 text-gray-400">
        <p
          v-if="n.editionType && isMaster(n.editionType)"
          class="bg-pink-300 text-black p-2 inline-block"
        >
          {{ n.editionType }}
        </p>
        <p v-else-if="n.editionType" class="bg-yellow-300 text-black p-2 inline-block">
          {{ n.editionType }} #{{ n.editionData.edition }}
        </p>
        <p v-else class="bg-gray-300 text-gray-700 p-2 inline-block">Edition Unknown</p>
        <p>
          About:
          <span class="text-black">{{ n.metadataExternal.description }}</span>
        </p>
        <p>
          Mint: <span class="text-black">{{ n.mint }}</span>
        </p>
        <p>
          Address: <span class="text-black">{{ n.address ?? NOT_FOUND }}</span>
        </p>
        <p>
          Owner:
          <span class="text-black">{{ n.splTokenInfo ? n.splTokenInfo.owner : NOT_FOUND }}</span>
        </p>
        <div class="flex">
          <button class="nes-btn is-primary" @click="toggleJSON">{ full JSON }</button>
          <QuestionMark class="text-base ml-2 mt-2" @click="showModal('tooltipJSON')" />
        </div>
      </div>
    </div>
    <div v-if="fullJSON" class="bg-gray-200 mt-5 copy-father">
      <button class="nes-btn is-primary copy" @click="doCopyJSON(n)">
        {{ copyText }}
      </button>
      <vue-json-pretty class="text-xs" :data="stringifyPubkeysAndBNsInObject(n)"></vue-json-pretty>
    </div>

    <ModalWindow
      v-if="isModalVisible('tooltipJSON')"
      title="What's this JSON?"
      @hide-modal="hideModal('tooltipJSON')"
    >
      <ContentTooltipJSON />
    </ModalWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';
import useModal from '@/composables/modal';
import ModalWindow from '@/components/ModalWindow.vue';
import ContentTooltipJSON from '@/components/content/tooltip/ContentTooltipJSON.vue';
import QuestionMark from '@/components/QuestionMark.vue';
import useCopy from '@/composables/copy';

export default defineComponent({
  props: {
    n: Object,
  },
  components: {
    QuestionMark,
    ContentTooltipJSON,
    ModalWindow,
    VueJsonPretty,
  },
  setup() {
    const isMaster = (editionType: string) => editionType.toLowerCase().includes('master');
    const fullJSON = ref(false);
    const NOT_FOUND = 'Not found:(';

    const toggleJSON = () => {
      fullJSON.value = !fullJSON.value;
    };

    // --------------------------------------- clipboard
    const { copyText, doCopyJSON } = useCopy();

    // --------------------------------------- modal
    const { registerModal, isModalVisible, showModal, hideModal } = useModal();
    registerModal('tooltipJSON');

    return {
      isMaster,
      fullJSON,
      toggleJSON,
      stringifyPubkeysAndBNsInObject,
      // clipboard
      copyText,
      doCopyJSON,
      // modal
      isModalVisible,
      showModal,
      hideModal,
      NOT_FOUND,
    };
  },
});
</script>

<style scoped>
img {
  max-height: 200px;
  max-width: 200px;
}

p {
  @apply my-2;
}

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
