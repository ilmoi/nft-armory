import { readonly, ref } from 'vue';
import { PublicKey } from '@solana/web3.js';

export default function useError() {
  const error = ref<Error | null>(null);

  const clearError = () => {
    error.value = null;
  };

  const setError = (e: Error) => {
    error.value = e;
  };

  const tryConvertToPk = (strPk: string | null): PublicKey | null => {
    if (strPk) {
      try {
        return new PublicKey(strPk);
      } catch (e) {
        error.value = new Error('Bad public key entry. Did you spell it correctly? ');
      }
    }
    return null;
  };

  return {
    error: readonly(error),
    clearError,
    setError,
    tryConvertToPk,
  };
}
