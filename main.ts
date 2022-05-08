import { serve } from "https://deno.land/std@0.137.0/http/server.ts";
import { TensorFlow, Canvas, PNG } from "./deps.ts";
import { getModel } from "./model.ts";

// Setup Model
const model = await getModel();

serve(async (req) => {
  const url = req.url.replace(new URL(req.url).origin + "/", "");
  try {
    const res = await fetch(url);
    const data = new Uint8Array(await res.arrayBuffer());
    const image = PNG.decode(data);
    console.log(image);

    // // Only support RGB(A) images since that's what the neural net is trained on
    // if (![PNG.ColorType.RGB, PNG.ColorType.RGBA].includes(image.colorType))
    //   return new Response("Only RGB(A) images are supported", { status: 400 });

    const tensor = TensorFlow.browser
      .fromPixels({
        data: image.image,
        width: image.width,
        height: image.height,
      })
      .resizeBilinear([224, 224])
      .reshape([1, 224, 224, 3]);

    const prediction = model.predict(tensor);
    const predictionData = await prediction.data();
    const ok = predictionData[0];
    const notOk = predictionData[1];

    return new Response(JSON.stringify({ ok, notOk }));
  } catch (err) {
    return new Response(`something went wrong (${err})`, { status: 500 });
  }
}).then(() => console.log("Listening on port 8000"));
