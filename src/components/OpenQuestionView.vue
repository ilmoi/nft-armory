<template>
  <div class="my-5 nes-container with-title text-xs">
    <h3 class = "title text-white" >{{readTicketName(n)}}</h3>

    <div class="flex flex-row" style="background-color: white">
      <div class="ml-5 text-black">
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
        <span v-if=generateTicketDetailLink(n) class="text-black-400">
          <a class='nes-btn is-primary' :href='generateTicketDetailLink(n)'>View Answers</a></span>
        <!-- NOTE: show no 'Answer' button if a ticket has no mintID (some PNFTs are missing this & thus ticketdetail view can't work) -->
        <span v-else class="text-black-400">View Answers: N/A</span>
        <p>
        <span>
            <button class="nes-btn is-primary" style="background-color: black; color: white" @click="toggleJSON">{Expand full JSON}</button>
        </span>
        </p>
        <div></div>
        <div class="flex flex-row" >
         
        </div>
      </div>
    </div>
    <div v-if="fullJSON" class="bg-white mt-5 copy-father">
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
    generateTicketDetailLink (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: link to ticket detail page using mintID or undefined (some tickets may not have mintID)
      */
       const ticket_detail_url_prefix = "/ticketdetail/"
       const attr_key = "mintId"
       let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
       return typeof attr != 'undefined' ? ticket_detail_url_prefix + attr : undefined

    },

    readTicketName (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket name from metadata or undefined (some tickets may not have a name)
      */
       const attr_key = 'name'
       let attr = ticket.metadata.hasOwnProperty(attr_key) ? ticket.metadata[attr_key] : undefined
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },

    readTicketStatus (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket status from metadata or undefined
      */
       const attr_key = 'status'
       let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readTicketType (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket status from metadata or undefined
      */
       const attr_key = 'ticket_type'
       let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readMintID (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket mint ID from metadata or undefined
      */
       const attr_key = 'mintId'
       let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readUserID (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket user ID from metadata or undefined
      */
       const attr_key = 'user_id'
       let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
       return typeof attr != 'undefined' ? attr : "Attribute Not Set"
    },
    readDatePinned (ticket: PNFT) {
      /* Input: Takes in a ticket (pinata NFT metadata)
         Output: reads ticket date pinned to pinata from metadata or undefined
      */
       const attr_key = 'date_pinned'
       let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
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