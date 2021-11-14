<template>
  <div class="my-5 nes-container with-title text-xs">
    <p class="title">
      {{ n.metadataExternal.name }} {{ n.metadataExternal.symbol ? '/' : '' }}
      {{ n.metadataExternal.symbol }}
    </p>
    <div class="flex flex-row">
      <img :alt="n.mint" :src="n.metadataExternal.image" />

      <div class="ml-5 text-gray-400">
        <!--edition-->
        <p
          v-if="n.editionType && isMaster(n.editionType)"
          class="bg-blue-100 text-black p-2 inline-block"
        >
          {{ n.editionType }}
        </p>
        <p v-else-if="n.editionType" class="bg-yellow-100 text-black p-2 inline-block">
          {{ n.editionType }} #{{ n.editionData.edition }}
        </p>
        <p v-else class="bg-gray-100 text-gray-700 p-2 inline-block">Edition Unknown</p>

        <!--rarity-->
        <div v-if="n.rarityScore" class="mt-2 text-black flex">
          <div v-if="n.rarityCategory === 'legendary'" class="bg-rarity-legendary p-2 inline-block">
            Legendary (Top 1%) / Rank: {{ n.rarityRank + 1 }} / Score:
            {{ parseInt(n.rarityScore) }}
          </div>
          <div v-else-if="n.rarityCategory === 'epic'" class="bg-rarity-epic p-2 inline-block">
            Epic (Top 5%) / Rank: {{ n.rarityRank + 1 }} / Score: {{ parseInt(n.rarityScore) }}
          </div>
          <div v-else-if="n.rarityCategory === 'rare'" class="bg-rarity-rare p-2 inline-block">
            Rare (Top 20%) / Rank: {{ n.rarityRank + 1 }} / Score: {{ parseInt(n.rarityScore) }}
          </div>
          <div
            v-else-if="n.rarityCategory === 'uncommon'"
            class="bg-rarity-uncommon p-2 inline-block"
          >
            Uncommon (Top 40%) / Rank: {{ n.rarityRank + 1 }} / Score:
            {{ parseInt(n.rarityScore) }}
          </div>
          <div v-else class="bg-rarity-common p-2 inline-block">
            Common / Rank: {{ n.rarityRank + 1 }} / Score: {{ parseInt(n.rarityScore) }}
          </div>
          <QuestionMark @click="showModal('tooltipRarity')" class="ml-2 mt-2" />
        </div>

        <!--the rest-->
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

    <!--modals-->
    <ModalWindow
      v-if="isModalVisible('tooltipJSON')"
      title="What's this JSON?"
      @hide-modal="hideModal('tooltipJSON')"
    >
      <ContentTooltipJSON />
    </ModalWindow>
    <ModalWindow
      v-if="isModalVisible('tooltipRarity')"
      title="What is Rarity Score?"
      @hide-modal="hideModal('tooltipRarity')"
    >
      <ContentTooltipRarity />
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
import ContentTooltipRarity from '@/components/content/tooltip/ContentTooltipRarity.vue';

export default defineComponent({
  props: {
    n: Object,
  },
  components: {
    ContentTooltipRarity,
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
    registerModal('tooltipRarity');

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
