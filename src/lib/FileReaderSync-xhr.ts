import encodeBase64 from "./encodeBase64.js";

function readAsTextSync(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.send();
  const text = xhr.responseText;
  URL.revokeObjectURL(url);
  return text;
}

class FileReaderSync {
  readAsArrayBuffer(blob: Blob): ArrayBuffer {
    const text = readAsTextSync(blob);
    const bytes = new TextEncoder().encode(text);
    return bytes.buffer;
  }

  readAsBinaryString(blob: Blob): string {
    const text = readAsTextSync(blob);
    const bytes = new TextEncoder().encode(text);
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
    const text = readAsTextSync(blob);
    return `data:${blob.type};base64,${encodeBase64(text)}`;
  }
}

export default FileReaderSync;
