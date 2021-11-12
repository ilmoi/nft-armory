import { readonly, ref } from 'vue';
import { Keypair, PublicKey } from '@solana/web3.js';
import { programs } from '@metaplex/js';

export default function useError() {
  const error = ref<Error | null>(null);

  const clearError = () => {
    error.value = null;
  };

  const setError = (e: Error) => {
    // todo temp hack before proper error-handling in place
    if (e.message === "Cannot read properties of null (reading '_bn')") {
      error.value = new Error('Missing a required field');
      return;
    }
    if (e.message === 'unable to get metadata json from url null') {
      error.value = new Error('Missing URI');
      return;
    }
    error.value = e;
  };

  const tryConvertToPk = (strPk: string | null): PublicKey | null => {
    if (strPk) {
      try {
        return new PublicKey(strPk);
      } catch (e) {
        error.value = new Error('Bad public key entry. Did you spell it correctly?');
      }
    }
    return null;
  };

  const tryParseJSON = (strJSON: string | null): any => {
    if (strJSON) {
      try {
        return JSON.parse(strJSON);
      } catch (e) {
        error.value = new Error('Failed to parse JSON. Did you format it correctly?');
      }
    }
    return null;
  };

  const tryParseMetadataData = (jsonMetadata: any): programs.metadata.MetadataDataData | null => {
    if (jsonMetadata) {
      try {
        return new programs.metadata.MetadataDataData({
          name: jsonMetadata.name,
          symbol: jsonMetadata.symbol,
          uri: jsonMetadata.uri,
          sellerFeeBasisPoints: jsonMetadata.sellerFeeBasisPoints,
          creators: jsonMetadata.creators.map(
            (c: any) =>
              new programs.metadata.Creator({
                address: c.address,
                verified: c.verified,
                share: c.share,
              })
          ),
        });
      } catch (e) {
        console.log(e);
        error.value = new Error('Failed to parse Metadata. Did you enter all the required fields?');
      }
    }
    return null;
  };

  return {
    error: readonly(error),
    clearError,
    setError,
    tryConvertToPk,
    tryParseJSON,
    tryParseMetadataData,
  };
}
