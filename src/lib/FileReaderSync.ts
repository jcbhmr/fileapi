import redlet from "tinylet/redlet.js";
import { fromByteArray } from "base64-js";

const readAsArrayBufferSync = redlet((b: Blob) => b.arrayBuffer());
const readAsTextSync = redlet((b: Blob) => b.text());

function encodeBase64(source: BufferSource | string): string {
  if (typeof source === "string") {
    const bytes = new TextEncoder().encode(source);
    return fromByteArray(bytes);
  } else {
    const bytes = ArrayBuffer.isView(source)
      ? source instanceof Uint8Array
        ? source
        : new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
      : new Uint8Array(source);
    return fromByteArray(bytes);
  }
}

class FileReaderSync {
  constructor() {}

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

  readAsText(blob: Blob, encoding?: string): string {
    return readAsTextSync(blob);
  }

  readAsDataURL(blob: Blob): string {
    const buffer = readAsArrayBufferSync(blob);
    return `data:${blob.type};base64,${encodeBase64(buffer)}`;
  }
}

export default FileReaderSync;
