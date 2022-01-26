// import { DEFAULTS } from "@/globals";
// const airtable_api_key = DEFAULTS.AIRTABLE_API_KEY
// const airtable_app_base_id = DEFAULTS.AIRTABLE_APP_BASE_ID
// const gmnh_user_table = DEFAULTS.AIRTABLE_GMNH_USER_TABLE_NAME
var airtable_api_key = '';
var airtable_app_base_id = '';
var gmnh_user_table = '';
var Airtable = require('airtable');


var base = new Airtable({ apiKey: airtable_api_key }).base(airtable_app_base_id);
const queryAirtable = async(tableName, selectionCriteria) => {
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

    let output = await queryAirtable(gmnh_user_table, selectionCriteria)
    let emailAddress = output[0].get(emailAddressColumn)

    console.log("output email address is: ", emailAddress )
}


retrieveEmailAddressUsingWalletId('2WJwPd4EG7wZmx2BjAASoMh1pfRYLLb1CHj4oMooPKb5')
console.log("file executed")


