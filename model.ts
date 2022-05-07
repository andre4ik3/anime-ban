import { TensorFlow } from "./deps.ts";

const MODEL =
  "https://raw.githubusercontent.com/andre4ik3/anime-ban/master/model";

// For compatibility, use custom http handler and enable local storage
const http = TensorFlow.io.http(`${MODEL}/model.json`, { fetchFunc: fetch });
TensorFlow.env().set("IS_BROWSER", true);

export async function getModel() {
  if (localStorage.getItem("model") !== null) {
    return await TensorFlow.loadLayersModel("localstorage://model");
  } else {
    const model = await TensorFlow.loadLayersModel(http);
    await model.save("localstorage://model");
    return model;
  }
}
