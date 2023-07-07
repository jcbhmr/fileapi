import { Blob } from "node:buffer";

export default class File extends Blob {
  #name: string;
  #lastModified: number;

  constructor(
    fileBits: Iterable<BlobPart>,
    fileName: string,
    options: FilePropertyBag = {},
  ) {
    fileName = `${fileName}`;
    options = Object(options);

    // @ts-ignore
    super(fileBits, options);

    this.#name = fileName;
    this.#lastModified = options.lastModified ?? Date.now();
  }

  get name(): string {
    return this.#name;
  }

  get lastModified(): number {
    return this.#lastModified;
  }
}
