// @ts-ignore
import redlet from "tinylet/redlet.js";
import encodeBase64 from "./lib/encodeBase64.js";

const readAsArrayBufferSync = redlet((b: Blob) => b.arrayBuffer());
const readAsTextSync = redlet((b: Blob) => b.text());

class FileReaderSync {
  readAsArrayBuffer(blob: Blob): ArrayBuffer {
    return readAsArrayBufferSync(blob);
  }

  readAsBinaryString(blob: Blob): string {
    const buffer = readAsArrayBufferSync(blob);
    const bytes = new Uint8Array(buffer);
    let s = "";
    for (let i = 0; i < bytes.length; i += 50) {
      s += String.fromCharCode(...bytes.slice(i, i + 50));
    }
    return s;
  }

  readAsText(blob: Blob): string {
    return readAsTextSync(blob);
  }

  readAsDataURL(blob: Blob): string {
    const buffer = readAsArrayBufferSync(blob);
    return `data:${blob.type};base64,${encodeBase64(buffer)}`;
  }
}

export default FileReaderSync;
