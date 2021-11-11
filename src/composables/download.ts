import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { stringifyPubkeysAndBNsInObject } from '@/common/helpers/util';

export default function useDownload() {
  const JSONToBlob = (jsonFile: any): Blob => {
    const JSONstr = JSON.stringify(stringifyPubkeysAndBNsInObject(jsonFile));
    const JSONbytes = new TextEncoder().encode(JSONstr);
    return new Blob([JSONbytes], { type: 'application/json' });
  };

  const exportJSONZip = (
    jsonFiles: any[],
    jsonAttrAsName: string,
    zipName: string,
    callback: any = null
  ) => {
    const zip = JSZip();
    jsonFiles.map((file) => {
      const blob = JSONToBlob(file);
      return zip.file(`${file[jsonAttrAsName]}.json`, blob);
    });
    zip.generateAsync({ type: 'blob' }).then((zipFile) => {
      const fileName = `${zipName}.zip`;
      FileSaver.saveAs(zipFile, fileName);
      callback();
    });
  };

  return {
    JSONToBlob,
    exportJSONZip,
  };
}
