import { readonly, ref } from 'vue';
import useClipboard from 'vue-clipboard3';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';

const { toClipboard } = useClipboard();

export default function useCopy() {
  const copyText = ref<string>('copy');

  const setCopyText = (newText: string) => {
    copyText.value = newText;
  };

  const doCopy = async (text: any) => {
    try {
      await toClipboard(text);
      const oldText = copyText.value;
      copyText.value = 'copied!';
      setTimeout(() => {
        copyText.value = oldText;
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
    setCopyText,
    doCopy,
    doCopyJSON,
  };
}
