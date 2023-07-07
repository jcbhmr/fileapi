export default function supportsSharedArrayBufferAndAtomicsWait(): boolean {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 1);
  } catch {
    return false;
  }
  return true;
}
