interface NodeJSBlobReader {
  pull(cb: (status: number, buffer: ArrayBuffer | undefined) => any): number;
}

interface NodeJSBlobHandle {
  getReader(): NodeJSBlobReader;
}

/**
 * Returns an `ArrayBuffer` by **synchronously** reading the blob provided. This
 * abuses an internal Node.js symbol to access the C++-exposed Blob handle.
 */
function readBlobAsArrayBufferSync(blob: Blob): ArrayBuffer {
  if (!(blob instanceof Blob)) {
    throw new TypeError("blob must be a Blob");
  }

  const kHandle = Object.getOwnPropertySymbols(blob).find(
    (s) => s.description === "kHandle"
  );
  if (!kHandle) {
    throw new DOMException(
      "Could not find Node.js internal blob handle. " +
        "No symbols by the name 'kHandle' exist on the blob.",
      "InvalidAccessError"
    );
  }

  // @ts-ignore
  const blobHandle = blob[kHandle] as NodeJSBlobHandle;
  const reader = blobHandle.getReader();

  const buffers = [] as ArrayBuffer[];
  let error = null as Error | null;
  let done = false;
  let sync = false;
  const read = (status: number, buffer: ArrayBuffer | undefined): void => {
    sync = true;
    if (error) {
      return;
    }

    if (status === 0) {
      done = true;
    } else if (status > 0) {
      if (buffer) {
        buffers.push(buffer);
      } else {
        error = new DOMException(
          "When status indicates success, buffer must exist",
          "InvalidStateError"
        );
      }
    } else {
      error = new DOMException(
        "The Blob could not be read. " +
          `Recieved ${status} from internal pull().`,
        "NotReadableError"
      );
    }
  };
  while (!done) {
    reader.pull(read);
    if (!sync) {
      error = new DOMException(
        "Internal pull() did not execute synchronously",
        "NotSupportedError"
      );
    } else {
      sync = false;
    }
    if (error) {
      throw error;
    }
  }

  if (buffers.length === 0) {
    return new ArrayBuffer(0);
  } else if (buffers.length === 1) {
    return buffers[0];
  } else {
    const byteLength = buffers.reduce((a, x) => a + x.byteLength, 0);
    const bytes = new Uint8Array(byteLength);
    let byteOffset = 0;
    for (const buffer of buffers) {
      bytes.set(new Uint8Array(buffer), byteOffset);
      byteOffset += buffer.byteLength;
    }
    return bytes.buffer;
  }
}

export default readBlobAsArrayBufferSync;
