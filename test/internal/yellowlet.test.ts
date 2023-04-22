import yellowlet from "../../src/internal/yellowlet";
import { test, assert, expect } from "vitest";

test("works with basic numbers", () => {
  const add = yellowlet(async (a: number, b: number) => a + b);
  expect(add(1, 2)).toBe(3);
});

test("works with basic strings", () => {
  const concat = yellowlet(async (a: string, b: string) => a + b);
  expect(concat("Hello", "World")).toBe("HelloWorld");
});

test("passes through an ArrayBuffer using transfers", () => {
  const passArrayBuffer = yellowlet(async (a: ArrayBuffer) => a);
  const original = new ArrayBuffer(4);
  const backAgain = passArrayBuffer(original);

  expect(original.byteLength).toBe(0);
  expect(backAgain.byteLength).toBe(4);
});

test("can synchronously read a Blob into an ArrayBuffer", () => {
  const readBlob = yellowlet(async (blob: Blob) => await blob.arrayBuffer());

  const blob = new Blob(["Hello World"]);
  const result = readBlob(blob);
  const resultText = new TextDecoder().decode(result);

  expect(resultText).toBe("Hello World");
});
