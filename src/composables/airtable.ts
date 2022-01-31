import { DEFAULTS } from "@/globals";
import Airtable from 'airtable';

import emailjs from '@emailjs/browser/'

const airtableApiKey = DEFAULTS.AIRTABLE_API_KEY
const airtableAppBaseId = DEFAULTS.AIRTABLE_APP_BASE_ID
const gmnhUserTable = DEFAULTS.AIRTABLE_GMNH_USER_TABLE_NAME
const gmnhEmailHandle = DEFAULTS.GMNH_EMAIL_HANDLE
const emailjsServiceId = DEFAULTS.EMAILJS_SERVICE_ID;
const emailjsTemplateId = DEFAULTS.EMAILJS_TEMPLATE_ID;
const emailjsUserId = DEFAULTS.EMAILJS_USER_ID



var base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppBaseId);
async function queryAirtable(tableName: string, selectionCriteria: Object) {
    /* Query AirTable 
      Inputs: selection critera & table to query
      Outputs: all record results from the executed query
    */
    
    return await base(tableName).select(selectionCriteria).firstPage().then((records: any) => {
                if (records.length) {
                  console.log("yeah found")
                  return records
                } else {
                  console.log("yike")
                  return "nope"
                }
              })

}


export async function retrieveEmailAddressUsingWalletId (walletId: string){

    let emailAddressColumn = 'EmailAddress'
    let walletKeyColumn = 'WalletKey'

    let filterString = `({${walletKeyColumn}} = '${walletId}')`

    let selectionCriteria = {
        maxRecords: 1,
        fields: [emailAddressColumn],
        filterByFormula: filterString
    }

    let output = await queryAirtable(gmnhUserTable, selectionCriteria)
    let emailAddress = output[0].get(emailAddressColumn)

    console.log("output email address is: ", emailAddress )

    notifyGMNHUser(emailAddress)
  

}


function notifyGMNHUser(emailAddress: string){
  /* initialize message and send email using emailjs
  */


  var templateParams = {
    to_email: emailAddress,
    message: `hola! your open question was just answered on gmnh!`
  };

 
  emailjs.send(emailjsServiceId, emailjsTemplateId, templateParams, emailjsUserId)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });


}


