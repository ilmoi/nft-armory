import { readonly, ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';

const { toClipboard } = useClipboard();

export default function useCopy() {
  const copyText = ref('copy');

  const doCopy = async (text: any) => {
    try {
      await toClipboard(text);
      copyText.value = 'done!';
      setTimeout(() => {
        copyText.value = 'copy';
      }, 1000);
    } catch (e) {
      console.error(`Error when copying to clipboard - ${e}`);
    }
  };

  const doCopyJSON = async (json: any) => {
    await doCopy(JSON.stringify(stringifyPubkeysAndBNsInObject(json)));
  };

  return {
    copyText: readonly(copyText),
    doCopy,
    doCopyJSON,
  };
}
