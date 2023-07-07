import { test, assert } from "vitest";
import FileReaderSync from "../src/FileReaderSync.js";

test("new FileReaderSync()", () => {
  new FileReaderSync();
});

test("readAsArrayBuffer()", () => {
  const blob = new Blob(["Hello, world!"]);
  const buffer = new FileReaderSync().readAsArrayBuffer(blob);
  assert(buffer instanceof ArrayBuffer);
  assert.equal(new TextDecoder().decode(buffer), "Hello, world!");
});

test("readAsBinaryString()", () => {
  const input = "Hello, world!👋❌✅🔀😎👍";

  const blob = new Blob([input]);
  const actual = new FileReaderSync().readAsBinaryString(blob);

  const bytes = new TextEncoder().encode(input);
  let expected = "";
  for (let i = 0; i < bytes.length; i += 50) {
    expected += String.fromCharCode(...bytes.slice(i, i + 50));
  }

  assert.equal(actual, expected);
});

test("readAsText()", () => {
  const blob = new Blob(["Hello, world!"]);
  const text = new FileReaderSync().readAsText(blob);
  assert.equal(text, "Hello, world!");
});

test("readAsDataURL()", () => {
  const blob = new Blob(["Hello, world!"]);
  const dataURL = new FileReaderSync().readAsDataURL(blob);
  assert.equal(
    dataURL,
    "data:;base64," + Buffer.from("Hello, world!").toString("base64")
  );
});
