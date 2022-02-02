import { DEFAULTS } from "@/globals";
import Airtable from 'airtable';

import { sendEmail } from "@/composables/emailjs";

const airtableApiKey = DEFAULTS.AIRTABLE_API_KEY
const airtableAppBaseId = DEFAULTS.AIRTABLE_APP_BASE_ID
const gmnhUserTable = DEFAULTS.AIRTABLE_GMNH_USER_TABLE_NAME

var base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppBaseId);

async function queryAirtable(tableName: string, selectionCriteria: Object) {
    /* Query AirTable 
      Inputs: selection critera & table to query
      Outputs: all record results from the executed query
    */
    
    return await base(tableName).select(selectionCriteria).firstPage().then((records: any) => {
                if (records.length) {
                  return records
                } else {
                  return undefined
                }
              })

}


export async function notifyGMNHUser(userWalletId: string, emailType: string, questionLink: string){
  /* Lookup a GMNHUser's email address in airtable & send specified email type
     Input: 
        userWalletId --> user's wallet id
        emailType --> type of email to send (tied to template)
        questionLink --> /question/ link

  */

    let emailAddressColumn = 'EmailAddress'
    let walletKeyColumn = 'WalletKey'

    let filterString = `({${walletKeyColumn}} = '${userWalletId}')`

    let selectionCriteria = {
        maxRecords: 1,
        fields: [emailAddressColumn],
        filterByFormula: filterString
    }

    let output = await queryAirtable(gmnhUserTable, selectionCriteria)

    // only send an email if user found in GMNH Users Airtable
    if (output && output.length == 1){
      let userEmailAddress = output[0].get(emailAddressColumn)
      sendEmail(userEmailAddress, emailType, questionLink)
    }
  }

  export async function hasUserBeenAsked(userWalletId: string) {
      /* Lookup if a GMNH user has been asked to enter their email. 
      If not, ask them and mark them true so we don't ask them again
            userWalletId --> user's wallet id
            emailType --> type of email to send (tied to template)
            questionLink --> /question/ link
    
      */
    
        let hasBeenAskedToEnterEmail = 'hasBeenAskedToEnterEmail'
        let walletKeyColumn = 'WalletKey'
    
        let filterString = `(AND({${walletKeyColumn}} = '${userWalletId}', {${hasBeenAskedToEnterEmail}} = "1"))`
    
        console.log(filterString);

        let selectionCriteria = {
            maxRecords: 1,
            fields: [walletKeyColumn],
            filterByFormula: filterString
        }
    
        let output = await queryAirtable(gmnhUserTable, selectionCriteria)

        console.log('output', output);
    
        // only send an email if user found in GMNH Users Airtable
        if (output && output.length > 0){
          console.log('returning true');
          return true;
        } else {
          return false;
        }

        
      

}



