<template>
  <div class="my-5 nes-container with-title text-xs">
    <h3 class = "title" >{{readTicketName(n)}}</h3>

    <div class="flex flex-row">
      <div class="ml-5 text-gray-400">
        <p>
          <span v-if=generateTicketDetailLink(n) class="text-gray-400"><a :href='generateTicketDetailLink(n)'>Ticket Detail: View</a></span>
          <span v-else class="text-gray-400">Ticket Detail: NA</span>   
        </p>
        <p>
          Date Pinned:
            <span class="text-black">{{readDatePinned(n)}}</span>
        </p>
        <p>
          User ID:
            <span class="text-black">{{readUserID(n)}}</span>
        </p>
        <p>
          Mint ID:
            <span class="text-black">{{readMintID(n)}}</span>
        </p>
        <p>
          Ticket Type:
            <span class="text-black">{{readTicketType(n)}}</span>
        </p>
        <p>
          Ticket Status:
            <span class="text-black">{{readTicketStatus(n)}}</span>
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
import { INFT, PNFT} from '@/common/helpers/types';

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

  methods: {
    readTicketAttributeValue (ticket: INFT, trait_type_item: string) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.metadataExternal.hasOwnProperty("attributes") ? ticket.metadataExternal.attributes.find((tt: { trait_type: string, value: string; }) => tt.trait_type == trait_type_item) : undefined
       return typeof attr != 'undefined' ? attr.value : "Attribute Not Set"
    },
    generateTicketDetailLink (ticket: PNFT) {
      // generates ticket detail link
       const prefix = "ticketdetail/"
       let attr = ticket.metadata.keyvalues.hasOwnProperty('mintId') ? ticket.metadata.keyvalues.mintId : undefined
       console.log("attr is ", attr)
       return typeof attr != 'undefined' ? prefix + attr : undefined

    },

    readTicketName (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.metadata.hasOwnProperty('name') ? ticket.metadata.name : undefined
        console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readTicketStatus (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.metadata.keyvalues.hasOwnProperty('status') ? ticket.metadata.keyvalues.status : undefined
        console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readTicketType (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.metadata.keyvalues.hasOwnProperty('ticket_type') ? ticket.metadata.keyvalues.ticket_type : undefined
       console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readMintID (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.metadata.keyvalues.hasOwnProperty('mintId') ? ticket.metadata.keyvalues.mintId : undefined
       console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readUserID (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.hasOwnProperty('user_id') ? ticket.user_id : undefined
       console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readDatePinned (ticket: PNFT) {
       // Takes in a ticket and returns a particular attribute trait type value
       let attr = ticket.hasOwnProperty('date_pinned') ? ticket.date_pinned : undefined
       console.log("attr is ", attr)
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
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