import * as buffer from "node:buffer";

let File = buffer.File;
if (typeof File === "undefined") {
  // @ts-ignore
  ({ default: File } = await import("./lib/File-node16.js"));
}

export default File;
