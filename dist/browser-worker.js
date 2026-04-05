import { r, e as t, R as o } from "./taskProtocol-BJL-xt0L.mjs";
const s = new o();
r(s);
self.onmessage = async (e) => {
  const a = await t(s, e.data);
  self.postMessage(a);
};
