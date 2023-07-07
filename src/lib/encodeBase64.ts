export default function encodeBase64(source: BufferSource | string): string {
  const bytes =
    typeof source === "string"
      ? new TextEncoder().encode(source)
      : ArrayBuffer.isView(source)
      ? source instanceof Uint8Array
        ? source
        : new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
      : new Uint8Array(source);

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let s = "";
  const remainder = bytes.byteLength % 3;
  const length = bytes.byteLength - remainder;
  for (var i = 0; i < length; i += 3) {
    const chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    const a = (chunk & 16515072) >> 18;
    const b = (chunk & 258048) >> 12;
    const c = (chunk & 4032) >> 6;
    const d = chunk & 63;
    s += alphabet[a] + alphabet[b] + alphabet[c] + alphabet[d];
  }
  if (remainder === 1) {
    const chunk = bytes[length];
    const a = (chunk & 252) >> 2;
    const b = (chunk & 3) << 4;
    s += alphabet[a] + alphabet[b] + "==";
  } else if (remainder === 2) {
    const chunk = (bytes[length] << 8) | bytes[length + 1];
    const a = (chunk & 64512) >> 10;
    const b = (chunk & 1008) >> 4;
    const c = (chunk & 15) << 2;
    s += alphabet[a] + alphabet[b] + alphabet[c] + "=";
  }
  return s;
}
