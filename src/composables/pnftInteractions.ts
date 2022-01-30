import { PNFT } from '@/common/helpers/types';
import usePinata from '@/composables/pinata';


export function generateTicketDetailLink(ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: link to ticket detail page using mintID or undefined (some tickets may not have mintID)
    */
       const ticket_detail_url_prefix = "/ticketdetail/"
       const attr_key = "mintId"
       let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
       return typeof attr != 'undefined' ? ticket_detail_url_prefix + attr : undefined
  }
  

  export function readTicketName (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket name from metadata or undefined (some tickets may not have a name)
    */
     const attr_key = 'name';
    
      let attr = ticket.metadata.hasOwnProperty(attr_key) ? ticket.metadata[attr_key] : undefined
      return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };

  export function readDescription (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads description from metadata or undefined
   */
    const attr_key = 'description'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : ""
 };
  
  export function readTicketStatus (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket status from metadata or undefined
    */
     const attr_key = 'status'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };
  export function readTicketType (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket status from metadata or undefined
    */
     const attr_key = 'ticket_type'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };
  export function readMintID (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket mint ID from metadata or undefined
    */
     const attr_key = 'mintId'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };

  export function getImageURL (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: URL of where image is stored in IPFS
   */
    const attr_key = 'imageURI'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : "Attribute Not Set"
 };

 export function getAnswerMintId (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: mintId of answer (if exists)
   */
    const attr_key = 'answerMintId'
    let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
    return typeof attr != 'undefined' ? attr : ""
 };

 export function getAnswerText (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: mintId of answer (if exists)
   */
     const attr_key = 'answerText'
     let attr = ticket.metadata.keyvalues.hasOwnProperty(attr_key) ? ticket.metadata.keyvalues[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Awaiting answer..."
    };

 export function needsToBeAnswered (ticket: PNFT) {
    console.log('type: ', readTicketType(ticket));
    console.log('status: ', readTicketStatus(ticket));

   return (readTicketType(ticket) == 'question' && readTicketStatus(ticket) == 'open');   
 }

  export function readUserID (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket user ID from metadata or undefined
    */
     const attr_key = 'user_id'
     let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };
  export function readDatePinned (ticket: PNFT) {
    /* Input: Takes in a ticket (pinata NFT metadata)
       Output: reads ticket date pinned to pinata from metadata or undefined
    */
     const attr_key = 'date_pinned'
     let attr = ticket.hasOwnProperty(attr_key) ? ticket[attr_key] : undefined
     return typeof attr != 'undefined' ? attr : "Attribute Not Set"
  };

  export function readIPFSHash (ticket: PNFT) {
   /* Input: Takes in a ticket (pinata NFT metadata)
      Output: reads ipfshash pinned to pinata 
   */
   return ticket.ipfs_pin_hash;
 };

  