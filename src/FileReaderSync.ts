let FileReaderSync = globalThis.FileReaderSync;
if (
  typeof FileReaderSync === "undefined" &&
  typeof SharedArrayBuffer !== "undefined"
) {
  ({ default: FileReaderSync } = await import("./lib/FileReaderSync.js"));
}

export default FileReaderSync;
