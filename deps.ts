import * as TensorFlow from "https://cdn.skypack.dev/@tensorflow/tfjs@v3.16.0?dts";
export * as PNG from "https://deno.land/x/pngs@0.1.1/mod.ts";

// TensorFlow backends
if ("GPU" in window) {
  await import("https://cdn.skypack.dev/@tensorflow/tfjs-backend-webgpu");
  await TensorFlow.setBackend("webgpu");
  await TensorFlow.ready();
} else {
  /* someday this will work...
    await import("https://cdn.skypack.dev/@tensorflow/tfjs-backend-wasm");
    await TensorFlow.setBackend("wasm");
    await TensorFlow.ready();
  */
}

export { TensorFlow };
