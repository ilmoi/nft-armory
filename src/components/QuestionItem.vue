<template>
   <!-- <MDBTabItem class="gmnh-pill" :wrap="false" v-bind:tabId="tabIdentifier" v-bind:href="tabIdentifier">{{readTicketName(n)}}</MDBTabItem> -->
  <!--  <tab :title="`{readTicketName(n)}`">
        <h3>{{readMintID(n)}}</h3>
    </tab>     -->

 <tab :title="Tab">     
        <h3>test4</h3>
    </tab></template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import Tab from '@/components/Tab.vue';
import { INFT, PNFT} from '@/common/helpers/types';
import * as pnftInteractions from '@/composables/pnftInteractions'
//import {MDBTabs, MDBTabNav, MDBTabContent, MDBTabItem, MDBTabPane} from 'mdb-vue-ui-kit';

export default defineComponent({
  props: {
    id: { type: String},
    n: Object,
  },
  components: {
    Tab,
//    MDBTabItem
  },

  // by referencing methods here, have access through Vue componet + for other needs
  methods: {
    generateTicketDetailLink: function(ticket: PNFT) {
      return pnftInteractions.generateTicketDetailLink(ticket)
    },
    readTicketName: function(ticket: PNFT) {
      return pnftInteractions.readTicketName(ticket)
    },
    readTicketStatus: function(ticket: PNFT) {
      return pnftInteractions.readTicketStatus(ticket)
    },
    readMintID: function(ticket: PNFT) {
      return pnftInteractions.readMintID(ticket)
    },
    readUserID: function(ticket: PNFT) {
      return pnftInteractions.readUserID(ticket)
    },
    readDatePinned: function(ticket: PNFT) {
      return pnftInteractions.readDatePinned(ticket)
    },
    readTicketType: function(ticket: PNFT){
      return pnftInteractions.readTicketType(ticket)
    }
  },

  setup(props) {
    const tabIdentifier = computed(() => {return "ex4-" + props.id});

    return {
      tabIdentifier,
    };
  },
});
</script>

<style>


</style>