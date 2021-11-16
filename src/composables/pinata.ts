import pinataSDK from '@pinata/sdk';
import FormData from 'form-data';
import axios from 'axios';
import { PublicKey } from '@solana/web3.js';

// todo yes this is INTENTIONALLY LEAKED
//  this is a burner Pinata acc with 1gb free storage I'm using for storing "I want ur NFTs"
//  I'm hoping it won't be abused - if it does, just put in your own and run locally or let me know (twitter @_ilmoi)
const apiKey = '36a65d20900b77b7b95b';
const apiSecret = '602ef9e1d7ae8805e26ca626182a407cc12fa7d8a67446d33cc1322ab93a24ed';

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

  const uploadJSON = async (imgIpfsHash: string, walletAddr: PublicKey) => {
    const metadata = {
      name: 'I WANT UR NFT',
      symbol: 'WTB_NFT',
      description: 'Hmu brotha/sista',
      seller_fee_basis_points: 0,
      image: hashToURI(imgIpfsHash),
      attributes: [
        {
          trait_type: 'persistence',
          value: 'endless',
        },
      ],
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
        name: `${walletAddr.toBase58()}.json`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const res = await pinata.pinJSONToIPFS(metadata, options as any);
    return res.IpfsHash;
  };

  return {
    uploadImg,
    uploadJSON,
    hashToURI,
  };
}

usePinata();
