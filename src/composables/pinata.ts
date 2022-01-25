import pinataSDK, { PinataClient, PinataPinListResponse, PinataPinListResponseRow } from '@pinata/sdk';
import FormData from 'form-data';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';
import { PNFT } from '@/common/helpers/types';
import * as pnftInteractions from '@/composables/pnftInteractions';


// todo yes this is INTENTIONALLY LEAKED
//  this is a burner Pinata acc with 1gb free storage I'm using for storing "I want ur NFTs"
//  I'm hoping it won't be abused - if it does, just put in your own and run locally or let me know (twitter @_ilmoi)
const apiKey = '7ed5a3f0849f19876a1e';
const apiSecret = '3d79c1f0f2293450b9c949cacc293c22223eeb8a33b24124e2d750c86627cbc9';
 

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

  const uploadJSON = async (imgIpfsHash: string, gmnhWalletAddr: PublicKey, title: string, userWalletAddr: PublicKey) => {
    const metadata = {
      name: 'GMNeedHelp Question',
      symbol: 'HELP',
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
            address: gmnhWalletAddr.toBase58(),
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
          'status': 'open',
          'generation': 'GENESIS',
          'userWallet': userWalletAddr.toBase58(),
          'imageURI': hashToURI(imgIpfsHash)
        }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(metadata, options as any);
    return res.IpfsHash;
  };


  const uploadJSONForAnswer = async (imgIpfsHash: string, gmnhWalletAddr: PublicKey, title: string, questionID: string, userWalletAddr: PublicKey) => {
    const metadata = {
      name: 'GMNeedHelp Answer',
      symbol: 'HELP',
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
            address: gmnhWalletAddr.toBase58(),
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
          'generation': 'GENESIS',
          'userWallet': userWalletAddr.toBase58(),
          'imageURI': hashToURI(imgIpfsHash)
        }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(metadata, options as any);
    return res.IpfsHash;
  };

  const retrieveOpenTickets =  async(userWalletAddr: PublicKey) => {
    /* Search Pinata account for open NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    //TODO: need to add whitelist check
    const pinata_results = await searchForOpenTickets()
    const pnfts = (await convertTicketsToPNFTs(pinata_results));

    return pnfts;
  };

  const retrieveMyQuestions =  async(userWalletAddr: PublicKey) => {
    /* Search Pinata account for open NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    const pinata_results = await searchForMyQuestions(userWalletAddr);
    const pnfts = (await convertTicketsToPNFTs(pinata_results));

    return pnfts;

      //we dont need to do this anymore
   /* await pnfts.forEach(pnft => getAnswerText(pnft)); 
    */
  };

  const retrieveAnsweredQuestions =  async(userWalletAddr: PublicKey) => {
    /* Search Pinata account for answered NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    const pinata_results = await searchForAnsweredQuestions(userWalletAddr);
    const pnfts = (await convertTicketsToPNFTs(pinata_results));

    return pnfts;

      //we dont need to do this anymore
   /* await pnfts.forEach(pnft => getAnswerText(pnft)); 
    */
  };

  const searchByMintId =  async(mintId: string) => {
    /* Search Pinata account by mintId
    */
    const metadataFilter = {
      keyvalues: {
        mintId: {
              value: mintId,
              op: 'eq'
          }      
      },
    };
  
    const filters = {
        status : 'pinned',
        pageLimit: 1,
        pageOffset: 0,
        metadata: metadataFilter
    };

    const res = (await pinata.pinList(filters))
    const pnfts = (await convertTicketsToPNFTs(res.rows));
    return pnfts;
  };

  const retrieveByMintId =  async(mintId: string) => {
    /* Search Pinata account for open NTF tickets & 
       preprocess retrieved metadata by saving as PNFT objects
    */

    const pinata_results = await searchByMintId(mintId!);
    const pnfts = (await convertTicketsToPNFTs(pinata_results));

    return pnfts;


      //NO LONGER NEED THIS SINCE WE'RE STORING ANSWER TEXT direclty in question metadata
   // await pnfts.forEach(pnft => getAnswerText(pnft)); 
  };

  const searchForAnsweredQuestions =  async(userWalletAddr: PublicKey) => {
    /* Search Pinata account for open NTF tickets using metadata filter
    */
    const metadataFilter = {
      keyvalues: {
        ticket_type: {
              value: 'question',
              op: 'eq'
          },
          status: {
            value: 'answered',
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

  const searchForMyQuestions =  async(userWalletAddr: PublicKey) => {
    /* Search Pinata account for user's open NTF tickets using metadata filter
    */
    const metadataFilter = {
      keyvalues: {
        ticket_type: {
              value: 'question',
              op: 'eq'
          },
        userWallet: {
          value: userWalletAddr.toBase58(),
          op: 'eq'
        }
      },
    };
  
    const filters = {
        status : 'pinned',
        pageLimit: 25,
        pageOffset: 0,
        metadata: metadataFilter
    };

    const res = (await pinata.pinList(filters));
    return res.rows
  };



  async function convertTicketsToPNFTs(tokens: PinataPinListResponseRow[]): Promise<PNFT[]> {
    /* Convert tickets from Pinata search by cross-mapping data to new objects in memory
       Takes PinataPinListResponseRow[] ----> PNFT
    */
    return Promise.all(tokens.map(async (t) =>
        (
          {
          id: t.id,
          user_id: t.user_id,
          size: t.size,
          ipfs_pin_hash: t.ipfs_pin_hash,
          date_pinned: t.date_pinned,
          date_unpinned: t.date_unpinned,
          metadata: t.metadata,
        })
      )
    
    )
  }

  const updatePinataMetadata = async(ipfsHash: string, metaDataHash: {}) => {

    pinata.hashMetadata(ipfsHash, metaDataHash).then((result) => {
      //handle results here
      }).catch((err) => {
      //handle error here
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
    retrieveOpenTickets,
    retrieveMyQuestions,
    searchByMintId,
    retrieveByMintId,
    retrieveAnsweredQuestions
  };
}

usePinata();
