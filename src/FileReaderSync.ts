import yellowlet from "@jcbhmr/yellowlet";

export default class FileReaderSync {
  #asciiDecoder: TextDecoder | null | undefined;

  readAsArrayBuffer(blob: Blob): ArrayBuffer {
    return yellowlet((blob: Blob) => blob.arrayBuffer())(blob);
  }

  readAsBinaryString(blob: Blob): string {
    const buffer = this.readAsArrayBuffer();
    this.#asciiDecoder ??= new TextDecoder("ascii");
    return this.#asciiDecoder.decode(buffer);
  }

  readAsText(blob: Blob): string {
    return yellowlet((blob: Blob) => blob.text())(blob);
  }

  readAsDataURL(blob: Blob): string {
    const binaryString = this.readAsBinaryString();
    const base64 = btoa(binaryString);
    return `data:${blob.type};base64,${base64}`;
  }
}
