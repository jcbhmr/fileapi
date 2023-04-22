import Worker, { isTransferable } from "./Worker.ts";
import { receiveMessageOnPort } from "node:worker_threads";
import { fileURLToPath } from "node:url";

const workerPath = fileURLToPath(
  new URL("yellowlet-worker.js", import.meta.url)
);

function yellowlet<T extends any[], U>(
  f: (...args: T) => U
): (...args: T) => Awaited<U> {
  const worker = new Worker(workerPath);
  const { port1: port, port2: remotePort } = new MessageChannel();
  const signalSharedBuffer = new SharedArrayBuffer(4);
  const signal = new Int32Array(signalSharedBuffer);

  worker.postMessage(
    {
      type: "open",
      fEval: "" + f,
      port: remotePort,
      signalSharedBuffer,
    },
    [remotePort]
  );
  port.start();
  // @ts-ignore
  worker[Symbol.for("worker")]?.unref();

  return (...args: T): Awaited<U> => {
    signal[0] = 0;
    port.postMessage(
      { type: "call", arguments: args },
      args.filter(isTransferable)
    );

    Atomics.wait(signal, 0, 0);
    signal[0] = 0;

    // @ts-ignore
    const { message } = receiveMessageOnPort(port);
    const { data } = message;
    if (data?.type === "rejected") {
      throw data.reason;
    } else if (data?.type === "fulfilled") {
      return data.value;
    } else {
      throw new DOMException("Unknown message type", "DataCloneError");
    }
  };
}

export default yellowlet;
