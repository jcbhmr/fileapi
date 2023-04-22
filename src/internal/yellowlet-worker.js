import { pEvent } from "p-event";

function isTransferable(o) {
  return (
    o instanceof ArrayBuffer ||
    o instanceof MessagePort ||
    o instanceof ReadableStream ||
    o instanceof WritableStream ||
    o instanceof TransformStream ||
    // @ts-ignore
    (typeof AudioData !== "undefined" && o instanceof AudioData) ||
    (typeof ImageBitmap !== "undefined" && o instanceof ImageBitmap) ||
    // @ts-ignore
    (typeof VideoFrame !== "undefined" && o instanceof VideoFrame) ||
    (typeof OffscreenCanvas !== "undefined" && o instanceof OffscreenCanvas) ||
    (typeof RTCDataChannel !== "undefined" && o instanceof RTCDataChannel)
  );
}

const { fEval, port, signalSharedBuffer } = await pEvent(
  globalThis,
  "message",
  (e) => e.data?.type === "open"
);
const f = (0, eval)(fEval);
const signal = new Int32Array(signalSharedBuffer);

port.addEventListener("message", ({ data }) => {
  if (data?.type === "call") {
    const { arguments: args } = data;

    f(...args)
      .then((value) => {
        port.postMessage(
          { type: "fulfilled", value },
          isTransferable(value) ? [value] : undefined
        );
        signal[0] = 1;
        Atomics.notify(signal, 0);
      })
      .catch((reason) => {
        port.postMessage(
          { type: "rejected", reason },
          isTransferable(reason) ? [reason] : undefined
        );
        signal[0] = 1;
        Atomics.notify(signal, 0);
      });
  }
});

port.start();
