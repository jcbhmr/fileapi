import { assert, expect, test } from "vitest";
import { openAsBlob } from "node:fs";
import readBlobAsArrayBufferSync from "../src/readBlobAsArrayBufferSync.ts";

test("works with user-created blobs", () => {
  const blob = new Blob(["Hello world!"])
  const buffer = readBlobAsArrayBufferSync(blob)
  assert(blob.size === buffer.byteLength)
})

test("works with nested user-created blobs", () => {
  const blob1 = new Blob(["Hello"])
  const blob2 = new Blob([blob1, " world!"])
  const buffer = readBlobAsArrayBufferSync(blob)
  assert(blob2.size === buffer.byteLength)
})

test("works with fetch-created blobs", async () => {
  const response = await fetch("https://example.org")
  const blob = await response.blob()
  const buffer = readBlobAsArrayBufferSync(blob)
  assert(blob.size === buffer.byteLength)
})

test("works with fs-created blobs", async () => {
  const blob = await openAsBlob("package.json")
  const buffer = readBlobAsArrayBufferSync(blob)
  assert(blob.size === buffer.byteLength)
})

test("works with nested fs-created blobs", async () => {
  const blob1 = await openAsBlob("package.json")
  const blob2 = await openAsBlob("package.json")
  const blob3 = new Blob([blob1, blob2])
  const buffer = readBlobAsArrayBufferSync(blob3)
  assert(blob3.size === buffer.byteLength)
})
