import { a as e, c as t, s as n } from "./scanforgePreprocess-CNxlx2Ol.mjs";
//#region src/runtime/browserWorker.ts
var r = new n();
e(r), self.onmessage = async (e) => {
	let n = await t(r, e.data);
	self.postMessage(n);
};
//#endregion
