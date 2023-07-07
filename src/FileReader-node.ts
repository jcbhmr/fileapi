import encodeBase64 from "./lib/encodeBase64.js";

export default class FileReader extends EventTarget {
  static readonly EMPTY = 0 as const;
  static readonly LOADING = 1 as const;
  static readonly DONE = 2 as const;

  declare readonly EMPTY: 0;
  declare readonly LOADING: 1;
  declare readonly DONE: 2;
  static {
    Object.defineProperty(FileReader, "EMPTY", { enumerable: true, value: 0 });
    Object.defineProperty(FileReader, "LOADING", {
      enumerable: true,
      value: 1,
    });
    Object.defineProperty(FileReader, "DONE", { enumerable: true, value: 2 });
  }

  #readyState: 0 | 1 | 2 = 0;
  #result: string | ArrayBuffer | null = null;
  #error: Error | null = null;

  readAsArrayBuffer(blob: Blob): void {
    this.handleLoadStart();
    this.#readyState = FileReader.LOADING;
    blob.arrayBuffer().then(this.#handleLoad, this.#handleError);
  }

  readAsBinaryString(blob: Blob): void {
    this.handleLoadStart();
    this.#readyState = FileReader.LOADING;
    blob
      .arrayBuffer()
      .then((b) => {
        const bytes = new Uint8Array(b);
        let s = "";
        for (let i = 0; i < bytes.length; i += 50) {
          s += String.fromCharCode(...bytes.slice(i, i + 50));
        }
        return s;
      })
      .then(this.#handleLoad, this.#handleError);
  }

  readAsText(blob: Blob, encoding?: string): void {
    this.handleLoadStart();
    this.#readyState = FileReader.LOADING;
    blob.text().then(this.#handleLoad, this.#handleError);
  }

  readAsDataURL(blob: Blob): void {
    this.handleLoadStart();
    blob
      .arrayBuffer()
      .then((b) => `data:${blob.type};base64,${encodeBase64(b)}`)
      .then(this.#handleLoad, this.#handleError);
  }

  handleLoadStart = (): void => {
    if (this.#readyState !== 0) {
      throw new DOMException(undefined, "InvalidStateError");
    }
    this.#readyState = 1;
    this.dispatchEvent(new Event("loadstart"));
  };
  #handleLoad = (x: string | ArrayBuffer): void => {
    if (this.#readyState === 2) {
      return;
    }
    this.#readyState = FileReader.DONE;
    this.#result = x;
    this.dispatchEvent(new Event("load"));
  };
  #handleError = (e: Error): void => {
    if (this.#readyState === 2) {
      return;
    }
    this.#readyState = FileReader.DONE;
    this.#error = e;
    this.dispatchEvent(new Event("error"));
  };

  abort(): void {
    this.#readyState = 2;
    this.#result = null;
    this.dispatchEvent(new Event("abort"));
  }

  get readyState(): 0 | 1 | 2 {
    return this.#readyState;
  }

  get result(): string | ArrayBuffer | null {
    return this.#result;
  }

  get error(): Error | null {
    return this.#error;
  }
}
