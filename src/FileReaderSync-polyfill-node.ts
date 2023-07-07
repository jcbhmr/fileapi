import FileReaderSync_ from "./FileReaderSync-node.js";

declare global {
  interface FileReaderSync extends FileReaderSync_ {}
  var FileReaderSync: typeof FileReaderSync_;
}

globalThis.FileReaderSync = FileReaderSync_;
