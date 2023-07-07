import FileReaderSync_ from "./FileReaderSync-default.js";

// Why is this needed? I don't know.
type FileReaderSync_ = typeof FileReaderSync_;
declare global {
  interface FileReaderSync extends FileReaderSync_ {}
  var FileReaderSync: typeof FileReaderSync_;
}

globalThis.FileReaderSync ??= FileReaderSync_;
