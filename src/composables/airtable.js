// import { DEFAULTS } from "@/globals";
const nodemailer = require('nodemailer');

// const airtableApiKey = DEFAULTS.AIRTABLE_API_KEY
// const airtableAppBaseId = DEFAULTS.AIRTABLE_APP_BASE_ID
// const gmnhUserTable = DEFAULTS.AIRTABLE_GMNH_USER_TABLE_NAME
// const gmnhEmailHandle = DEFAULTS.GMNH_EMAIL_HANDLE
// const gmnhEmailAppPassword = DEFAULTS.GMNH_EMAIL_APP_PASSWORD

const { DEFAULTS } = require('../globals');

var airtableApiKey = '';
var airtableAppBaseId = '';
var gmnhUserTable = '';
var Airtable = require('airtable');
var gmnhEmailHandle = '';
var gmnhEmailAppPassword = '';


var base = new Airtable({ apiKey: airtableApiKey }).base(airtableAppBaseId);
async function queryAirtable(tableName, selectionCriteria) {
    /* Query AirTable 
      Inputs: selection critera & table to query
      Outputs: all record results from the executed query
    */
    
    return await base(tableName).select(selectionCriteria).firstPage().then((records) => {
                if (records.length) {
                  console.log("yeah found")
                  return records
                } else {
                  console.log("yike")
                  return "nope"
                }
              })

}


async function retrieveEmailAddressUsingWalletId (walletId){

    emailAddressColumn = 'EmailAddress'
    walletKeyColumn = 'WalletKey'

    let filterString = `({${walletKeyColumn}} = '${walletId}')`

    selectionCriteria = {
        maxRecords: 1,
        fields: [emailAddressColumn],
        filterByFormula: filterString
    }

    let output = await queryAirtable(gmnhUserTable, selectionCriteria)
    let emailAddress = output[0].get(emailAddressColumn)

    console.log("output email address is: ", emailAddress )

    emailTransporter = initializeEmailTransporter()
  
    notifyGMNHUser(emailAddress, emailTransporter)

}



function notifyGMNHUser(emailAddress, emailTransporter){
  /*  Notifies GMNH User about a response to their open question
      Input: email handle, email Transporter, metadata for email
      Output: Nothing; sends email
  */


      emailTransporter.sendMail({
      from: gmnhEmailHandle, // sender address
      to: gmnhEmailHandle, // list of receivers
      subject: "TEST MESSAGE: GMNH EMAIL USER ✔", // Subject line
      text: "Hola! This is a test message to notify you about your open question on GMNH being answered", // plain text body
    }).then(info => {
      console.log({info});
    }).catch(console.error);

}


function initializeEmailTransporter(){
  /* initialize Email Transporter & verify its successful creation
  */

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: gmnhEmailHandle,
      pass: gmnhEmailAppPassword,
    },
  });

  transporter.verify().then(console.log).catch(console.error);

    return transporter
}


retrieveEmailAddressUsingWalletId('2WJwPd4EG7wZmx2BjAASoMh1pfRYLLb1CHj4oMooPKb5')
console.log("file executed")


