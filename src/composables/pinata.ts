import pinataSDK, { PinataClient, PinataPinListResponse, PinataPinListResponseRow } from '@pinata/sdk';
import FormData from 'form-data';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import { PNFT } from '@/common/helpers/types';

// todo yes this is INTENTIONALLY LEAKED
//  this is a burner Pinata acc with 1gb free storage I'm using for storing "I want ur NFTs"
//  I'm hoping it won't be abused - if it does, just put in your own and run locally or let me know (twitter @_ilmoi)
const apiKey = '7ed5a3f0849f19876a1e';
const apiSecret = '3d79c1f0f2293450b9c949cacc293c22223eeb8a33b24124e2d750c86627cbc9';




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
   const attr_key = 'name'
   let attr = ticket.metadata.hasOwnProperty(attr_key) ? ticket.metadata[attr_key] : undefined
   return typeof attr != 'undefined' ? attr : "Attribute Not Set"
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

export default function usePinata() {
  const pinata = pinataSDK(apiKey, apiSecret);

  const uploadImg = async (blob: Blob, walletAddr: PublicKey): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const data = new FormData();
    data.append('file', blob);

    const metadata = JSON.stringify({
      name: `${walletAddr.toBase58()}.png`,
    });
    data.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    data.append('pinataOptions', pinataOptions);

    const res = await axios.post(url, data, {
      maxBodyLength: 'Infinity' as any, // this is needed to prevent axios from erroring out with large files
      headers: {
        // @ts-ignore
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    });
    return res.data.IpfsHash;
  };

  const hashToURI = (hash: string) => `https://gateway.pinata.cloud/ipfs/${hash}`;

  const URIToHash = (uri: string) => uri.substring(uri.lastIndexOf("/") + 1, uri.length);

  /*  const uploadJSON = async (imgIpfsHash: string, walletAddr: PublicKey) => {
      return uploadJSONWithDescription(imgIpfsHash, walletAddr, "description");
    }; */

  const uploadJSON = async (imgIpfsHash: string, walletAddr: PublicKey, title: string) => {
    const metadata = {
      name: 'HelpDesk Ticket',
      symbol: 'HELPv1',
      description: title,
      seller_fee_basis_points: 0,
      image: hashToURI(imgIpfsHash),
      properties: {
        category: 'image',
        files: [
          {
            uri: hashToURI(imgIpfsHash),
            type: 'image/png',
          },
        ],
        creators: [
          {
            address: walletAddr.toBase58(),
            share: 100,
          },
        ],
      },
    };

    const options = {
      pinataMetadata: {
        name: title,
        keyvalues: {
          'ticket_type': 'question',
          'status': 'open'
        }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(metadata, options as any);
    return res.IpfsHash;
  };


  const uploadJSONForAnswer = async (imgIpfsHash: string, walletAddr: PublicKey, title: string, questionID: string) => {
    const metadata = {
      name: 'HelpDesk Response',
      symbol: 'HELPv1',
      description: title,
      seller_fee_basis_points: 0,
      image: hashToURI(imgIpfsHash),
      properties: {
        category: 'image',
        files: [
          {
            uri: hashToURI(imgIpfsHash),
            type: 'image/png',
          },
        ],
        creators: [
          {
            address: walletAddr.toBase58(),
            share: 100,
          },
        ],
      },
    };

    const options = {
      pinataMetadata: {
        name: title,
        keyvalues: {
          'ticket_type': 'answer',
          'questionMintId': questionID,
        }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(metadata, options as any);
    return res.IpfsHash;
  };

  const retrieveOpenTickets =  async() => {
    /* Search Pinata account for open NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    const pinata_results = await searchForOpenTickets()
    const pnfts = (await convertTicketsToPNFTs(pinata_results))
    return pnfts
  };

  const searchForOpenTickets =  async() => {
    /* Search Pinata account for open NTF tickets using metadata filter
    */
    const metadataFilter = {
      keyvalues: {
        ticket_type: {
              value: 'question',
              op: 'eq'
          },
          status: {
            value: 'open',
            op: 'eq'
        },
      },

    
    
    };
  
    const filters = {
        status : 'pinned',
        pageLimit: 25,
        pageOffset: 0,
        metadata: metadataFilter
    };

    const res = (await pinata.pinList(filters))
    return res.rows
  };

  async function convertTicketsToPNFTs(tokens: PinataPinListResponseRow[]): Promise<PNFT[]> {
    /* Convert tickets from Pinata search by cross-mapping data to new objects in memory
       Takes PinataPinListResponseRow[] ----> PNFT
    */
    return Promise.all(tokens.map(async (t) =>
        ({
          id: t.id,
          user_id: t.user_id,
          size: t.size,
          ipfs_pin_hash: t.ipfs_pin_hash,
          date_pinned: t.date_pinned,
          metadata: t.metadata,
        })
      )
    
    )
  }

  const updatePinataMetadata = async(ipfsHash: string, metaDataHash: {}) => {
    
    pinata.hashMetadata(ipfsHash, metaDataHash).then((result) => {
      //handle results here
        console.log(result);
      }).catch((err) => {
      //handle error here
      console.log(err);
    });
  };




  return {
    uploadImg,
    uploadJSON,
    hashToURI,
    URIToHash,
    uploadJSONForAnswer,
    searchForOpenTickets,
    updatePinataMetadata,
    convertTicketsToPNFTs,
    retrieveOpenTickets
  };
}

usePinata();
