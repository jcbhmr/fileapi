import { test, assert } from "vitest";
import File from "../../src/lib/File-node16.js";

test("new File()", () => {
  new File([], "file.txt");
});

test("new File() with options", () => {
  new File([], "file.txt", { type: "text/plain" });
});

test("name", () => {
  const file = new File([], "file.txt");
  assert.equal(file.name, "file.txt");
});

test("lastModified", () => {
  const file = new File([], "file.txt", { lastModified: 0 });
  assert.equal(file.lastModified, 0);
});
