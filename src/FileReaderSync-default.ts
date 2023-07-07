import type FileReaderSync_ from "./FileReaderSync-node.js";
import supportsSharedArrayBufferAndAtomicsWait from "./lib/supportsSharedArrayBufferAndAtomicsWait.js";

// @ts-ignore
let FileReaderSync: typeof FileReaderSync_ = globalThis.FileReaderSync;
if (typeof FileReaderSync === "undefined") {
  if (supportsSharedArrayBufferAndAtomicsWait()) {
    ({ default: FileReaderSync } = await import("./FileReaderSync-node.js"));
  } else if (typeof XMLHttpRequest !== "undefined") {
    ({ default: FileReaderSync } = await import("./lib/FileReaderSync-xhr.js"));
  } else {
    // TODO: Decide to throw error, warn, or do nothing
  }
}
export default FileReaderSync;
