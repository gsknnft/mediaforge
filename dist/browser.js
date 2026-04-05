import { W as de, C as Ie } from "./index-Bvami7lw.mjs";
import { B as ot, a as ct, N as lt, P as ht, b as dt, c as gt, S as ut, T as mt, V as pt, d as ft, e as wt } from "./index-Bvami7lw.mjs";
import { R as vt, S as Et, a as Pt, b as Ct, g as xt, r as St, s as bt } from "./taskProtocol-BJL-xt0L.mjs";
function Ae() {
  if (typeof globalThis > "u") return;
  const w = globalThis.importMeta;
  return w?.env ? w : globalThis.import_meta;
}
const ze = Ae()?.env ?? {};
function U(w, e = "") {
  const t = ze[w];
  if (typeof t == "string") return t;
  if (typeof process < "u") {
    const a = process?.env?.[w];
    if (typeof a == "string") return a;
  }
  return e;
}
function Me() {
  const w = U("MODE", "");
  if (w) return w;
  const e = typeof process < "u" ? process.env?.NODE_ENV : "";
  return typeof e == "string" ? e : "";
}
function Be() {
  const w = Ae();
  return typeof w?.env?.DEV == "boolean" ? w.env.DEV : typeof w?.DEV == "boolean" ? w.DEV : Me() === "development";
}
const Fe = Me() || "development", _e = Be(), R = {
  baseUrl: _e ? "http://localhost:3000/api" : "/api",
  endpoints: {
    backgrounds: "/assets/backgrounds",
    overlays: "/assets/overlays",
    metadata: "/assets/metadata",
    validate: "/assets/validate",
    categories: "/assets/categories"
  },
  headers: {
    "Content-Type": "application/json",
    "X-Asset-Version": "1.0"
  }
}, He = {
  development: {
    apiUrl: "",
    // Empty string will use relative URLs in development
    assetUrl: "/_assets",
    cacheDuration: 3e5
  },
  staging: {
    apiUrl: U("NEXT_PUBLIC_API_URL", "http://localhost:3000"),
    assetUrl: U("NEXT_PUBLIC_ASSET_URL", "http://localhost:3000/_assets"),
    cacheDuration: 18e5
  },
  production: {
    apiUrl: U("NEXT_PUBLIC_API_URL", "https://api.sigilnet.com"),
    assetUrl: U("NEXT_PUBLIC_ASSET_URL", "https://cdn.sigilnet.com/assets"),
    cacheDuration: 36e5
  }
}, N = _e ? "/assets" : "/api/_assets", C = {
  backgrounds: {
    animated: `${N}/backgrounds/animated`,
    static: `${N}/backgrounds/static`,
    pixel: `${N}/backgrounds/pixel`
  },
  overlays: {
    head: `${N}/overlays/head`,
    clothes: `${N}/overlays/clothes`
  }
}, $e = {
  defaultDuration: 3600
}, X = {
  defaultTimeout: 3e4,
  maxRetries: 3,
  retryDelay: 1e3,
  defaultPriority: "medium",
  chunkSize: 1024 * 1024,
  // 1MB
  maxConcurrentLoads: 5,
  cacheDuration: $e.defaultDuration
}, ie = {
  getAsset: (w) => `${R.baseUrl}/assets/${w}`,
  getMetadata: (w) => `${R.baseUrl}/assets/metadata/${w}`,
  validateAsset: (w) => `${R.baseUrl}/assets/validate/${w}`,
  getBackgrounds: (w) => `${R.baseUrl}${R.endpoints.backgrounds}${w ? `?category=${w}` : ""}`,
  getOverlays: (w) => `${R.baseUrl}${R.endpoints.overlays}${w ? `?category=${w}` : ""}`
};
class S {
  static cache;
  static environment;
  static loadingQueue;
  constructor(e = Fe) {
    S.cache = /* @__PURE__ */ new Map(), S.environment = e, S.loadingQueue = /* @__PURE__ */ new Set();
  }
  static createAssetError(e, t, a) {
    return {
      name: "AssetError",
      message: e,
      code: a,
      context: {
        assetId: t,
        environment: S.environment,
        attempt: 0,
        timestamp: Date.now()
      }
    };
  }
  static async load(e, t, a = {}) {
    const r = `${t.id}-${t.version}-${S.environment}`;
    if (He[S.environment], a.cache !== !1) {
      const s = S.getCachedAsset(r, t);
      if (s) return s;
    }
    if (S.loadingQueue.has(r))
      throw S.createAssetError(
        "Asset is already being loaded",
        t.id,
        "ASSET_LOADING_DUPLICATE"
      );
    S.loadingQueue.add(r);
    try {
      const s = e || t.cdnUrl || t.url, n = await S.fetchWithRetry(s, t, a), o = Buffer.from(await n.arrayBuffer());
      return S.cache.set(r, {
        data: o,
        metadata: {
          ...t,
          lastModified: Date.now()
        }
      }), o;
    } finally {
      S.loadingQueue.delete(r);
    }
  }
  static async fetchWithRetry(e, t, a) {
    const r = a.retries ?? X.maxRetries;
    let s = 0;
    for (; s < r; )
      try {
        const n = await fetch(e, {
          headers: {
            "If-None-Match": t.etag,
            "If-Modified-Since": new Date(t.lastModified).toUTCString()
          },
          signal: AbortSignal.timeout(a.timeout || X.defaultTimeout)
        });
        if (n.ok) return n;
        throw S.createAssetError(
          `Failed to load asset: ${n.statusText}`,
          t.id,
          `HTTP_${n.status}`
        );
      } catch (n) {
        if (s++, s === r) throw n;
        await new Promise((o) => setTimeout(o, X.retryDelay));
      }
    throw S.createAssetError(
      "Max retries exceeded",
      t.id,
      "MAX_RETRIES_EXCEEDED"
    );
  }
  static getCachedAsset(e, t) {
    const a = S.cache.get(e);
    return a ? Date.now() - a.metadata.lastModified > X.cacheDuration ? (S.cache.delete(e), null) : a.data : null;
  }
  static clearCache() {
    S.cache.clear();
  }
}
const at = new S();
function I(w) {
  return w ? typeof w == "string" ? new Date(w).getTime() : w.getTime() : Date.now();
}
I();
const ne = {
  "OG Fire": {
    id: "og-fire",
    name: "OG Fire Background",
    url: `${C.backgrounds.animated}/bg.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "bg.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["fire", "action", "original"],
    access: "public",
    etag: "",
    lastModified: I(),
    category: "backgrounds",
    validation: {
      isValid: !0,
      message: "",
      maxSize: 15 * 1024 * 1024,
      // 15MB for GIFs
      allowedFormats: ["gif"],
      allowCompression: !0
    }
  },
  Fire: {
    id: "fire",
    name: "Fire Background",
    url: `${C.backgrounds.animated}/bg2.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "bg2.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["fire", "action", "flame"],
    access: "public",
    etag: "",
    lastModified: I(),
    category: "backgrounds",
    validation: {
      isValid: !0,
      message: "",
      maxSize: 15 * 1024 * 1024,
      allowedFormats: ["gif"],
      allowCompression: !0
    }
  },
  Winter: {
    id: "winter",
    name: "Winter Background",
    url: `${C.backgrounds.animated}/winter_bg.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "winter_bg.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["winter", "snow", "cold"],
    access: "public",
    etag: "",
    lastModified: I(),
    category: "backgrounds",
    validation: {
      isValid: !0,
      message: "",
      maxSize: 20 * 1024 * 1024,
      allowedFormats: ["gif"],
      allowCompression: !0
    }
  },
  Garage: {
    name: "Garage Background",
    url: `${C.backgrounds.static}/garage.png`,
    format: "png",
    type: "background",
    bgCategory: "Static",
    fileName: "garage.png",
    path: C.backgrounds.static,
    version: "1.0",
    tags: ["home", "workshop"],
    access: "public",
    etag: "",
    lastModified: I(/* @__PURE__ */ new Date()),
    hash: "",
    id: "garage",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["png"], allowCompression: !0 }
  },
  "Snowy Background": {
    name: "Snowy Background",
    url: `${C.backgrounds.static}/snowy_bg.jpg`,
    format: "jpg",
    type: "background",
    bgCategory: "Static",
    fileName: "snowy_bg.jpg",
    path: C.backgrounds.static,
    version: "1.0",
    tags: ["winter", "peaceful"],
    access: "public",
    etag: "",
    lastModified: I(/* @__PURE__ */ new Date()),
    id: "snowy",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["jpg"], allowCompression: !0 }
  },
  "Backyard Background": {
    name: "Backyard Background",
    url: `${C.backgrounds.pixel}/backyardpxl.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Pixel Art",
    fileName: "backyardpxl.gif",
    path: C.backgrounds.pixel,
    version: "1.0",
    tags: ["outdoor", "nature"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "backyard",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  },
  "Path Background": {
    name: "Path Background",
    url: `${C.backgrounds.pixel}/pixel_kawai_bg.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Pixel Art",
    fileName: "pixel_kawai_bg.gif",
    path: C.backgrounds.pixel,
    version: "1.0",
    tags: ["trail", "kawaii"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "path",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  },
  "Xmas Pixel Background": {
    name: "Xmas Pixell Background",
    url: `${C.backgrounds.pixel}/xmas_pixel_bg.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Pixel Art",
    fileName: "xmas_pixel_bg.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["snow", "cold"],
    access: "public",
    etag: "",
    lastModified: I(/* @__PURE__ */ new Date()),
    id: "xmas-pixel",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  },
  Gold: {
    name: "Gold Background",
    url: `${C.backgrounds.animated}/gold.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "gold.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["gold", "shiny"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "gold",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 },
    allowedTokenIds: [1]
  },
  "Retro Sunset": {
    name: "Retro Sunset Background",
    url: `${C.backgrounds.animated}/retro_sun.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "retro_sun.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["sunset", "retro"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "retro-sunset",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  },
  "Retro Sunset SideScroll": {
    name: "Retro Sunset SideScroll Background",
    url: `${C.backgrounds.animated}/retro_sun_ss.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Animated",
    fileName: "retro_sun_ss.gif",
    path: C.backgrounds.animated,
    version: "1.0",
    tags: ["sunset", "retro", "scroll"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "retro-sunset-ss",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  },
  "Pixel Night": {
    name: "Pixel Night Background",
    url: `${C.backgrounds.pixel}/pixel_night_bg.gif`,
    format: "gif",
    type: "background",
    bgCategory: "Pixel Art",
    fileName: "pixel_night_bg.gif",
    path: C.backgrounds.pixel,
    version: "1.0",
    tags: ["night", "dark"],
    access: "public",
    etag: "",
    lastModified: I(),
    id: "pixel-night",
    category: "backgrounds",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["gif"], allowCompression: !0 }
  }
}, oe = {
  "Santa Hat": {
    id: "santa-hat",
    name: "Santa Hat",
    url: `${C.overlays.head}/SantaHat.png`,
    format: "png",
    type: "overlay",
    overlayCategory: "Head",
    attribute: "Head",
    fileName: "SantaHat.png",
    path: C.overlays.head,
    version: "1.0",
    category: "overlays",
    disAllowedTraits: {
      Head: ["Santa Hat", "Beer Hat", "Bed Head", "Bucket Hat", "Hardhat", "Chef Hat", "Hockey Helmet"]
    },
    traits: {
      Head: ["Santa Hat"]
    },
    tags: ["holiday", "christmas", "winter"],
    access: "public",
    etag: "",
    lastModified: I(),
    validation: {
      isValid: !0,
      message: "",
      maxSize: 5 * 1024 * 1024,
      // 5MB for PNGs
      allowedFormats: ["png", "webp"],
      allowCompression: !0
    }
  },
  "Xmas Sweater": {
    id: "xmas-sweater",
    name: "Xmas Sweater",
    url: `${C.overlays.clothes}/XMas_Sweater.png`,
    format: "png",
    type: "overlay",
    overlayCategory: "Clothes",
    attribute: "Clothes",
    fileName: "XMas_Sweater.png",
    path: C.overlays.clothes,
    version: "1.0",
    category: "overlays",
    disAllowedTraits: {
      Clothes: ["Baby Carlos", "DadBod", "Xmas Sweater", "Holiday Sweater", "#1 Dad Hoodie"]
    },
    traits: {
      Clothes: ["Xmas Sweater"]
    },
    tags: ["holiday", "christmas", "winter"],
    access: "public",
    etag: "",
    lastModified: I(),
    validation: {
      isValid: !0,
      message: "",
      maxSize: 5 * 1024 * 1024,
      allowedFormats: ["png", "webp"],
      allowCompression: !0
    }
  },
  "Holiday Sweater": {
    id: "holiday-sweater",
    name: "Holiday Sweater",
    path: C.overlays.clothes,
    url: `${C.overlays.clothes}/Holiday_Sweater.png`,
    format: "png",
    category: "overlays",
    type: "overlay",
    overlayCategory: "Clothes",
    attribute: "Clothes",
    fileName: "Holiday_Sweater.png",
    version: "1.0",
    disAllowedTraits: {
      Clothes: ["XMas Sweater", "Holiday Sweater", "#1 Dad Hoodie", "Baby Carlos", "DadBod"]
    },
    traits: {
      Clothes: ["Holiday Sweater"]
    },
    tags: ["holiday", "christmas"],
    access: "public",
    etag: "",
    lastModified: I()
  },
  "#1 Dad Hoodie": {
    name: "#1 Dad Hoodie",
    path: C.overlays.clothes,
    url: `${C.overlays.clothes}/DadHoodie.png`,
    format: "png",
    type: "overlay",
    overlayCategory: "Clothes",
    attribute: "Clothes",
    fileName: "DadHoodie.png",
    version: "1.0",
    disAllowedTraits: {
      Clothes: ["T-Shirt", "Hoodie", "Jacket", "Sweater"]
    },
    traits: {
      Clothes: ["#1 Dad Hoodie"]
    },
    tags: ["dad", "father"],
    access: "public",
    etag: "",
    lastModified: I(),
    hash: "",
    id: "dad-hoodie",
    category: "overlays",
    validation: { isValid: !0, message: "", maxSize: 5242880, allowedFormats: ["png", "jpg", "jpg", "gif"], allowCompression: !0 }
  }
};
class ge {
  static instance;
  backgroundCache;
  overlayCache;
  environment;
  fetchPromises;
  initializedFromRegistry = !1;
  constructor() {
    this.backgroundCache = new Map(Object.entries(ne)), this.overlayCache = new Map(Object.entries(oe)), this.environment = Fe, this.fetchPromises = /* @__PURE__ */ new Map(), this.fetchUpdates(), this.initializeFromRegistry();
  }
  initializeFromRegistry() {
    this.initializedFromRegistry || (Object.values(ne).forEach((e) => {
      const t = this.getAssetId(e);
      this.backgroundCache.set(t, { ...e, source: "registry" });
    }), Object.values(oe).forEach((e) => {
      const t = this.getAssetId(e);
      this.overlayCache.set(t, { ...e, source: "registry" });
    }), this.initializedFromRegistry = !0, console.log("📦 Initialized from registry:", {
      backgrounds: this.backgroundCache.size,
      overlays: this.overlayCache.size
    }));
  }
  async getAssets() {
    return {
      backgrounds: Array.from(this.backgroundCache.values()),
      overlays: Array.from(this.overlayCache.values())
    };
  }
  getAssetId(e) {
    const t = globalThis?.importMeta?.env?.DEV ? "http://localhost:3000" : "https://apefathers.com", a = e.id || `${e.type}-${e.name.toLowerCase().replace(/\s+/g, "-")}`, r = new URL(e.url, t).pathname;
    return `${a}-${r}`;
  }
  async fetchUpdates() {
    if (this.backgroundCache.size > 0 && this.overlayCache.size > 0) {
      console.log("🚀 Cache already populated, skipping fetch.");
      return;
    }
    console.log("🔄 Fetching new asset updates...");
    const [e, t] = await Promise.all([
      this.fetchBackgrounds(),
      this.fetchOverlays()
    ]);
    e.forEach((a) => this.backgroundCache.set(this.getAssetId(a), a)), t.forEach((a) => this.overlayCache.set(this.getAssetId(a), a));
  }
  async fetchBackgrounds() {
    try {
      console.log("📊 Environment:", this.environment), console.log("💾 Cache size:", this.backgroundCache.size);
      const e = ie.getBackgrounds();
      console.log("🔍 Fetching backgrounds from:", e);
      const t = await this.fetchWithCache(
        e,
        () => this.fetchWithTimeout(e, {
          headers: {
            ...R.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
      const r = (await t.json()).filter((s) => {
        const n = this.getAssetId(s);
        return !this.backgroundCache.has(n) || s.lastModified > (this.backgroundCache.get(n)?.lastModified || 0);
      });
      return console.log("✅ Unique backgrounds:", r.length), r;
    } catch (e) {
      return console.warn("⚠️ Background update failed:", e), [];
    }
  }
  async fetchOverlays() {
    try {
      console.log("📊 Environment:", this.environment), console.log("💾 Cache size:", this.overlayCache.size);
      const e = ie.getOverlays();
      console.log("🔍 Fetching overlays from:", e);
      const t = await this.fetchWithCache(
        e,
        () => this.fetchWithTimeout(e, {
          headers: {
            ...R.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!t.ok) throw new Error(`HTTP error! status: ${t.status}`);
      const a = await t.json();
      console.log("✅ Fetched overlays:", a.length);
      const r = a.filter((s) => !Array.from(this.overlayCache.values()).find((o) => o.url === s.url));
      return console.log("✅ Unique overlays:", r.length), r;
    } catch (e) {
      return console.warn("⚠️ Overlay update failed:", e), [];
    }
  }
  static getInstance() {
    return this.instance || (this.instance = new ge()), this.instance;
  }
  async getAllBackgrounds() {
    const e = /* @__PURE__ */ new Map();
    return Array.from(this.backgroundCache.values()).forEach((t) => {
      const a = this.getAssetId(t);
      (!e.has(a) || t.source === "api") && e.set(a, t);
    }), Array.from(e.values()).sort((t, a) => t.name.localeCompare(a.name));
  }
  async getAllOverlays() {
    const e = /* @__PURE__ */ new Map();
    return Array.from(this.overlayCache.values()).forEach((t) => {
      const a = this.getAssetId(t);
      (!e.has(a) || t.source === "api") && e.set(a, t);
    }), Array.from(e.values()).sort((t, a) => t.name.localeCompare(a.name));
  }
  async fetchWithCache(e, t) {
    if (this.fetchPromises.has(e))
      return console.log(`⏳ Returning in-flight request for ${e}`), this.fetchPromises.get(e);
    const a = t().finally(() => this.fetchPromises.delete(e));
    return this.fetchPromises.set(e, a), a;
  }
  async fetchAssetMetadata(e) {
    try {
      const t = await this.fetchWithCache(
        e,
        () => fetch(ie.getMetadata(e), {
          headers: {
            ...R.headers,
            "X-Asset-Environment": this.environment
          }
        })
      );
      if (!t.ok)
        throw new Error(`Failed to fetch asset metadata: ${t.statusText}`);
      return await t.json();
    } catch (t) {
      throw console.error("Error fetching asset metadata:", t), t;
    }
  }
  async fetchWithTimeout(e, t, a = 3e4) {
    const r = new AbortController(), s = setTimeout(() => {
      console.log(`⌛ Request timeout for ${e}`), r.abort();
    }, a);
    try {
      const n = await fetch(e, {
        ...t,
        signal: r.signal,
        headers: {
          ...t.headers,
          "Cache-Control": "no-cache",
          Pragma: "no-cache"
        }
      });
      return clearTimeout(s), n;
    } catch (n) {
      throw n instanceof Error && n.name === "AbortError" && console.warn(`⚠️ Request aborted for ${e} after ${a}ms`), n;
    } finally {
      clearTimeout(s);
    }
  }
  async getBackground(e) {
    const t = this.backgroundCache.get(e);
    if (t) return t;
    try {
      const a = await this.fetchAssetMetadata(e);
      if (this.isBackgroundAsset(a))
        return this.backgroundCache.set(e, a), a;
    } catch (a) {
      console.error(`Error fetching background ${e}:`, a);
    }
    return ne[e];
  }
  async getOverlay(e) {
    const t = this.overlayCache.get(e);
    if (t) return t;
    try {
      const a = await this.fetchAssetMetadata(e);
      if (this.isOverlayAsset(a))
        return this.overlayCache.set(e, a), a;
    } catch (a) {
      console.error(`Error fetching overlay ${e}:`, a);
    }
    return oe[e];
  }
  async getBackgroundsByCategory(e) {
    const t = await this.getAllBackgrounds();
    return t.length ? (console.log(`✅ Using cached backgrounds for category: ${e}`), t.filter((a) => a.bgCategory === e)) : (console.log(`🔍 Fetching backgrounds for category: ${e}`), (await this.getAllBackgrounds()).filter((a) => a.bgCategory === e));
  }
  async getOverlaysByCategory(e) {
    const t = await this.getAllOverlays();
    return t.length ? (console.log(`✅ Using cached backgrounds for category: ${e}`), t.filter((a) => a.overlayCategory === e)) : (console.log(`🔍 Fetching backgrounds for category: ${e}`), (await this.getAllOverlays()).filter((a) => a.overlayCategory === e));
  }
  isBackgroundAsset(e) {
    return e && e.type === "background" && "bgCategory" in e;
  }
  isOverlayAsset(e) {
    return e && e.type === "overlay" && "overlayCategory" in e;
  }
  clearCache() {
    this.backgroundCache.clear(), this.overlayCache.clear();
  }
}
const rt = ge.getInstance();
function We(w) {
  return w && w.__esModule && Object.prototype.hasOwnProperty.call(w, "default") ? w.default : w;
}
var j = { exports: {} }, Ne = j.exports, we;
function Le() {
  return we || (we = 1, (function(w, e) {
    (function(t, a) {
      w.exports = a();
    })(Ne, function() {
      return (function(t) {
        function a(s) {
          if (r[s]) return r[s].exports;
          var n = r[s] = { exports: {}, id: s, loaded: !1 };
          return t[s].call(n.exports, n, n.exports, a), n.loaded = !0, n.exports;
        }
        var r = {};
        return a.m = t, a.c = r, a.p = "", a(0);
      })([function(t, a, r) {
        var s, n, o = function(d, i) {
          function g() {
            this.constructor = d;
          }
          for (var m in i) c.call(i, m) && (d[m] = i[m]);
          return g.prototype = i.prototype, d.prototype = new g(), d.__super__ = i.prototype, d;
        }, c = {}.hasOwnProperty, l = [].indexOf || function(d) {
          for (var i = 0, g = this.length; i < g; i++) if (i in this && this[i] === d) return i;
          return -1;
        };
        s = r(1).EventEmitter, r(2), n = (function(d) {
          function i(h) {
            var u, p, f;
            this.running = !1, this.options = {}, this.frames = [], this.groups = /* @__PURE__ */ new Map(), this.freeWorkers = [], this.activeWorkers = [], this.setOptions(h);
            for (p in g) f = g[p], (u = this.options)[p] == null && (u[p] = f);
          }
          var g, m;
          return o(i, d), g = { workerScript: "gif.worker.js", workers: 2, repeat: 0, background: "#fff", quality: 10, width: null, height: null, transparent: null, debug: !1 }, m = { delay: 500, copy: !1 }, i.prototype.setOption = function(h, u) {
            if (this.options[h] = u, this._canvas != null && (h === "width" || h === "height")) return this._canvas[h] = u;
          }, i.prototype.setOptions = function(h) {
            var u, p, f;
            p = [];
            for (u in h) c.call(h, u) && (f = h[u], p.push(this.setOption(u, f)));
            return p;
          }, i.prototype.addFrame = function(h, u) {
            var p, f, v;
            u == null && (u = {}), p = {}, p.transparent = this.options.transparent;
            for (v in m) p[v] = u[v] || m[v];
            if (this.options.width == null && this.setOption("width", h.width), this.options.height == null && this.setOption("height", h.height), typeof ImageData < "u" && ImageData !== null && h instanceof ImageData) p.data = h.data;
            else if (typeof CanvasRenderingContext2D < "u" && CanvasRenderingContext2D !== null && h instanceof CanvasRenderingContext2D || typeof WebGLRenderingContext < "u" && WebGLRenderingContext !== null && h instanceof WebGLRenderingContext) u.copy ? p.data = this.getContextData(h) : p.context = h;
            else {
              if (h.childNodes == null) throw new Error("Invalid image");
              u.copy ? p.data = this.getImageData(h) : p.image = h;
            }
            return f = this.frames.length, f > 0 && p.data && (this.groups.has(p.data) ? this.groups.get(p.data).push(f) : this.groups.set(p.data, [f])), this.frames.push(p);
          }, i.prototype.render = function() {
            var h, u, p;
            if (this.running) throw new Error("Already running");
            if (this.options.width == null || this.options.height == null) throw new Error("Width and height must be set prior to rendering");
            if (this.running = !0, this.nextFrame = 0, this.finishedFrames = 0, this.imageParts = (function() {
              var f, v, E;
              for (E = [], f = 0, v = this.frames.length; 0 <= v ? f < v : f > v; 0 <= v ? ++f : --f) E.push(null);
              return E;
            }).call(this), u = this.spawnWorkers(), this.options.globalPalette === !0) this.renderNextFrame();
            else for (h = 0, p = u; 0 <= p ? h < p : h > p; 0 <= p ? ++h : --h) this.renderNextFrame();
            return this.emit("start"), this.emit("progress", 0);
          }, i.prototype.abort = function() {
            for (var h; h = this.activeWorkers.shift(), h != null; )
              this.log("killing active worker"), h.terminate();
            return this.running = !1, this.emit("abort");
          }, i.prototype.spawnWorkers = function() {
            var h, u, p;
            return h = Math.min(this.options.workers, this.frames.length), (function() {
              p = [];
              for (var f = u = this.freeWorkers.length; u <= h ? f < h : f > h; u <= h ? f++ : f--) p.push(f);
              return p;
            }).apply(this).forEach(/* @__PURE__ */ (function(f) {
              return function(v) {
                var E;
                return f.log("spawning worker " + v), E = new Worker(f.options.workerScript), E.onmessage = function(T) {
                  return f.activeWorkers.splice(f.activeWorkers.indexOf(E), 1), f.freeWorkers.push(E), f.frameFinished(T.data, !1);
                }, f.freeWorkers.push(E);
              };
            })(this)), h;
          }, i.prototype.frameFinished = function(h, u) {
            var p, f, v, E;
            if (this.finishedFrames++, u ? (p = this.frames.indexOf(h), f = this.groups.get(h.data)[0], this.log("frame " + (p + 1) + " is duplicate of " + f + " - " + this.activeWorkers.length + " active"), this.imageParts[p] = { indexOfFirstInGroup: f }) : (this.log("frame " + (h.index + 1) + " finished - " + this.activeWorkers.length + " active"), this.emit("progress", this.finishedFrames / this.frames.length), this.imageParts[h.index] = h), this.options.globalPalette === !0 && !u && (this.options.globalPalette = h.globalPalette, this.log("global palette analyzed"), this.frames.length > 2)) for (v = 1, E = this.freeWorkers.length; 1 <= E ? v < E : v > E; 1 <= E ? ++v : --v) this.renderNextFrame();
            return l.call(this.imageParts, null) >= 0 ? this.renderNextFrame() : this.finishRendering();
          }, i.prototype.finishRendering = function() {
            var h, u, p, f, v, E, T, k, M, A, F, _, B, z, ee, fe, te, ae, re, se;
            for (te = this.imageParts, v = E = 0, A = te.length; E < A; v = ++E) u = te[v], u.indexOfFirstInGroup && (this.imageParts[v] = this.imageParts[u.indexOfFirstInGroup]);
            for (M = 0, ae = this.imageParts, T = 0, F = ae.length; T < F; T++) u = ae[T], M += (u.data.length - 1) * u.pageSize + u.cursor;
            for (M += u.pageSize - u.cursor, this.log("rendering finished - filesize " + Math.round(M / 1e3) + "kb"), h = new Uint8Array(M), ee = 0, re = this.imageParts, k = 0, _ = re.length; k < _; k++) for (u = re[k], se = u.data, p = z = 0, B = se.length; z < B; p = ++z) fe = se[p], h.set(fe, ee), ee += p === u.data.length - 1 ? u.cursor : u.pageSize;
            return f = new Blob([h], { type: "image/gif" }), this.emit("finished", f, h);
          }, i.prototype.renderNextFrame = function() {
            var h, u, p, f;
            if (this.freeWorkers.length === 0) throw new Error("No free workers");
            if (!(this.nextFrame >= this.frames.length)) return h = this.frames[this.nextFrame++], u = this.frames.indexOf(h), u > 0 && this.groups.has(h.data) && this.groups.get(h.data)[0] !== u ? void setTimeout(/* @__PURE__ */ (function(v) {
              return function() {
                return v.frameFinished(h, !0);
              };
            })(this), 0) : (f = this.freeWorkers.shift(), p = this.getTask(h), this.log("starting frame " + (p.index + 1) + " of " + this.frames.length), this.activeWorkers.push(f), f.postMessage(p));
          }, i.prototype.getContextData = function(h) {
            return h.getImageData(0, 0, this.options.width, this.options.height).data;
          }, i.prototype.getImageData = function(h) {
            var u;
            return this._canvas == null && (this._canvas = document.createElement("canvas"), this._canvas.width = this.options.width, this._canvas.height = this.options.height), u = this._canvas.getContext("2d"), u.setFill = this.options.background, u.fillRect(0, 0, this.options.width, this.options.height), u.drawImage(h, 0, 0), this.getContextData(u);
          }, i.prototype.getTask = function(h) {
            var u, p;
            if (u = this.frames.indexOf(h), p = { index: u, last: u === this.frames.length - 1, delay: h.delay, transparent: h.transparent, width: this.options.width, height: this.options.height, quality: this.options.quality, dither: this.options.dither, globalPalette: this.options.globalPalette, repeat: this.options.repeat, canTransfer: !0 }, h.data != null) p.data = h.data;
            else if (h.context != null) p.data = this.getContextData(h.context);
            else {
              if (h.image == null) throw new Error("Invalid frame");
              p.data = this.getImageData(h.image);
            }
            return p;
          }, i.prototype.log = function(h) {
            if (this.options.debug) return console.log(h);
          }, i;
        })(s), t.exports = n;
      }, function(t, a) {
        function r() {
          this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0;
        }
        function s(l) {
          return typeof l == "function";
        }
        function n(l) {
          return typeof l == "number";
        }
        function o(l) {
          return typeof l == "object" && l !== null;
        }
        function c(l) {
          return l === void 0;
        }
        t.exports = r, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._maxListeners = void 0, r.defaultMaxListeners = 10, r.prototype.setMaxListeners = function(l) {
          if (!n(l) || l < 0 || isNaN(l)) throw TypeError("n must be a positive number");
          return this._maxListeners = l, this;
        }, r.prototype.emit = function(l) {
          var d, i, g, m, h, u;
          if (this._events || (this._events = {}), l === "error" && (!this._events.error || o(this._events.error) && !this._events.error.length)) {
            if (d = arguments[1], d instanceof Error) throw d;
            var p = new Error('Uncaught, unspecified "error" event. (' + d + ")");
            throw p.context = d, p;
          }
          if (i = this._events[l], c(i)) return !1;
          if (s(i)) switch (arguments.length) {
            case 1:
              i.call(this);
              break;
            case 2:
              i.call(this, arguments[1]);
              break;
            case 3:
              i.call(this, arguments[1], arguments[2]);
              break;
            default:
              m = Array.prototype.slice.call(arguments, 1), i.apply(this, m);
          }
          else if (o(i)) for (m = Array.prototype.slice.call(arguments, 1), u = i.slice(), g = u.length, h = 0; h < g; h++) u[h].apply(this, m);
          return !0;
        }, r.prototype.addListener = function(l, d) {
          var i;
          if (!s(d)) throw TypeError("listener must be a function");
          return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", l, s(d.listener) ? d.listener : d), this._events[l] ? o(this._events[l]) ? this._events[l].push(d) : this._events[l] = [this._events[l], d] : this._events[l] = d, o(this._events[l]) && !this._events[l].warned && (i = c(this._maxListeners) ? r.defaultMaxListeners : this._maxListeners, i && i > 0 && this._events[l].length > i && (this._events[l].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[l].length), typeof console.trace == "function" && console.trace())), this;
        }, r.prototype.on = r.prototype.addListener, r.prototype.once = function(l, d) {
          function i() {
            this.removeListener(l, i), g || (g = !0, d.apply(this, arguments));
          }
          if (!s(d)) throw TypeError("listener must be a function");
          var g = !1;
          return i.listener = d, this.on(l, i), this;
        }, r.prototype.removeListener = function(l, d) {
          var i, g, m, h;
          if (!s(d)) throw TypeError("listener must be a function");
          if (!this._events || !this._events[l]) return this;
          if (i = this._events[l], m = i.length, g = -1, i === d || s(i.listener) && i.listener === d) delete this._events[l], this._events.removeListener && this.emit("removeListener", l, d);
          else if (o(i)) {
            for (h = m; h-- > 0; ) if (i[h] === d || i[h].listener && i[h].listener === d) {
              g = h;
              break;
            }
            if (g < 0) return this;
            i.length === 1 ? (i.length = 0, delete this._events[l]) : i.splice(g, 1), this._events.removeListener && this.emit("removeListener", l, d);
          }
          return this;
        }, r.prototype.removeAllListeners = function(l) {
          var d, i;
          if (!this._events) return this;
          if (!this._events.removeListener) return arguments.length === 0 ? this._events = {} : this._events[l] && delete this._events[l], this;
          if (arguments.length === 0) {
            for (d in this._events) d !== "removeListener" && this.removeAllListeners(d);
            return this.removeAllListeners("removeListener"), this._events = {}, this;
          }
          if (i = this._events[l], s(i)) this.removeListener(l, i);
          else if (i) for (; i.length; ) this.removeListener(l, i[i.length - 1]);
          return delete this._events[l], this;
        }, r.prototype.listeners = function(l) {
          return this._events && this._events[l] ? s(this._events[l]) ? [this._events[l]] : this._events[l].slice() : [];
        }, r.prototype.listenerCount = function(l) {
          if (this._events) {
            var d = this._events[l];
            if (s(d)) return 1;
            if (d) return d.length;
          }
          return 0;
        }, r.listenerCount = function(l, d) {
          return l.listenerCount(d);
        };
      }, function(t, a) {
        var r, s, n, o, c;
        c = navigator.userAgent.toLowerCase(), o = navigator.platform.toLowerCase(), r = c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, "unknown", 0], n = r[1] === "ie" && document.documentMode, s = { name: r[1] === "version" ? r[3] : r[1], version: n || parseFloat(r[1] === "opera" && r[4] ? r[4] : r[2]), platform: { name: c.match(/ip(?:ad|od|hone)/) ? "ios" : (c.match(/(?:webos|android)/) || o.match(/mac|win|linux/) || ["other"])[0] } }, s[s.name] = !0, s[s.name + parseInt(s.version, 10)] = !0, s.platform[s.platform.name] = !0, t.exports = s;
      }]);
    });
  })(j)), j.exports;
}
var qe = Le();
const ye = /* @__PURE__ */ We(qe);
var D = {}, ce = {}, O = {}, ve;
function Re() {
  if (ve) return O;
  ve = 1, Object.defineProperty(O, "__esModule", {
    value: !0
  }), O.loop = O.conditional = O.parse = void 0;
  var w = function a(r, s) {
    var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : n;
    if (Array.isArray(s))
      s.forEach(function(l) {
        return a(r, l, n, o);
      });
    else if (typeof s == "function")
      s(r, n, o, a);
    else {
      var c = Object.keys(s)[0];
      Array.isArray(s[c]) ? (o[c] = {}, a(r, s[c], n, o[c])) : o[c] = s[c](r, n, o, a);
    }
    return n;
  };
  O.parse = w;
  var e = function(r, s) {
    return function(n, o, c, l) {
      s(n, o, c) && l(n, r, o, c);
    };
  };
  O.conditional = e;
  var t = function(r, s) {
    return function(n, o, c, l) {
      for (var d = [], i = n.pos; s(n, o, c); ) {
        var g = {};
        if (l(n, r, o, g), n.pos === i)
          break;
        i = n.pos, d.push(g);
      }
      return d;
    };
  };
  return O.loop = t, O;
}
var x = {}, Ee;
function De() {
  if (Ee) return x;
  Ee = 1, Object.defineProperty(x, "__esModule", {
    value: !0
  }), x.readBits = x.readArray = x.readUnsigned = x.readString = x.peekBytes = x.readBytes = x.peekByte = x.readByte = x.buildStream = void 0;
  var w = function(i) {
    return {
      data: i,
      pos: 0
    };
  };
  x.buildStream = w;
  var e = function() {
    return function(i) {
      return i.data[i.pos++];
    };
  };
  x.readByte = e;
  var t = function() {
    var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    return function(g) {
      return g.data[g.pos + i];
    };
  };
  x.peekByte = t;
  var a = function(i) {
    return function(g) {
      return g.data.subarray(g.pos, g.pos += i);
    };
  };
  x.readBytes = a;
  var r = function(i) {
    return function(g) {
      return g.data.subarray(g.pos, g.pos + i);
    };
  };
  x.peekBytes = r;
  var s = function(i) {
    return function(g) {
      return Array.from(a(i)(g)).map(function(m) {
        return String.fromCharCode(m);
      }).join("");
    };
  };
  x.readString = s;
  var n = function(i) {
    return function(g) {
      var m = a(2)(g);
      return i ? (m[1] << 8) + m[0] : (m[0] << 8) + m[1];
    };
  };
  x.readUnsigned = n;
  var o = function(i, g) {
    return function(m, h, u) {
      for (var p = typeof g == "function" ? g(m, h, u) : g, f = a(i), v = new Array(p), E = 0; E < p; E++)
        v[E] = f(m);
      return v;
    };
  };
  x.readArray = o;
  var c = function(i, g, m) {
    for (var h = 0, u = 0; u < m; u++)
      h += i[g + u] && Math.pow(2, m - u - 1);
    return h;
  }, l = function(i) {
    return function(g) {
      for (var m = e()(g), h = new Array(8), u = 0; u < 8; u++)
        h[7 - u] = !!(m & 1 << u);
      return Object.keys(i).reduce(function(p, f) {
        var v = i[f];
        return v.length ? p[f] = c(h, v.index, v.length) : p[f] = h[v.index], p;
      }, {});
    };
  };
  return x.readBits = l, x;
}
var Pe;
function Ue() {
  return Pe || (Pe = 1, (function(w) {
    Object.defineProperty(w, "__esModule", {
      value: !0
    }), w.default = void 0;
    var e = Re(), t = De(), a = {
      blocks: function(g) {
        for (var m = 0, h = [], u = g.data.length, p = 0, f = (0, t.readByte)()(g); f !== m && f; f = (0, t.readByte)()(g)) {
          if (g.pos + f >= u) {
            var v = u - g.pos;
            h.push((0, t.readBytes)(v)(g)), p += v;
            break;
          }
          h.push((0, t.readBytes)(f)(g)), p += f;
        }
        for (var E = new Uint8Array(p), T = 0, k = 0; k < h.length; k++)
          E.set(h[k], T), T += h[k].length;
        return E;
      }
    }, r = (0, e.conditional)({
      gce: [{
        codes: (0, t.readBytes)(2)
      }, {
        byteSize: (0, t.readByte)()
      }, {
        extras: (0, t.readBits)({
          future: {
            index: 0,
            length: 3
          },
          disposal: {
            index: 3,
            length: 3
          },
          userInput: {
            index: 6
          },
          transparentColorGiven: {
            index: 7
          }
        })
      }, {
        delay: (0, t.readUnsigned)(!0)
      }, {
        transparentColorIndex: (0, t.readByte)()
      }, {
        terminator: (0, t.readByte)()
      }]
    }, function(i) {
      var g = (0, t.peekBytes)(2)(i);
      return g[0] === 33 && g[1] === 249;
    }), s = (0, e.conditional)({
      image: [{
        code: (0, t.readByte)()
      }, {
        descriptor: [{
          left: (0, t.readUnsigned)(!0)
        }, {
          top: (0, t.readUnsigned)(!0)
        }, {
          width: (0, t.readUnsigned)(!0)
        }, {
          height: (0, t.readUnsigned)(!0)
        }, {
          lct: (0, t.readBits)({
            exists: {
              index: 0
            },
            interlaced: {
              index: 1
            },
            sort: {
              index: 2
            },
            future: {
              index: 3,
              length: 2
            },
            size: {
              index: 5,
              length: 3
            }
          })
        }]
      }, (0, e.conditional)({
        lct: (0, t.readArray)(3, function(i, g, m) {
          return Math.pow(2, m.descriptor.lct.size + 1);
        })
      }, function(i, g, m) {
        return m.descriptor.lct.exists;
      }), {
        data: [{
          minCodeSize: (0, t.readByte)()
        }, a]
      }]
    }, function(i) {
      return (0, t.peekByte)()(i) === 44;
    }), n = (0, e.conditional)({
      text: [{
        codes: (0, t.readBytes)(2)
      }, {
        blockSize: (0, t.readByte)()
      }, {
        preData: function(g, m, h) {
          return (0, t.readBytes)(h.text.blockSize)(g);
        }
      }, a]
    }, function(i) {
      var g = (0, t.peekBytes)(2)(i);
      return g[0] === 33 && g[1] === 1;
    }), o = (0, e.conditional)({
      application: [{
        codes: (0, t.readBytes)(2)
      }, {
        blockSize: (0, t.readByte)()
      }, {
        id: function(g, m, h) {
          return (0, t.readString)(h.blockSize)(g);
        }
      }, a]
    }, function(i) {
      var g = (0, t.peekBytes)(2)(i);
      return g[0] === 33 && g[1] === 255;
    }), c = (0, e.conditional)({
      comment: [{
        codes: (0, t.readBytes)(2)
      }, a]
    }, function(i) {
      var g = (0, t.peekBytes)(2)(i);
      return g[0] === 33 && g[1] === 254;
    }), l = [
      {
        header: [{
          signature: (0, t.readString)(3)
        }, {
          version: (0, t.readString)(3)
        }]
      },
      {
        lsd: [{
          width: (0, t.readUnsigned)(!0)
        }, {
          height: (0, t.readUnsigned)(!0)
        }, {
          gct: (0, t.readBits)({
            exists: {
              index: 0
            },
            resolution: {
              index: 1,
              length: 3
            },
            sort: {
              index: 4
            },
            size: {
              index: 5,
              length: 3
            }
          })
        }, {
          backgroundColorIndex: (0, t.readByte)()
        }, {
          pixelAspectRatio: (0, t.readByte)()
        }]
      },
      (0, e.conditional)({
        gct: (0, t.readArray)(3, function(i, g) {
          return Math.pow(2, g.lsd.gct.size + 1);
        })
      }, function(i, g) {
        return g.lsd.gct.exists;
      }),
      // content frames
      {
        frames: (0, e.loop)([r, o, c, s, n], function(i) {
          var g = (0, t.peekByte)()(i);
          return g === 33 || g === 44;
        })
      }
    ], d = l;
    w.default = d;
  })(ce)), ce;
}
var L = {}, Ce;
function Ze() {
  if (Ce) return L;
  Ce = 1, Object.defineProperty(L, "__esModule", {
    value: !0
  }), L.deinterlace = void 0;
  var w = function(t, a) {
    for (var r = new Array(t.length), s = t.length / a, n = function(m, h) {
      var u = t.slice(h * a, (h + 1) * a);
      r.splice.apply(r, [m * a, a].concat(u));
    }, o = [0, 4, 2, 1], c = [8, 8, 4, 2], l = 0, d = 0; d < 4; d++)
      for (var i = o[d]; i < s; i += c[d])
        n(i, l), l++;
    return r;
  };
  return L.deinterlace = w, L;
}
var q = {}, xe;
function Ve() {
  if (xe) return q;
  xe = 1, Object.defineProperty(q, "__esModule", {
    value: !0
  }), q.lzw = void 0;
  var w = function(t, a, r) {
    var s = 4096, n = -1, o = r, c, l, d, i, g, m, h, A, u, p, M, f, F, _, z, B, v = new Array(r), E = new Array(s), T = new Array(s), k = new Array(s + 1);
    for (f = t, l = 1 << f, g = l + 1, c = l + 2, h = n, i = f + 1, d = (1 << i) - 1, u = 0; u < l; u++)
      E[u] = 0, T[u] = u;
    var M, A, F, _, B, z;
    for (M = A = F = _ = B = z = 0, p = 0; p < o; ) {
      if (_ === 0) {
        if (A < i) {
          M += a[z] << A, A += 8, z++;
          continue;
        }
        if (u = M & d, M >>= i, A -= i, u > c || u == g)
          break;
        if (u == l) {
          i = f + 1, d = (1 << i) - 1, c = l + 2, h = n;
          continue;
        }
        if (h == n) {
          k[_++] = T[u], h = u, F = u;
          continue;
        }
        for (m = u, u == c && (k[_++] = F, u = h); u > l; )
          k[_++] = T[u], u = E[u];
        F = T[u] & 255, k[_++] = F, c < s && (E[c] = h, T[c] = F, c++, (c & d) === 0 && c < s && (i++, d += c)), h = m;
      }
      _--, v[B++] = k[_], p++;
    }
    for (p = B; p < o; p++)
      v[p] = 0;
    return v;
  };
  return q.lzw = w, q;
}
var Se;
function Xe() {
  if (Se) return D;
  Se = 1, Object.defineProperty(D, "__esModule", {
    value: !0
  }), D.decompressFrames = D.decompressFrame = D.parseGIF = void 0;
  var w = s(Ue()), e = Re(), t = De(), a = Ze(), r = Ve();
  function s(d) {
    return d && d.__esModule ? d : { default: d };
  }
  var n = function(i) {
    var g = new Uint8Array(i);
    return (0, e.parse)((0, t.buildStream)(g), w.default);
  };
  D.parseGIF = n;
  var o = function(i) {
    for (var g = i.pixels.length, m = new Uint8ClampedArray(g * 4), h = 0; h < g; h++) {
      var u = h * 4, p = i.pixels[h], f = i.colorTable[p] || [0, 0, 0];
      m[u] = f[0], m[u + 1] = f[1], m[u + 2] = f[2], m[u + 3] = p !== i.transparentIndex ? 255 : 0;
    }
    return m;
  }, c = function(i, g, m) {
    if (!i.image) {
      console.warn("gif frame does not have associated image.");
      return;
    }
    var h = i.image, u = h.descriptor.width * h.descriptor.height, p = (0, r.lzw)(h.data.minCodeSize, h.data.blocks, u);
    h.descriptor.lct.interlaced && (p = (0, a.deinterlace)(p, h.descriptor.width));
    var f = {
      pixels: p,
      dims: {
        top: i.image.descriptor.top,
        left: i.image.descriptor.left,
        width: i.image.descriptor.width,
        height: i.image.descriptor.height
      }
    };
    return h.descriptor.lct && h.descriptor.lct.exists ? f.colorTable = h.lct : f.colorTable = g, i.gce && (f.delay = (i.gce.delay || 10) * 10, f.disposalType = i.gce.extras.disposal, i.gce.extras.transparentColorGiven && (f.transparentIndex = i.gce.transparentColorIndex)), m && (f.patch = o(f)), f;
  };
  D.decompressFrame = c;
  var l = function(i, g) {
    return i.frames.filter(function(m) {
      return m.image;
    }).map(function(m) {
      return c(m, i.gct, g);
    });
  };
  return D.decompressFrames = l, D;
}
var $ = Xe();
const y = {
  MAX_CANVAS_SIZE: 2800,
  WORKING_SIZE: 800,
  NFT_SIZE: 2800,
  POOL_SIZE: 15,
  CANVAS_PER_SIZE: 5,
  MEMORY_LIMIT: 800 * 1024 * 1024,
  QUALITY: 1,
  BATCH_SIZE: 5,
  MEMORY_THRESHOLD: 0.8,
  SCALE_DOWN_FACTOR: 0.5,
  MAX_WORKERS: Math.ceil(navigator.hardwareConcurrency || 6),
  TARGET_SIZE: 800,
  MIN_SIZE: 400,
  DITHER: !1,
  DELAY: 100,
  WORKER_PATH: "/gif.worker.js",
  MAX_FRAME_SIZE: 4096,
  MAX_FRAME_COUNT: 300
}, Q = {
  LOW: {
    quality: 10,
    dither: !1,
    frameSkip: 2,
    colors: 128,
    preserveAlpha: !0,
    alphaThreshold: 128,
    smoothing: !0,
    blendMode: "source-over",
    colorEnhancement: {
      red: 0.8,
      green: 0.8,
      blue: 0.8
    }
  },
  MEDIUM: {
    quality: 5,
    dither: "FloydSteinberg",
    frameSkip: 1,
    colors: 256,
    preserveAlpha: !0,
    alphaThreshold: 128,
    smoothing: !0,
    blendMode: "source-over",
    colorEnhancement: {
      red: 1.1,
      green: 1.1,
      blue: 1.1
    }
  },
  HIGH: {
    quality: 1,
    //dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: !0,
    alphaThreshold: 220
    // Increased from 220 for better transparency handling
    //smoothing: true,
    //blendMode: 'source-over',
    //disposalMethod: 2, // Clear frame before drawing next
    // colorQuantization: {
    //   method: 'neuquant',
    //   colors: 256
    // },
    // transparencyMode: 'preserve',
    // frameCompositing: 'blend'
  },
  FIRE: {
    quality: 1,
    dither: !1,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: !0,
    alphaThreshold: 220,
    smoothing: !0,
    blendMode: "screen",
    colorEnhancement: {
      red: 1.2,
      green: 0.9,
      blue: 0.8,
      alpha: 1.2
    }
  },
  PIXEL: {
    quality: 1,
    dither: !1,
    // No dithering to preserve clean pixel edges
    frameSkip: 0,
    // Process all frames
    colors: 256,
    // Preserve original colors
    preserveAlpha: !0,
    // Maintain transparency
    alphaThreshold: 128,
    // Minimum alpha value for transparency
    smoothing: !1,
    // Disable anti-aliasing
    blendMode: "copy",
    // Directly copy frames without blending
    disposalMethod: 1,
    // Clear to background between frames
    synchronizeFrames: !0,
    // Synchronize frame timings
    pixelSnapping: !0,
    // Align pixels to the grid
    colorQuantization: {
      method: "octree",
      // Use octree for better color accuracy
      colors: 256
    }
  },
  HIGHRES: {
    quality: 1,
    dither: !1,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: !0,
    alphaThreshold: 128,
    smoothing: !0,
    blendMode: "source-over",
    disposalMethod: 2,
    synchronizeFrames: !0,
    colorQuantization: {
      method: "neuquant",
      colors: 256
    },
    transparencyMode: "precise",
    frameCompositing: "replace"
  },
  HIGHRESPIXEL: {
    quality: 1,
    dither: !1,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: !0,
    alphaThreshold: 128,
    smoothing: !1,
    // Keep pixel sharpness
    blendMode: "copy",
    disposalMethod: 2,
    synchronizeFrames: !0,
    pixelSnapping: !0,
    colorQuantization: {
      method: "neuquant",
      colors: 256
    },
    transparencyMode: "precise",
    frameCompositing: "replace"
  }
}, be = {
  maxScale: 4,
  minimumPixelSize: 2
};
class H {
  static instance = null;
  static getInstance() {
    return this.instance || (this.instance = new H()), this.instance;
  }
  destroyInstance() {
    H.instance = null;
  }
  detectPixelArt(e) {
    const { width: t, height: a } = e.dims, r = t * a, s = /* @__PURE__ */ new Set();
    let n = 0;
    for (let i = 0; i < e.patch.length; i += 4) {
      if (e.patch[i + 3] === 0) {
        n++;
        continue;
      }
      s.add(`${e.patch[i]},${e.patch[i + 1]},${e.patch[i + 2]}`);
    }
    const o = s.size / (r - n), c = r <= 256 * 256, l = o <= 0.1, d = this.detectSharpEdges(e);
    return c && l && d;
  }
  detectSharpEdges(e) {
    const { width: t, height: a } = e.dims;
    let r = 0, s = 0;
    for (let n = 1; n < a - 1; n++)
      for (let o = 1; o < t - 1; o++) {
        const c = (n * t + o) * 4, l = ((n - 1) * t + o) * 4, d = ((n + 1) * t + o) * 4, i = (n * t + (o - 1)) * 4, g = (n * t + (o + 1)) * 4;
        e.patch[c + 3] > 0 && (s++, (this.isSharpTransition(e.patch, c, l) || this.isSharpTransition(e.patch, c, d) || this.isSharpTransition(e.patch, c, i) || this.isSharpTransition(e.patch, c, g)) && r++);
      }
    return s > 0 && r / s > 0.4;
  }
  isSharpTransition(e, t, a) {
    if (e[a + 3] === 0) return !1;
    const r = 32;
    return Math.abs(e[t] - e[a]) > r || Math.abs(e[t + 1] - e[a + 1]) > r || Math.abs(e[t + 2] - e[a + 2]) > r;
  }
  analyzePixelArtFrame(e) {
    const { width: t, height: a } = e.dims, r = t * a, s = /* @__PURE__ */ new Map();
    let n = 0, o = 0;
    for (let h = 0; h < e.patch.length; h += 4) {
      if (e.patch[h + 3] === 0) {
        n++;
        continue;
      }
      e.patch[h + 3] < 255 && o++;
      const u = `${e.patch[h]},${e.patch[h + 1]},${e.patch[h + 2]}`;
      s.set(u, (s.get(u) || 0) + 1);
    }
    const c = s.size, l = r - n, d = l > 0 ? c / l : 1, i = t <= 256 && a <= 256, g = d < 0.1;
    return {
      ...e,
      colors: c,
      uniqueColors: c,
      totalPixels: r,
      uniqueRatio: d,
      isPixelArt: i && g,
      hasTransparency: n > 0 || o > 0,
      needsDisposal: o > 0 || n > 0 && n < r,
      disposalType: o > 0 ? 2 : 1
    };
  }
  processPixelArtFrame(e, t, a) {
    if (!e.dims || !e.patch)
      throw new Error("Invalid frame data");
    const { maxWidth: r, maxHeight: s, scaleFactors: n } = t, o = Math.max(
      1,
      Math.floor(y.TARGET_SIZE / Math.max(r, s))
    ), c = {
      width: e.dims.width,
      height: e.dims.height,
      top: e.dims.top || 0,
      left: e.dims.left || 0
    }, l = {
      width: Math.floor(c.width * o),
      height: Math.floor(c.height * o),
      targetWidth: Math.floor(r * o),
      targetHeight: Math.floor(s * o)
    }, d = {
      x: c.left * o,
      y: c.top * o
    };
    c.left === 0 && c.top === 0 && (d.x = Math.floor((l.targetWidth - l.width) / 2), d.y = Math.floor((l.targetHeight - l.height) / 2));
    const i = {
      x: Math.floor(d.x / o) * o,
      y: Math.floor(d.y / o) * o
    }, g = document.createElement("canvas");
    g.width = e.dims.width, g.height = e.dims.height;
    const m = g.getContext("2d", { alpha: !0 });
    if (!m) throw new Error("Failed to get temp context");
    m.imageSmoothingEnabled = !1, m.imageSmoothingQuality = "low";
    const h = new ImageData(
      // frame.patch,
      e.dims.width,
      e.dims.height
    );
    m.putImageData(h, 0, 0);
    const u = document.createElement("canvas");
    u.width = l.targetWidth, u.height = l.targetHeight;
    const p = u.getContext("2d", { alpha: !0 });
    if (!p) throw new Error("Failed to get output context");
    p.imageSmoothingEnabled = !1, p.imageSmoothingQuality = "low", p.drawImage(
      g,
      0,
      0,
      c.width,
      c.height,
      // Source rect
      i.x,
      i.y,
      // Destination position
      l.width,
      l.height
      // Destination size
    );
    const f = p.getImageData(0, 0, l.targetWidth, l.targetHeight);
    return g.remove(), u.remove(), {
      ...e,
      patch: f.data,
      dims: {
        width: l.targetWidth,
        height: l.targetHeight,
        top: 0,
        left: 0
      },
      disposalType: e.disposalType || 2
    };
  }
}
H.getInstance();
class V {
  static instance = null;
  static getInstance() {
    return this.instance || (this.instance = new V()), this.instance;
  }
  destroyInstance() {
    V.instance = null;
  }
  async detectPixelArtInAllFrames(e) {
    return e.some((t) => this.detectPixelArt(t));
  }
  /**
   * ✅ Enhanced Pixel Art Detection using color density and edge transitions.
   */
  detectPixelArt(e) {
    const { width: t, height: a } = e.dims, r = t * a, s = /* @__PURE__ */ new Set();
    let n = 0;
    for (let g = 0; g < e.patch.length; g += 4) {
      const m = e.patch[g], h = e.patch[g + 1], u = e.patch[g + 2];
      if (e.patch[g + 3] === 0) {
        n++;
        continue;
      }
      s.add(`${m},${h},${u}`);
    }
    const o = r - n, c = s.size / o, l = r <= 256 * 256, d = c <= 0.15, i = s.size <= 256;
    return l && (d || i);
  }
  async analyzeGIF(e) {
    const t = $.parseGIF(e), a = $.decompressFrames(t, !0), r = a.some(
      (i) => i.dims.width * i.dims.height > 512 * 512
    );
    let s = !1;
    s = a.some(
      (i) => this.detectPixelArt(i)
    );
    let n = !1, o = /* @__PURE__ */ new Set();
    const c = a.map((i) => {
      const g = H.prototype.analyzePixelArtFrame(i);
      n = n || g.hasTransparency;
      for (let m = 0; m < i.patch.length; m += 4)
        i.patch[m + 3] > 0 && o.add(`${i.patch[m]},${i.patch[m + 1]},${i.patch[m + 2]}`);
      return g;
    }), l = {
      frameDelays: a.map((i) => i.delay),
      individualFrameSizes: a.map((i) => ({
        width: i.dims.width,
        height: i.dims.height
      })),
      frameDisposal: a.map((i) => i.disposalType || 0),
      transparentIndex: a.map((i) => i.transparentIndex || -1),
      framePatch: a.map((i) => new Set(Array.from(i.patch))),
      frameColors: a.map((i) => {
        const g = /* @__PURE__ */ new Set();
        for (let m = 0; m < i.patch.length; m += 4)
          i.patch[m + 3] > 0 && g.add(i.patch[m] << 16 | i.patch[m + 1] << 8 | i.patch[m + 2]);
        return g;
      }),
      framePixels: a.map((i) => i.pixels || []),
      transparencyThresholds: c.map((i) => i.needsDisposal ? 220 : 128),
      isHighRes: r,
      averageAlpha: a.map((i) => {
        let g = 0, m = 0;
        for (let h = 3; h < i.patch.length; h += 4)
          i.patch[h] > 0 && (g += i.patch[h], m++);
        return m > 0 ? g / m : 255;
      })
    }, d = {
      gifSignature: t.header.signature,
      gifVersion: t.header.version,
      backgroundColorIndex: t.lsd.backgroundColorIndex,
      sort: !!t.lsd.gct.sort,
      globalColorTable: t.gct || [],
      globalPalette: t.lsd.gct.size,
      resolution: t.lsd.gct.resolution,
      pixelAspectRatio: t.lsd.pixelAspectRatio,
      globalPaletteDepth: t.gct ? Math.ceil(Math.log2(t.gct.length)) : 0
    };
    return {
      width: t.lsd.width,
      height: t.lsd.height,
      frames: a.length,
      isPixelArt: s,
      hasTransparency: n,
      colorDepth: Math.ceil(Math.log2(o.size)),
      frameExtras: l,
      gifExtras: d
    };
  }
  //public analyzeFrameDimensions(frames: ParsedFrame[]): FrameSizeMetadata {
  analyzeGIFFrameDimensions(e) {
    const t = e.map((o) => ({
      width: o.dims.width,
      height: o.dims.height
    })), a = Math.max(...t.map((o) => o.width)), r = Math.max(...t.map((o) => o.height)), s = t.some(
      (o) => o.width !== a || o.height !== r
    ), n = t.map((o) => {
      const c = a / o.width, l = r / o.height;
      return Math.min(c, l);
    });
    return { maxWidth: a, maxHeight: r, hasVariableSize: s, scaleFactors: n };
  }
}
const G = V.getInstance();
class W {
  static instance = null;
  qualityOptions;
  constructor() {
    this.qualityOptions = {
      allowAutoDetect: !0,
      memoryAware: !0
    };
  }
  static getInstance() {
    return this.instance || (this.instance = new W()), this.instance;
  }
  destroyInstance() {
    W.instance = null;
  }
  /**
   * ✅ Dynamically applies image quality settings based on detected GIF type.
   */
  applyImageQualitySettings(e) {
    e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "high";
  }
  /**
   * ✅ Determines the best quality preset for the GIF using metadata analysis.
   */
  selectOptimalQuality(e) {
    if (this.qualityOptions.forceQuality)
      return this.qualityOptions.forceQuality;
    const t = e.width * e.height;
    e.frameExtras.individualFrameSizes.reduce(
      (n, o) => n + o.width * o.height,
      0
    ) / e.frames;
    const a = {
      isHighRes: t > 512 * 512,
      isVeryHighRes: t > 1024 * 1024,
      hasHighColorDepth: e.colorDepth > 128,
      hasLimitedPalette: e.colorDepth < 128,
      hasSharpEdges: this.detectSharpEdges(e),
      hasTransparency: e.hasTransparency
    }, r = this.analyzeDominantColors(e), s = this.detectFireMotion(e);
    return r.isFireEffect && s ? "FIRE" : e.isPixelArt ? a.isHighRes ? "HIGHRESPIXEL" : "PIXEL" : a.isHighRes || a.isVeryHighRes ? a.hasSharpEdges && a.hasLimitedPalette ? "HIGHRESPIXEL" : "HIGHRES" : (a.hasHighColorDepth || e.frames > 30, "HIGH");
  }
  /**
   * 🔥 **Detects rapid red/orange shifts across frames (fire animation)**
   */
  detectFireMotion(e) {
    let t = 0;
    const a = e.frameExtras.frameColors;
    for (let r = 0; r < a.length - 1; r++) {
      const s = Array.from(a[r]), n = Array.from(a[r + 1]);
      s.filter((c, l) => {
        const d = c >> 16 & 255, i = n[l] >> 16 & 255;
        return Math.abs(d - i) > 20;
      }).length > s.length * 0.2 && t++;
    }
    return t > a.length * 0.5;
  }
  /**
   * 🎨 **Detects if the GIF has pixel art characteristics**
   */
  detectPixelArt(e) {
    return e.colorDepth < 128 && this.detectSharpEdges(e);
  }
  /**
   * 🌈 **Analyzes dominant colors to detect fire-like effects**
   */
  analyzeDominantColors(e) {
    const t = /* @__PURE__ */ new Map();
    let a = 0;
    e.frameExtras.frameColors.forEach((n) => {
      n.forEach((o) => {
        const c = o >> 16 & 255, l = o >> 8 & 255, d = o & 255, i = `${c},${l},${d}`;
        t.set(i, (t.get(i) || 0) + 1), a++;
      });
    });
    const r = Array.from(t.entries()).map(([n, o]) => {
      const [c, l, d] = n.split(",").map(Number);
      return { r: c, g: l, b: d, frequency: o / a };
    }).sort((n, o) => o.frequency - n.frequency).slice(0, 5);
    return { isFireEffect: r.some(
      (n) => n.frequency > 0.15 && n.r > n.g * 1.5 && n.r > n.b * 1.5 && n.r > 200
    ), dominantColors: r };
  }
  /**
   * 🔍 **Checks for sharp color transitions in frames (pixel art or high-res)**
   */
  detectSharpEdges(e) {
    return e.frameExtras.frameColors.some((t) => {
      const a = Array.from(t);
      let r = 0;
      for (let s = 0; s < a.length - 1; s++) {
        const n = a[s], o = a[s + 1], c = n >> 16 & 255, l = n >> 8 & 255, d = n & 255, i = o >> 16 & 255, g = o >> 8 & 255, m = o & 255;
        (Math.abs(c - i) > 32 || Math.abs(l - g) > 32 || Math.abs(d - m) > 32) && r++;
      }
      return r > a.length * 0.3;
    });
  }
}
W.getInstance();
class ue {
  qualityManager;
  gifAnalyzer;
  constructor(e, t) {
    this.qualityManager = e, this.gifAnalyzer = t;
  }
  getInstance() {
    return new ue(new W(), V.getInstance());
  }
  async analyzeGifQuality(e) {
    try {
      const a = await (await fetch(e)).arrayBuffer(), r = await this.gifAnalyzer.analyzeGIF(a);
      return {
        quality: this.qualityManager.selectOptimalQuality(r),
        metadata: r
      };
    } catch (t) {
      throw console.error("Error analyzing GIF quality:", t), t;
    }
  }
}
class me {
  static instance = null;
  pixelArtHandler;
  imageProcessor;
  canvasPool;
  gifAnalyzer;
  workerPool;
  workerCount;
  constructor(e, t, a, r, s, n) {
    this.pixelArtHandler = e, this.imageProcessor = t, this.canvasPool = a, this.gifAnalyzer = r, this.workerPool = s, this.workerCount = n;
  }
  static getInstance(e, t, a, r, s, n) {
    return this.instance || (this.instance = new me(
      e,
      t,
      a,
      r,
      s,
      n
    )), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  calculateFrameSizeMetadata(e) {
    const { width: t, height: a, frames: r, isPixelArt: s } = e, n = e.frameExtras.individualFrameSizes, o = Math.max(...n.map((h) => h.width)), c = Math.max(...n.map((h) => h.height)), l = Math.min(...n.map((h) => h.width)), d = Math.min(...n.map((h) => h.height)), i = n.some(
      (h) => h.width !== o || h.height !== c
    ), g = n.map((h) => h.width / h.height);
    let m;
    if (s) {
      const h = Math.max(o, c), u = Math.floor(y.TARGET_SIZE / h);
      m = {
        width: o * u,
        height: c * u,
        scale: u
      };
    } else {
      const h = y.TARGET_SIZE / Math.max(o, c);
      m = {
        width: Math.round(o * h),
        height: Math.round(c * h),
        scale: h
      };
    }
    return {
      maxWidth: o,
      maxHeight: c,
      minWidth: l,
      minHeight: d,
      hasVariableSizes: i,
      aspectRatios: g,
      targetSize: m
    };
  }
  // Add this new helper method for calculating frame fit dimensions
  calculateGifFitDimensions(e, t) {
    const a = y.TARGET_SIZE, r = e / t, s = 1;
    let n, o, c = 0, l = 0, d = e, i = t;
    return r > s ? (o = a, n = a, i = t, d = Math.round(t), c = Math.round((e - d) / 2)) : (n = a, o = a, d = e, i = Math.round(e), l = Math.round((t - i) / 2)), {
      width: n,
      height: o,
      x: 0,
      // No need to center since we're filling the canvas
      y: 0,
      sourceX: c,
      sourceY: l,
      sourceWidth: d,
      sourceHeight: i
    };
  }
  // Add this new method to determine consistent dimensions for all frames
  calculateConsistentDimensions(e) {
    const t = Math.max(...e.map((l) => l.dims.width)), a = Math.max(...e.map((l) => l.dims.height)), r = Math.min(
      y.TARGET_SIZE / t,
      y.TARGET_SIZE / a
    ), s = Math.round(t * r), n = Math.round(a * r), o = Math.floor((y.TARGET_SIZE - s) / 2), c = Math.floor((y.TARGET_SIZE - n) / 2);
    return {
      width: s,
      height: n,
      scale: r,
      offsetX: o,
      offsetY: c
    };
  }
  async processFrame(e, t) {
    try {
      const a = this.gifAnalyzer.detectPixelArt(e), { width: r, height: s } = e.dims;
      if (a) {
        const d = this.gifAnalyzer.analyzeGIFFrameDimensions([
          e
        ]), i = this.pixelArtHandler.processPixelArtFrame(
          e,
          d,
          0
        );
        return { bitmap: await createImageBitmap(
          new ImageData(
            new Uint8ClampedArray(i.patch),
            i.dims.width,
            i.dims.height
          )
        ), originalFrame: i };
      }
      const n = this.canvasPool.getCanvas(
        r,
        s,
        !1
      ), o = n.getContext("2d", { alpha: !0 });
      if (!o) throw new Error("Failed to get canvas context");
      o.clearRect(0, 0, r, s), o.imageSmoothingEnabled = !a, o.imageSmoothingQuality = a ? "low" : "high";
      const c = new ImageData(
        new Uint8ClampedArray(e.patch),
        r,
        s
      );
      return o.putImageData(c, 0, 0), o.globalCompositeOperation = "source-over", t && o.drawImage(t, 0, 0, r, s), { bitmap: await createImageBitmap(n), originalFrame: e };
    } catch (a) {
      throw console.error("Error processing frame:", a), a;
    }
  }
  async processFrameOG(e) {
    try {
      const t = this.gifAnalyzer.detectPixelArt(e), { width: a, height: r } = e.dims, {
        width: s,
        height: n,
        x: o,
        y: c
      } = this.calculateGifFitDimensions(a, r), l = this.imageProcessor.createCanvas(
        s,
        n
      ), d = this.imageProcessor.getCanvasContext(l);
      d.clearRect(0, 0, s, n), d.globalCompositeOperation = "source-over";
      const i = this.imageProcessor.createCanvas(a, r), g = this.imageProcessor.getCanvasContext(i), m = new ImageData(
        new Uint8ClampedArray(e.patch),
        a,
        r
      ), h = 220;
      for (let p = 3; p < m.data.length; p += 4)
        m.data[p] < h && (m.data[p] = 0);
      g.putImageData(m, 0, 0), d.drawImage(i, o, c, s, n);
      const u = d.getImageData(
        0,
        0,
        l.width,
        l.height
      );
      return {
        ...e,
        patch: u.data,
        // Store updated pixel data
        dims: {
          width: l.width,
          height: l.height,
          top: 0,
          left: 0
        }
      };
    } catch (t) {
      throw new Error(`Failed to process frame: ${t}`);
    }
  }
  optimizeFrameDimensions(e, t) {
    const a = t.isPixelArt, { width: r, height: s } = e.dims;
    if (a) {
      const n = Math.max(
        be.minimumPixelSize,
        Math.floor(y.TARGET_SIZE / Math.max(r, s))
      ), o = Math.min(n, be.maxScale);
      return {
        width: r * o,
        height: s * o,
        scale: o,
        offsetX: Math.floor((y.TARGET_SIZE - r * o) / 2),
        offsetY: Math.floor((y.TARGET_SIZE - s * o) / 2)
      };
    }
    return Math.min(
      y.TARGET_SIZE / r,
      y.TARGET_SIZE / s
    ), this.calculateConsistentDimensions([e]);
  }
  async processFrame1(e, t, a) {
    if (!a)
      return e;
    const {
      width: r,
      height: s,
      sourceX: n,
      sourceY: o
    } = this.calculateGifFitDimensions(e.dims.width, e.dims.height), c = this.calculateFrameSizeMetadata(a);
    a.isPixelArt;
    const l = document.createElement("canvas");
    l.width = c.targetSize.width, l.height = c.targetSize.height;
    const d = l.getContext("2d", { alpha: !0 });
    if (!d) throw new Error("Failed to get canvas context");
    const { width: i, height: g, scale: m } = this.imageProcessor.calculateUniformDimensions(a);
    if (d) {
      d.imageSmoothingEnabled = !1, l instanceof HTMLCanvasElement && (l.style.imageRendering = "pixelated");
      const k = (i - e.dims.width * m) / 2, M = (g - e.dims.height * m) / 2, A = document.createElement("canvas");
      A.width = e.dims.width, A.height = e.dims.height;
      const F = A.getContext("2d", { alpha: !0 });
      if (!F) throw new Error("Failed to get temp context");
      F.putImageData(
        new ImageData(
          new Uint8ClampedArray(e.patch),
          e.dims.width,
          e.dims.height
        ),
        0,
        0
      ), d.drawImage(
        A,
        k,
        M,
        e.dims.width * m,
        e.dims.height * m
      );
    }
    d.clearRect(0, 0, l.width, l.height);
    const h = e.dims.width * c.targetSize.scale, u = e.dims.height * c.targetSize.scale, p = (c.targetSize.width - h) / 2, f = (c.targetSize.height - u) / 2, v = document.createElement("canvas");
    v.width = e.dims.width, v.height = e.dims.height;
    const E = v.getContext("2d", { alpha: !0 });
    if (!E) throw new Error("Failed to get temp context");
    E.putImageData(
      new ImageData(
        new Uint8ClampedArray(e.patch),
        e.dims.width,
        e.dims.height
      ),
      0,
      0
    ), d.drawImage(v, p, f, h, u);
    const T = d.getImageData(
      0,
      0,
      l.width,
      l.height
    );
    return {
      ...e,
      patch: T.data,
      dims: {
        width: l.width,
        height: l.height,
        top: 0,
        left: 0
      }
    };
  }
  processHighResFrame(e, t) {
    const { width: a, height: r } = e.dims, s = document.createElement("canvas");
    s.width = a, s.height = r;
    const n = s.getContext("2d", { alpha: !0 });
    if (!n) throw new Error("Failed to get alpha context");
    const o = new ImageData(
      new Uint8ClampedArray(e.patch),
      a,
      r
    );
    for (let m = 3; m < o.data.length; m += 4)
      o.data[m] > 0 && o.data[m] < 255 || o.data[m] === 0 && (o.data[m - 3] = 0, o.data[m - 2] = 0, o.data[m - 1] = 0);
    n.putImageData(o, 0, 0);
    const { width: c, height: l } = this.calculateGifFitDimensions(a, r), d = document.createElement("canvas");
    d.width = c, d.height = l;
    const i = d.getContext("2d", { alpha: !0 });
    if (!i) throw new Error("Failed to get output context");
    i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high", i.drawImage(s, 0, 0, c, l);
    const g = i.getImageData(0, 0, c, l);
    return s.remove(), d.remove(), {
      ...e,
      patch: g.data,
      dims: {
        width: c,
        height: l,
        top: 0,
        left: 0
      },
      disposalType: 2
    };
  }
  async processFramesInWorkers(e, t) {
    await this.gifAnalyzer.detectPixelArtInAllFrames(e);
    const a = Math.ceil(e.length / this.workerCount), r = [];
    for (let s = 0; s < e.length; s += a)
      r.push(e.slice(s, s + a));
    return (await Promise.all(
      r.map(
        async (s) => this.workerPool.addTask(
          () => Promise.all(
            s.map(
              async (n) => this.processFrame(n, t ?? null)
            )
          )
        )
      )
    )).flat();
  }
}
class je {
  phases = {};
  phaseOrder = [];
  startTime = 0;
  phaseStartTimes = {};
  currentPhase = "";
  constructor(e, t) {
    this.phases = { ...e }, this.phaseOrder = t;
  }
  emitProgress(e) {
    typeof window < "u" && window.dispatchEvent(new CustomEvent("progress-update", { detail: e }));
  }
  calculateTotalProgress() {
    let e = 0, t = !1;
    for (const r of this.phaseOrder) {
      const s = this.phases[r];
      if (s.status === "completed" ? e += s.weight : s.status === "active" && !t && (e += (s.progress ?? 0) * s.weight / 100, t = !0), t) break;
    }
    const a = this.phaseOrder.reduce((r, s) => r + this.phases[s].weight, 0);
    return a > 0 ? Math.round(e / a * 100) : 0;
  }
  startTracking() {
    this.startTime = Date.now(), this.reset();
  }
  updatePhaseProgress(e, t, a) {
    const r = this.phases[e];
    r && (r.progress = t, r.message = a || "", this.emitProgress({
      phase: e,
      phaseProgress: t,
      totalProgress: this.getTotalProgress(),
      currentPhase: this.currentPhase,
      status: r.status,
      timestamp: Date.now(),
      elapsedTime: this.getElapsedTime()
    }));
  }
  reset() {
    this.startTime = 0, this.phaseStartTimes = {}, this.currentPhase = this.phaseOrder[0], Object.values(this.phases).forEach((e) => {
      e.progress = 0, e.status = void 0, e.message = "", e.startTime = void 0, e.eta = void 0, e.processedItems = void 0, e.totalItems = void 0, e.averageTimePerItem = void 0;
    });
  }
  getPhaseInfo(e) {
    return this.phases[e];
  }
  getAllPhases() {
    return Object.values(this.phases);
  }
  getCurrentPhase() {
    return this.phases[this.currentPhase];
  }
  getTotalProgress() {
    return this.calculateTotalProgress();
  }
  getElapsedTime() {
    return this.startTime ? Date.now() - this.startTime : 0;
  }
}
class Oe {
  // Minimum time between updates
  constructor(e) {
    this.callback = e;
  }
  timeout = null;
  lastUpdate = 0;
  minInterval = 1e3;
  update(...e) {
    const t = performance.now();
    if (this.timeout && clearTimeout(this.timeout), t - this.lastUpdate > this.minInterval) {
      this.lastUpdate = t, this.callback(...e);
      return;
    }
    this.timeout = setTimeout(() => {
      this.lastUpdate = performance.now(), this.callback(...e);
    }, this.minInterval);
  }
  cancel() {
    this.timeout && (clearTimeout(this.timeout), this.timeout = null);
  }
}
class Ge {
  phases = {};
  initialized = !1;
  progressDebouncer;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  phaseStartTimes = /* @__PURE__ */ new Map();
  completedPhases = /* @__PURE__ */ new Set();
  significantOperations = /* @__PURE__ */ new Set(["processing", "encoding"]);
  constructor() {
    this.progressDebouncer = new Oe((e) => {
      window.dispatchEvent(new CustomEvent("gif-phase-update", { detail: e }));
    }), this.initialized || (this.initializePhases(), this.initialized = !0);
  }
  initializePhases() {
    Object.entries(P).forEach(([e, t]) => {
      this.phases[t.id] = {
        progress: 0,
        message: `${t.name} reset`,
        operation: "processing",
        processed: 0,
        total: 0,
        status: "pending"
      };
    });
  }
  /**
   * 🚀 Tracks frame processing time and calculates progress/ETA dynamically.
   */
  trackFrameProcessing(e, t) {
    const a = performance.now();
    e === 0 && (this.frameStartTime = a, this.frameProcessingTimes = [], this.totalFramesCount = t, this.processedFramesCount = 0, this.processingStartTime = a);
    const r = a - this.frameStartTime;
    this.frameProcessingTimes.push(r), this.processedFramesCount++;
    const s = this.frameProcessingTimes.slice(-5), n = s.reduce((l, d) => l + d, 0) / s.length, c = (t - (e + 1)) * n;
    return this.frameStartTime = a, {
      progress: Math.round((e + 1) / t * 100),
      estimatedRemainingTime: c,
      avgTimePerFrame: n,
      elapsedTime: a - this.processingStartTime
    };
  }
  /**
   * 📥 Tracks overall loading progress.
   */
  updateLoadingProgress(e, t, a) {
    const r = Math.round(e / t * 100);
    this.updatePhase(
      P.LOADING.id,
      r,
      `Loading assets (${e}/${t}): ${a.split("/").pop()}`
    );
  }
  /**
   * ⏳ Calculates ETA dynamically.
   */
  calculateETA(e, t) {
    const a = performance.now(), r = a - this.processingStartTime;
    if (e === 0)
      return this.processingStartTime = a, "Calculating...";
    this.framesProcessed = e, this.averageFrameTime = r / e;
    const n = (t - e) * this.averageFrameTime;
    if (n < 1e3)
      return "Less than a second";
    const o = Math.round(n / 1e3);
    if (o < 60)
      return `~${o} seconds`;
    const c = Math.round(o / 60);
    return `~${c} minute${c > 1 ? "s" : ""}`;
  }
  /**
   * 🔄 Resets all progress tracking data.
   */
  // Modify the reset method to be more selective
  resetProgress(e) {
    if (e) {
      const t = P[e];
      t && (this.phases[t.id] = {
        progress: 0,
        message: `${t.name} reset`,
        operation: "processing",
        processed: 0,
        total: 0,
        status: "pending"
      });
    } else
      Object.values(this.phases).some(
        (a) => a.progress !== 0 || a.processed !== 0 || a.total !== 0 || a.status !== "pending"
      ) && this.initializePhases();
  }
  /**
   * 📊 Updates the progress of a specific GIF processing phase.
   */
  updatePhase(e, t, a, r = "processing", s, n, o) {
    if (!this.significantOperations.has(r))
      return;
    const c = performance.now();
    this.phaseStartTimes.has(e) || this.phaseStartTimes.set(e, c);
    const l = c - (this.phaseStartTimes.get(e) || c), d = this.processedFramesCount ? l / this.processedFramesCount : 0, i = n ? (n - this.processedFramesCount) * d : 0, g = {
      phaseId: e,
      currentProgress: t,
      message: a,
      operation: r,
      assetName: s,
      timestamp: c,
      totalItems: n,
      estimatedRemainingTime: o || i,
      elapsedTime: l,
      speed: d,
      processed: this.processedFramesCount,
      total: n || this.totalFramesCount,
      isCompleted: t >= 100
    };
    this.progressDebouncer.update(g), t >= 100 && this.completedPhases.add(e), Object.values(P).forEach((m) => {
      m.id !== e && !this.completedPhases.has(m.id) && Object.values(P).indexOf(m) < Object.values(P).findIndex((u) => u.id === e) && (this.completedPhases.add(m.id), window.dispatchEvent(new CustomEvent("gif-phase-update", {
        detail: {
          phaseId: m.id,
          currentProgress: 100,
          message: `${m.name} complete`,
          timestamp: c
        }
      })));
    }), console.debug(`[GIF Phase Update] ${e}:`, {
      progress: t,
      message: a,
      operation: r,
      processed: this.processedFramesCount,
      total: this.totalFramesCount,
      avgTime: Math.round(g.speed)
    });
  }
  destroy() {
    this.progressDebouncer.cancel();
  }
}
const P = {
  LOADING: { id: "loading", name: "Loading Assets", weight: 5, color: "bg-blue-600" },
  CREATE_STATIC: { id: "create_static", name: "Creating Static Layer", weight: 5, color: "bg-teal-600" },
  EXTRACTING: { id: "extracting", name: "Extracting Frames", weight: 15, color: "bg-purple-600" },
  PROCESSING: { id: "processing", name: "Processing Frames", weight: 25, color: "bg-yellow-600" },
  ENCODING: { id: "encoding", name: "Encoding GIF", weight: 50, color: "bg-green-600" }
}, Qe = ["loading", "create_static", "extracting", "processing", "encoding"];
class Ke extends je {
  encodingStartTime = 0;
  frameCount = 0;
  processedFrames = 0;
  completedPhases = /* @__PURE__ */ new Set();
  phaseTimings = /* @__PURE__ */ new Map();
  progressDebouncer;
  constructor() {
    super(P, Qe), this.startTime = Date.now(), this.progressDebouncer = new Oe((e) => {
      this.emitProgress(e);
    });
  }
  updateProgress(e, t, a, r, s, n) {
    const o = Date.now();
    if (!this.phases[e]) {
      console.error(`Invalid phase: ${e}`);
      return;
    }
    if (this.phaseTimings.has(e) || this.phaseTimings.set(e, { start: o }), e !== this.currentPhase) {
      if (this.currentPhase) {
        const m = this.phaseTimings.get(this.currentPhase);
        m && (m.end = o, this.phaseTimings.set(this.currentPhase, m));
      }
      this.currentPhase = e;
    }
    const c = this.phases[e];
    if (!c) return;
    c.status = "active", c.progress = Math.min(100, Math.max(0, t)), c.message = a || c.message, c.startTime = this.phaseTimings.get(e)?.start, c.totalItems = r, c.processedItems = s, e === "encoding" && this.handleEncodingPhase(t, o, r, s);
    const l = this.calculatePhaseElapsed(e, o), d = o - this.startTime, i = this.calculateProcessingSpeed(e, s, l), g = this.calculateEta(e, s, r, l);
    this.progressDebouncer.update({
      phase: e,
      phaseProgress: t,
      totalProgress: this.calculateTotalProgress(),
      message: c.message,
      currentPhase: c.name,
      status: c.status,
      timestamp: o,
      totalItems: r,
      processedItems: s,
      estimatedRemainingTime: g,
      elapsedTime: d,
      isActive: !0,
      processingSpeed: i
    }), t >= 100 && this.completePhase(e, o).then(() => {
      this.updateProgress(e, 0, a, r, s, n);
    });
  }
  handleEncodingPhase(e, t, a, r) {
    this.encodingStartTime || (this.encodingStartTime = t, this.frameCount = a || 0), this.processedFrames = r || 0;
  }
  calculatePhaseElapsed(e, t) {
    const a = this.phaseTimings.get(e);
    return a ? t - a.start : 0;
  }
  calculateProcessingSpeed(e, t, a) {
    if (!t || !a) return "";
    const r = t / a * 1e3;
    return e === "encoding" ? `${r.toFixed(1)} fps` : `${r.toFixed(1)}/s`;
  }
  calculateEta(e, t, a, r) {
    if (!t || !a || !r) return 0;
    const s = t / r;
    return (a - t) / s;
  }
  async completePhase(e, t = Date.now()) {
    const a = this.phases[e];
    if (!a) return;
    const r = this.phaseTimings.get(e);
    r && (r.end = t, this.phaseTimings.set(e, r)), a.status = "completed", a.progress = 100, a.endTime = t, a.duration = r ? r.end - r.start : 0, this.completedPhases.add(e);
    const s = this.phaseOrder.indexOf(e) + 1;
    if (s < this.phaseOrder.length) {
      const n = this.phaseOrder[s];
      this.phaseTimings.set(n, { start: t });
    }
  }
  getTotalElapsedTime() {
    return Date.now() - this.startTime;
  }
  reset() {
    super.reset(), this.startTime = Date.now(), this.encodingStartTime = 0, this.frameCount = 0, this.processedFrames = 0, this.completedPhases.clear(), this.phaseTimings.clear();
  }
  destroy() {
    this.progressDebouncer.cancel();
  }
}
class Y {
  static instance = null;
  progManager;
  workerPool;
  memoryUsage;
  completedPhases;
  canvasPool;
  constructor(e, t, a) {
    this.progManager = e, this.workerPool = t, this.canvasPool = a, this.completedPhases = /* @__PURE__ */ new Set();
  }
  static getInstance(e, t, a) {
    return this.instance || (this.instance = new Y(e, t, a)), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  async loadAndCreateStaticImage(e, t) {
    try {
      this.progManager.updatePhase(
        P.CREATE_STATIC.id,
        0,
        "Loading background image...",
        "processing",
        e
      );
      const a = await this.loadImage(e);
      this.progManager.updatePhase(
        P.CREATE_STATIC.id,
        20,
        "Background loaded"
      );
      const r = document.createElement("canvas");
      r.width = y.TARGET_SIZE, r.height = y.TARGET_SIZE;
      const s = r.getContext("2d", { willReadFrequently: !0 });
      if (!s) throw new Error("Failed to get canvas context");
      const n = Math.min(
        y.TARGET_SIZE / y.NFT_SIZE,
        y.TARGET_SIZE / y.NFT_SIZE
      ), o = Math.round(y.NFT_SIZE * n), c = Math.round(y.NFT_SIZE * n), l = this.calculateCenteredPosition(
        y.TARGET_SIZE,
        o
      ), d = this.calculateCenteredPosition(
        y.TARGET_SIZE,
        c
      );
      if (s.drawImage(a, l, d, o, c), t?.length)
        for (let i = 0; i < t.length; i++) {
          const g = t[i];
          this.progManager.updatePhase(
            P.CREATE_STATIC.id,
            20 + Math.round((i + 1) / t.length * 80),
            `Loading overlay ${i + 1}/${t.length}`,
            "processing",
            g.name
          );
          const m = await this.loadImage(g.url);
          s.drawImage(m, l, d, o, c);
        }
      return this.progManager.updatePhase(
        P.CREATE_STATIC.id,
        100,
        "Static layer complete"
      ), r;
    } catch (a) {
      throw console.error("Error creating static image:", a), a;
    }
  }
  getCacheKey(e) {
    return e;
  }
  optimizeGifFrame(e, t = !1) {
    const a = document.createElement("canvas");
    a.width = y.TARGET_SIZE, a.height = y.TARGET_SIZE;
    const r = a.getContext("2d", {
      willReadFrequently: !0,
      alpha: !0
    });
    return r && (r.imageSmoothingEnabled = !0, r.imageSmoothingQuality = "high", r.globalCompositeOperation = "copy", r.drawImage(e, 0, 0, a.width, a.height)), a;
  }
  async logBatchProgress(e, t, a) {
    const r = e, s = Math.min(e + t, a), n = this.workerPool.stats;
    console.debug(`[BatchProcessor] Progress:
        Batch: ${Math.floor(e / t) + 1}/${Math.ceil(a / t)}
        Workers: ${n.activeWorkers}/${n.maxWorkers} (${n.availableWorkers} available)
        Memory: ${Math.round(this.memoryUsage.usedJSHeapSize / (1024 * 1024))}MB
        Frames: ${r + 1}-${s}/${a}
      `), s === a && this.progManager.updatePhase(
      P.PROCESSING.id,
      100,
      "Frame processing complete"
    );
  }
  loadedAssetCount = 0;
  loadWithProgress = async (e, t) => {
    try {
      const a = await this.loadImage(e);
      this.loadedAssetCount++;
      const r = Math.round(this.loadedAssetCount / t * 100);
      return this.progManager.updatePhase(
        P.LOADING.id,
        r,
        `Loading asset ${this.loadedAssetCount}/${t}: ${e}`
      ), a;
    } catch (a) {
      throw console.error("Asset loading failed:", a), a;
    } finally {
      this.loadedAssetCount === t && (this.loadedAssetCount = 0);
    }
  };
  async loadAsset(e) {
    const t = e.length || 0;
    return await Promise.all(
      e?.map(
        async (r) => await this.loadWithProgress(r.url, t)
      ) || []
    );
  }
  async loadAssets(e, t) {
    const a = (t?.length || 0) + 1;
    let r = 0;
    try {
      this.progManager.updatePhase(
        P.LOADING.id,
        0,
        "Starting asset load..."
      );
      const s = await this.loadImage(e);
      r++;
      const n = r / a * 100;
      if (this.progManager.updatePhase(
        P.LOADING.id,
        n,
        "Base image loaded",
        "processing",
        e
      ), !t?.length)
        return this.progManager.updatePhase(
          P.LOADING.id,
          100,
          "Assets loaded"
        ), this.completedPhases.add(P.LOADING.id), { bglessImage: s, overlayImages: [] };
      const o = await Promise.all(
        t.map(async (c, l) => {
          const d = await this.loadImage(c.url);
          r++;
          const i = r / a * 100;
          return this.progManager.updatePhase(
            P.LOADING.id,
            i,
            `Loading OverlayAsset ${l + 1}/${t.length}`,
            "processing",
            c.name
          ), d;
        })
      );
      return this.progManager.updatePhase(
        P.LOADING.id,
        100,
        "All assets loaded"
      ), this.completedPhases.add(P.LOADING.id), { bglessImage: s, overlayImages: o };
    } catch (s) {
      throw console.error("Asset loading failed:", s), this.completedPhases.delete(P.LOADING.id), s;
    }
  }
  async loadImage(e) {
    return new Promise((t, a) => {
      const r = new Image();
      r.crossOrigin = "anonymous", r.onload = () => t(r), r.onerror = (s) => {
        console.error(`Failed to load image: ${e}`, s), a(new Error(`Failed to load image: ${e}`));
      }, r.src = e;
    });
  }
  calculateCenteredPosition(e, t) {
    return Math.floor((e - t) / 2);
  }
  drawOverlay(e, t, a, r) {
    const { x: s, y: n } = a;
    if (r) {
      const { width: o, height: c } = r;
      e.drawImage(t, s, n, o, c);
    } else
      e.drawImage(t, s, n);
  }
  loadStaticImage = async (e, t) => {
    try {
      if (!t) {
        this.progManager.updatePhase(
          P.LOADING.id,
          0,
          "Loading base image..."
        );
        const n = await this.loadImage(e);
        return this.progManager.updatePhase(
          P.LOADING.id,
          100,
          "Base image loaded"
        ), this.createStaticImage(n);
      }
      const a = t.length + 1;
      this.progManager.updatePhase(
        P.LOADING.id,
        0,
        "Loading assets..."
      );
      const r = await this.loadImage(e);
      this.progManager.updatePhase(
        P.LOADING.id,
        1 / a * 100,
        "Base image loaded"
      );
      const s = await Promise.all(
        t.map(async (n, o) => {
          const c = await this.loadImage(n.url), l = (o + 2) / a * 100;
          return this.progManager.updatePhase(
            P.LOADING.id,
            l,
            `Loading overlay ${o + 1}/${t.length}`
          ), c;
        })
      );
      return this.progManager.updatePhase(
        P.LOADING.id,
        100,
        "All assets loaded"
      ), this.createStaticImage(r, s);
    } catch (a) {
      throw console.error("Failed to load static image:", a), a;
    }
  };
  async createStaticImage(e, t) {
    if (!e)
      throw new Error("No images provided for creating a static image.");
    if (!t?.length) {
      const c = this.canvasPool.getCanvas(
        e.width,
        e.height,
        !1
      ), l = c.getContext("2d", { willReadFrequently: !0 });
      if (!l)
        throw new Error("Failed to get canvas context for static image.");
      return l.drawImage(e, 0, 0, e.width, e.height), c;
    }
    const a = e?.width || y.MAX_CANVAS_SIZE, r = e?.height || y.MAX_CANVAS_SIZE, s = this.canvasPool.getCanvas(
      a,
      r,
      !1
    ), n = s.getContext("2d", { willReadFrequently: !0 });
    if (!n)
      throw new Error("Failed to get canvas context for static image.");
    s.width = a, s.height = r;
    const o = await Promise.all(
      t.map(async (c) => ({
        ...c,
        image: await this.loadImage(c.src).catch((l) => (console.error(`Failed to load overlay image: ${c.src}`, l), null))
      }))
    );
    return await this.workerPool.addTask(async () => {
      e && n.drawImage(e, 0, 0, a, r);
      for (const c of o)
        c.image && this.drawOverlay(
          n,
          c.image,
          { x: c.x, y: c.y },
          c.width ? { width: c.width, height: c.height ?? r } : void 0
        );
    }), s;
  }
}
Y.getInstance(
  new Ge(),
  de.getInstance(),
  Ie.getInstance()
);
class Z {
  static instance = null;
  static sessionId;
  resources = /* @__PURE__ */ new Set();
  cache;
  static activeMetrics = /* @__PURE__ */ new Map();
  static processingDelay = 10;
  qualityOptions;
  workerCount;
  progTracker;
  workerPool;
  currentMemoryStrategy;
  completedPhases = /* @__PURE__ */ new Set();
  isProcessing;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  processedFramesCache;
  abort;
  gifWorkerPool;
  constructor(e, t, a, r, s, n, o) {
    Z.sessionId = e, this.progTracker = t, this.workerCount = o, this.cache = /* @__PURE__ */ new Map(), this.currentMemoryStrategy = this.MEMORY_STRATEGIES.MEDIUM, this.qualityOptions = n, this.workerPool = r, this.gifWorkerPool = s, this.processedFramesCache = /* @__PURE__ */ new Map(), this.isProcessing = !1, this.abort = new AbortController();
  }
  static getInstance(e, t, a, r, s, n, o) {
    return this.instance || (this.instance = new Z(
      e,
      t,
      a,
      r,
      s,
      n,
      o
    )), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  // Add to class properties
  MEMORY_STRATEGIES = {
    LOW: {
      maxMemoryUsage: 512 * 1024 * 1024,
      // 512MB
      batchSize: 3,
      workerCount: 2,
      cleanupThreshold: 0.7
    },
    MEDIUM: {
      maxMemoryUsage: 1024 * 1024 * 1024,
      // 1GB
      batchSize: 5,
      workerCount: 4,
      cleanupThreshold: 0.8
    },
    HIGH: {
      maxMemoryUsage: 2048 * 1024 * 1024,
      // 2GB
      batchSize: 8,
      workerCount: 6,
      cleanupThreshold: 0.9
    }
  };
  registerResource(e) {
    const t = { cleanup: e };
    return this.resources.add(t), () => {
      t.cleanup(), this.resources.delete(t);
    };
  }
  get(e) {
    return this.cache.get(e);
  }
  set(e, t) {
    this.cache.set(e, t);
  }
  clear() {
    this.cache.clear();
  }
  setProcessingDelay(e) {
    Z.processingDelay = e;
  }
  // Add public method to set quality options
  setQualityOptions(e) {
    this.qualityOptions = {
      ...this.qualityOptions,
      ...e
    }, console.debug("Quality options updated:", this.qualityOptions);
  }
  // Add these new methods
  async handleMemoryPressure(e) {
    const t = performance?.memory?.jsHeapSizeLimit || 2147483648, a = e / t;
    a > this.currentMemoryStrategy.cleanupThreshold && a > 0.9 && (this.currentMemoryStrategy = this.MEMORY_STRATEGIES.LOW, this.workerCount = this.currentMemoryStrategy.workerCount);
  }
  async cleanup() {
    this.resources.forEach((e) => e.cleanup()), this.resources.clear(), this.isProcessing = !1, this.abort.abort(), this.abort = new AbortController(), this.clear(), this.clearCache(), this.completedPhases.clear(), this.progTracker.reset();
  }
  validateInput(e, t, a) {
    if (!e?.length) throw new Error("No frames provided");
    if (!t) throw new Error("No background image URL provided");
    if (a !== void 0 && !Array.isArray(a))
      throw new Error("Invalid overlays format");
  }
  async cancel() {
    this.abort.abort(), await this.cleanup(), this.abort = new AbortController();
  }
  async clearCache() {
    this.processedFramesCache.clear();
  }
}
const Ye = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let Je = (w = 21) => {
  let e = "", t = crypto.getRandomValues(new Uint8Array(w |= 0));
  for (; w--; )
    e += Ye[t[w] & 63];
  return e;
};
class J {
  static instance = null;
  activeSessions = /* @__PURE__ */ new Map();
  static getInstance() {
    return this.instance || (this.instance = new J()), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  createSession() {
    const e = Je();
    return this.activeSessions.set(e, Date.now()), e;
  }
  endSession(e) {
    this.isValidSession(e) && this.activeSessions.delete(e);
  }
  isValidSession(e) {
    return this.activeSessions.has(e);
  }
  cleanup() {
    this.activeSessions.forEach((e, t) => {
      this.endSession(t);
    }), this.activeSessions.clear();
  }
}
J.getInstance();
const le = "gif.process-frame", he = "gif.encode";
class pe {
  static instance = null;
  workerPool;
  isInitialized = !1;
  activeWorkers = /* @__PURE__ */ new Set();
  constructor(e) {
    this.workerPool = e;
  }
  static getInstance(e) {
    return this.instance || (this.instance = new pe(e)), this.instance;
  }
  static destroyInstance() {
    this.instance?.cleanup(), this.instance = null;
  }
  async initialize() {
    this.isInitialized || (await this.workerPool.initialize(), await this.registerWorkerTasks(), this.isInitialized = !0);
  }
  async processFrameInWorker(e) {
    return this.isInitialized || await this.initialize(), this.workerPool.runTask(le, e, 3e4);
  }
  cleanupWorker(e) {
    this.activeWorkers.delete(e), e.terminate();
  }
  async cleanup() {
    this.activeWorkers.forEach((e) => {
      e.terminate();
    }), this.activeWorkers.clear(), this.isInitialized = !1;
  }
  handleWorkerMessage(e, t) {
    const a = this.workerPool.executingTasks.get(e);
    a && (clearTimeout(a.timeoutId), this.workerPool.executingTasks.delete(e), this.workerPool.markWorkerAvailable(e), t.data.type === "success" ? a.resolve(t.data.result) : t.data.type === "error" && a.reject(new Error(t.data.error)));
  }
  async encodeGIFInWorker(e) {
    return this.isInitialized || await this.initialize(), this.workerPool.runTask(he, e, 3e4);
  }
  async registerWorkerTasks() {
    this.workerPool.hasTask(le) || await this.workerPool.registerTask(
      le,
      async (e) => this.dispatchToBrowserWorker({
        type: "processFrame",
        frame: e
      })
    ), this.workerPool.hasTask(he) || await this.workerPool.registerTask(
      he,
      async (e) => this.dispatchToBrowserWorker(e)
    );
  }
  async dispatchToBrowserWorker(e) {
    return new Promise((t, a) => {
      const r = new Worker(y.WORKER_PATH);
      this.activeWorkers.add(r), r.onmessage = (s) => {
        t(s.data), this.cleanupWorker(r);
      }, r.onerror = (s) => {
        a(s), this.cleanupWorker(r);
      }, r.postMessage(e);
    });
  }
}
class K {
  static instance = null;
  workerCount;
  pixelArtHandler;
  gifAnalyzer;
  constructor(e, t, a) {
    this.workerCount = e, this.pixelArtHandler = t, this.gifAnalyzer = a;
  }
  static getInstance(e, t, a) {
    return this.instance || (this.instance = new K(e, t, a)), this.instance;
  }
  destroyInstance() {
    K.instance = null;
  }
  normalizePatchForImageData(e) {
    return e.buffer instanceof ArrayBuffer ? e : new Uint8ClampedArray(e);
  }
  /**
   * Enhances the color table based on quality and enhancement settings.
   * @param colorTable - The original color table.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The enhanced color table.
   */
  enhanceColorTable(e, t, a) {
    const r = Q[a];
    return e.map((s) => {
      const [n, o, c] = s;
      if (a === "FIRE" && t && n > o && n > c)
        return [
          Math.min(255, n * 1.2),
          o * 0.9,
          c * 0.8
        ];
      if (t) {
        const l = r.colors / 256;
        return [
          Math.min(255, n * l),
          Math.min(255, o * l),
          Math.min(255, c * l)
        ];
      }
      return [n, o, c];
    });
  }
  async createImgBitmap(e, t) {
    const a = await this.gifAnalyzer.detectPixelArtInAllFrames(e);
    if (a) {
      const n = this.gifAnalyzer.analyzeGIFFrameDimensions(e);
      e = e.map((o, c) => this.pixelArtHandler.processPixelArtFrame(o, n, c));
    }
    const r = document.createElement("canvas");
    r.width = y.TARGET_SIZE, r.height = y.TARGET_SIZE;
    const s = r.getContext("2d", { alpha: !0, willReadFrequently: !0 });
    if (!s) throw new Error("Failed to get buffer context");
    return Promise.all(e.map(async (n, o) => {
      const { width: c, height: l, left: d, top: i } = n.dims, g = document.createElement("canvas");
      g.width = c, g.height = l;
      const m = g.getContext("2d", { alpha: !0, willReadFrequently: !0 });
      if (!m) throw new Error("Failed to get frame context");
      m.putImageData(new ImageData(this.normalizePatchForImageData(n.patch), c, l), 0, 0);
      const h = document.createElement("canvas");
      h.width = y.TARGET_SIZE, h.height = y.TARGET_SIZE;
      const u = h.getContext("2d", { alpha: !0, willReadFrequently: !0 });
      if (!u) throw new Error("Failed to get composite context");
      n.disposalType === 2 ? u.clearRect(0, 0, h.width, h.height) : u.drawImage(r, 0, 0), a ? (u.imageSmoothingEnabled = !1, u.drawImage(g, d, i, c, l)) : (u.imageSmoothingEnabled = !0, u.imageSmoothingQuality = "high", u.drawImage(g, d, i, c, l)), t && (u.globalCompositeOperation = "source-over", u.drawImage(t, 0, 0, y.TARGET_SIZE, y.TARGET_SIZE)), s.clearRect(0, 0, r.width, r.height), s.drawImage(h, 0, 0);
      try {
        return {
          bitmap: await createImageBitmap(h),
          originalFrame: {
            ...n,
            delay: n.delay,
            dims: {
              width: y.TARGET_SIZE,
              height: y.TARGET_SIZE,
              top: 0,
              left: 0
            }
          }
        };
      } finally {
        g.remove(), h.remove();
      }
    }));
  }
  createCanvas(e, t) {
    if (typeof OffscreenCanvas < "u")
      return new OffscreenCanvas(e, t);
    const a = document.createElement("canvas");
    return a.width = e, a.height = t, a;
  }
  getCanvasContext(e) {
    const t = e.getContext("2d", { willReadFrequently: !0, alpha: !0 });
    if (!t) throw new Error("Failed to get canvas context");
    return t;
  }
  scaleFramePatch(e, t) {
    const a = this.createCanvas(e.dims.width, e.dims.height), r = this.getCanvasContext(a), s = new ImageData(this.normalizePatchForImageData(e.patch), e.dims.width, e.dims.height);
    if (r.putImageData(s, 0, 0), t.drawImage(a, 0, 0, y.TARGET_SIZE, y.TARGET_SIZE), a instanceof OffscreenCanvas) {
      const n = document.createElement("canvas");
      n.width = a.width, n.height = a.height;
      const o = n.getContext("2d", { willReadFrequently: !0 });
      if (o)
        return o.drawImage(a, 0, 0), n;
    }
    return a;
  }
  overlayStaticImage(e, t) {
    e.globalCompositeOperation = "source-over", e.drawImage(t, 0, 0, y.TARGET_SIZE, y.TARGET_SIZE);
  }
  /**
       * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
       * @param frame - The parsed GIF frame to optimize.
       * @param enhanceColors - Whether to enhance colors.
       * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
       * @returns The optimized frame.
       */
  async preOptimizeGifFrame(e, t = !1, a = "HIGH") {
    const r = H.prototype.analyzePixelArtFrame(e);
    if (r.isPixelArt)
      return {
        ...e,
        patch: e.patch,
        // Keep original patch data
        disposalType: r.disposalType,
        delay: e.delay
      };
    const s = { ...Q[a] };
    r.hasTransparency && (s.preserveAlpha = !0, s.alphaThreshold = r.needsDisposal ? 220 : 128, s.disposalMethod = r.needsDisposal ? 2 : 1);
    const n = await this.optimizePatch(
      e.patch,
      e.transparentIndex,
      a,
      r
    );
    if (!t || !e.colorTable)
      return { ...e, patch: n };
    const o = this.enhanceColorTable(
      e.colorTable,
      t,
      a
    );
    return {
      ...e,
      colorTable: o,
      patch: n,
      disposalType: e.disposalType ? e.disposalType : s?.disposalMethod ? s.disposalMethod : 2
    };
  }
  calculateUniformDimensions(e) {
    const t = e.frameExtras.individualFrameSizes, a = Math.max(...t.map((n) => n.width)), r = Math.max(...t.map((n) => n.height)), s = Math.min(
      y.TARGET_SIZE / a,
      y.TARGET_SIZE / r
    );
    return {
      width: Math.round(a * s),
      height: Math.round(r * s),
      scale: s
    };
  }
  /**
  * Optimizes the patch array by handling transparency with worker pools.
  */
  async optimizePatch(e, t, a, r) {
    const s = Q[a], n = Math.ceil(e.length / (this.workerCount * 4)) * 4, o = [];
    for (let i = 0; i < e.length; i += n)
      o.push(e.subarray(i, Math.min(i + n, e.length)));
    const c = await Promise.all(
      o.map((i) => this.processChunk(i, t, s, r))
    ), l = new Uint8ClampedArray(e.length);
    let d = 0;
    for (const i of c)
      l.set(i, d), d += i.length;
    return l;
  }
  /**
   * Process a single chunk of the patch data
   */
  processChunk(e, t, a, r) {
    const s = new Uint8ClampedArray(e.length);
    if (r.isPixelArt)
      return s.set(e), s;
    const n = 220, { colorEnhancement: o } = a;
    for (let c = 0; c < e.length; c += 4) {
      const l = e[c + 3], d = e[c], i = e[c + 1], g = e[c + 2];
      l < n || t === d ? (s[c] = 0, s[c + 1] = 0, s[c + 2] = 0, s[c + 3] = 0) : (s[c] = Math.min(255, d * (o?.red ?? 1)), s[c + 1] = Math.min(255, i * (o?.green ?? 1)), s[c + 2] = Math.min(255, g * (o?.blue ?? 1)), s[c + 3] = 255);
    }
    return s;
  }
}
class et {
  retries;
  delay;
  backoffFactor;
  constructor(e = 3, t = 500, a = 2) {
    this.retries = e, this.delay = t, this.backoffFactor = a;
  }
  async execute(e) {
    let t = 0, a = this.delay;
    for (; t < this.retries; )
      try {
        return await e();
      } catch (r) {
        if (t++, t >= this.retries) throw r;
        await this.delayExecution(a), a *= this.backoffFactor;
      }
    throw new Error("RetryHandler exhausted all retries");
  }
  delayExecution(e) {
    return new Promise((t) => setTimeout(t, e));
  }
}
async function Te(w, e, t = 3, a = 500) {
  return new et(t, a).execute(() => fetch(w, e));
}
function ke() {
  return typeof navigator < "u" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
}
class b {
  static instance = null;
  static sharedWorkerPool = null;
  static sharedGifWorkerPool = null;
  static activeInstanceCount = 0;
  sessionId;
  CONSTANTS = y;
  workerPath = y.WORKER_PATH;
  workerScript;
  imageProcessor;
  imgManager;
  progTracker;
  pixelArtHandler;
  workerManager;
  qualityManager;
  memoryManager;
  progManager;
  frameProcessor;
  sessionManager;
  qualityAnalyzer;
  //private readonly rwp: RobustWorkerPool;
  gifWorkerPool;
  workerPool;
  canvas;
  //private webWrkr: Worker;
  abort;
  completedPhases;
  processedFramesCache;
  canvasPool;
  workerCount;
  isProcessing = !1;
  processingStartTime = 0;
  framesProcessed = 0;
  averageFrameTime = 0;
  totalFrames = 0;
  frameStartTime = 0;
  frameProcessingTimes = [];
  totalFramesCount = 0;
  processedFramesCount = 0;
  phaseStartTimes = {};
  streamController = null;
  qualityOptions = {
    allowAutoDetect: !0,
    memoryAware: !0
  };
  static getInstance(e, t) {
    return b.instance || (b.instance = new b(e, t)), b.instance;
  }
  static async destroyInstance() {
    b.instance && (await b.instance.cleanup(), b.instance = null);
  }
  constructor(e = Math.min(6, ke()), t) {
    this.isProcessing = !1;
    const r = t ?? (typeof window < "u" ? void 0 : this.workerPath);
    this.workerScript = r, b.activeInstanceCount += 1, this.sessionManager = new J(), this.sessionId = this.sessionManager.createSession(), this.workerPool = b.sharedWorkerPool ?? new de(e, r), b.sharedWorkerPool = this.workerPool, typeof window < "u" && console.debug("[GIFProcessor] Worker paths:", {
      requested: r ?? "(inline)",
      current: window.location.pathname,
      full: r ? new URL(r, window.location.origin).href : "(inline)"
    }), this.progTracker = new Ke(), this.progManager = new Ge(), this.workerManager = new pe(this.workerPool), this.abort = new AbortController(), this.completedPhases = /* @__PURE__ */ new Set(), this.gifWorkerPool = b.sharedGifWorkerPool ?? new de(Math.ceil(e / 2), r), b.sharedGifWorkerPool = this.gifWorkerPool, console.debug("GifWorkerPool initialized:", this.gifWorkerPool.stats), this.workerCount = Math.min(ke(), e), this.memoryManager = new Z(
      this.sessionId,
      this.progTracker,
      e,
      this.workerPool,
      this.gifWorkerPool,
      this.qualityOptions,
      this.workerCount
    ), this.pixelArtHandler = new H(), this.qualityManager = new W(), this.canvasPool = new Ie(
      y.POOL_SIZE,
      y.CANVAS_PER_SIZE,
      y.MEMORY_LIMIT
    ), this.imageProcessor = new K(
      this.workerCount,
      this.pixelArtHandler,
      G
    ), this.frameProcessor = new me(
      this.pixelArtHandler,
      this.imageProcessor,
      this.canvasPool,
      G,
      this.workerPool,
      this.workerCount
    ), this.imgManager = new Y(
      this.progManager,
      this.workerPool,
      this.canvasPool
    ), this.qualityAnalyzer = new ue(
      this.qualityManager,
      G
    ), this.processedFramesCache = /* @__PURE__ */ new Map(), this.canvas = this.canvasPool.getCanvas(
      y.WORKING_SIZE,
      y.WORKING_SIZE
    ), console.debug(
      "GIFProcessor initialized with pool size:",
      e,
      "Workercount:",
      this.workerCount
    ), this.memoryManager.currentMemoryStrategy = this.memoryManager.MEMORY_STRATEGIES.MEDIUM;
  }
  createGIF(e, t = !1) {
    if (!e.length) throw new Error("No frames provided");
    const a = {
      workers: this.workerScript ? this.workerCount : 0,
      quality: 1,
      transparent: null,
      background: null,
      // Keep background null
      dispose: 2,
      // Use dispose 2 to properly clear between frames
      dither: !1,
      debug: !0,
      repeat: 0,
      width: y.TARGET_SIZE,
      height: y.TARGET_SIZE
    };
    this.workerScript && (a.workerScript = this.workerScript);
    const r = new ye(a);
    return new Promise((s, n) => {
      r.on("progress", (c) => {
        const l = Math.round(c * 100);
        this.progManager.updatePhase(
          P.ENCODING.id,
          l,
          `Encoding: ${l}%`
        );
      }), r.on("finished", (c) => {
        if (!c || !c.size) {
          n(new Error("Generated GIF is empty"));
          return;
        }
        console.debug("[GIF] Generation complete:", {
          size: `${Math.round(c.size / 1024)}KB`,
          type: c.type
        }), e.forEach((l) => l.bitmap.close()), this.progManager.resetProgress(), this.progTracker.completePhase(P.ENCODING.id), s(c);
      }), r.on("error", (c) => {
        console.error("[GIF] Encoding error:", c), this.progManager.resetProgress(), n(c);
      });
      const o = e.map(
        (c) => this.workerPool.addTask(async () => {
          const l = document.createElement("canvas");
          l.width = y.TARGET_SIZE, l.height = y.TARGET_SIZE;
          const d = l.getContext("2d", {
            alpha: !0,
            willReadFrequently: !0
          });
          d && (d.clearRect(0, 0, l.width, l.height), d.globalCompositeOperation = "copy", d.drawImage(c.bitmap, 0, 0), r.addFrame(l, {
            delay: c.originalFrame.delay,
            // Use consistent delay
            dispose: c.originalFrame.disposalType || 2,
            transparent: !0
          }));
        })
      );
      Promise.all(o).then(() => {
        console.debug("[GIF] Starting render..."), r.render();
      }).catch(n);
    });
  }
  async processFramesFromFrameProcessor(e, t) {
    return await this.frameProcessor.processFramesInWorkers(
      e,
      t
    );
  }
  async streamGIF(e, t, a, r) {
    if (this.isProcessing)
      return Promise.reject(new Error("GIF processing already in progress"));
    this.isProcessing = !0;
    try {
      const { frames: s, metadata: n, quality: o } = await this.analyzeGIF(e);
      this.memoryManager.validateInput(s, t, a);
      const { readable: c, writable: l } = new TransformStream(), d = l.getWriter();
      return (async () => {
        try {
          const i = [];
          let g;
          const m = await this.imgManager.loadAndCreateStaticImage(
            t,
            a
          ), h = G.analyzeGIFFrameDimensions(s);
          if (n.isPixelArt || h.hasVariableSize) {
            const u = s.map(
              (f, v) => this.pixelArtHandler.processPixelArtFrame(
                f,
                h,
                v
              )
            ), p = await Promise.all(
              u.map(
                async (f) => this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    f,
                    !0,
                    "PIXEL"
                  )
                )
              )
            );
            g = await this.imageProcessor.createImgBitmap(
              p,
              m
            );
          } else {
            const u = await Promise.all(
              s.map(
                async (p) => this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    p,
                    !0,
                    o || "HIGH"
                  )
                )
              )
            );
            g = await this.imageProcessor.createImgBitmap(
              u,
              m
            );
          }
          d.write(
            new TextEncoder().encode(
              JSON.stringify({
                status: "Processing frame",
                frameIndex: i.length
              }) + `
`
            )
          ), this.progManager.updatePhase(
            P.PROCESSING.id,
            100,
            "Frame processing complete"
          ), await this.createGIFStream(g, d);
        } catch (i) {
          console.error("GIF streaming failed:", i), d.abort(i), r?.(i instanceof Error ? i : new Error(String(i)));
        }
      })(), c;
    } catch (s) {
      throw console.error("GIF streaming initialization failed:", s), r?.(s instanceof Error ? s : new Error(String(s))), s;
    }
  }
  async createGIFStream(e, t, a = {
    width: 400,
    height: 300
  }) {
    let r = null, s = null;
    const n = e.map((o) => o.originalFrame);
    e.map((o) => o.bitmap);
    try {
      const o = G.analyzeGIFFrameDimensions(n), c = e[0];
      if (!c?.bitmap)
        throw new Error("No valid frames to process");
      const l = Math.min(
        a.width / o.maxWidth,
        a.height / o.maxHeight
      ), d = Math.round(c.bitmap.width * l), i = Math.round(c.bitmap.height * l), g = Math.floor((a.width - d) / 2), m = Math.floor((a.height - i) / 2), h = {
        workers: this.workerScript ? this.workerCount : 0,
        quality: 10,
        width: a.width,
        height: a.height,
        transparent: !0,
        background: null,
        dispose: 2
      };
      this.workerScript && (h.workerScript = this.workerScript);
      const u = new ye(h);
      if (r = document.createElement("canvas"), r.width = a.width, r.height = a.height, s = r.getContext("2d", {
        alpha: !0,
        willReadFrequently: !0
      }), !s) throw new Error("Failed to get canvas context");
      for (let p = 0; p < e.length; p++) {
        const f = e[p];
        f.bitmap && (s.clearRect(0, 0, a.width, a.height), s.drawImage(
          f.bitmap,
          g,
          m,
          d,
          i
        ), u.addFrame(s, {
          copy: !0,
          delay: f.originalFrame?.delay || 100,
          dispose: f.originalFrame?.disposalType || 2
        }), t.write(
          new TextEncoder().encode(
            JSON.stringify({
              type: "progress",
              frameIndex: p + 1,
              total: e.length,
              dimensions: {
                width: d,
                height: i,
                containerWidth: a.width,
                containerHeight: a.height,
                xOffset: g,
                yOffset: m
              }
            }) + `
`
          )
        ));
      }
      return new Promise((p, f) => {
        u.on("finished", async (v) => {
          try {
            const E = URL.createObjectURL(v);
            await t.write(
              new TextEncoder().encode(
                JSON.stringify({
                  type: "complete",
                  url: E,
                  dimensions: { width: d, height: i }
                }) + `
`
              )
            ), await t.close(), p();
          } catch (E) {
            f(E);
          }
        }), u.on("error", f), u.render();
      });
    } catch (o) {
      throw console.error("GIF stream error:", o), t.abort(o), o;
    } finally {
      r && s && (s.clearRect(0, 0, r.width, r.height), r.width = 0, r.height = 0), e.forEach((o) => {
        o.bitmap && o.bitmap.close();
      });
    }
  }
  async generateGIF(e, t, a, r, s = {}, n) {
    (s.forceQuality || s.allowAutoDetect !== void 0) && this.memoryManager.setQualityOptions(s), this.totalFramesCount = e.length, this.processedFramesCount = 0;
    try {
      this.memoryManager.validateInput(e, t, a);
      const o = G.analyzeGIFFrameDimensions(e), c = await G.detectPixelArtInAllFrames(e);
      if (!r) {
        const m = o.maxWidth > y.TARGET_SIZE || o.maxHeight > y.TARGET_SIZE;
        c ? r = m || o.hasVariableSize ? "HIGHRESPIXEL" : "PIXEL" : r = m || o.hasVariableSize ? "HIGHRES" : "HIGH";
      }
      const l = Q[r];
      s.optimizeFrames && (l.disposalMethod = 1, l.synchronizeFrames = !0, l.blendMode = "copy"), console.debug("Selected quality settings:", l);
      let d;
      const i = await this.imgManager.loadAndCreateStaticImage(
        t,
        a
      );
      if (c || o.hasVariableSize) {
        const m = e.map(
          (u, p) => this.pixelArtHandler.processPixelArtFrame(u, o, p)
        ), h = await Promise.all(
          m.map(
            async (u) => this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                u,
                !0,
                "PIXEL"
              )
            )
          )
        );
        d = await this.imageProcessor.createImgBitmap(
          h,
          i
        );
      } else {
        const m = await Promise.all(
          e.map(
            async (h) => this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                h,
                !0,
                r || "HIGH"
              )
            )
          )
        );
        d = await this.imageProcessor.createImgBitmap(
          m,
          i
        );
      }
      const g = await this.createGIF(d, !1);
      return Object.values(P).forEach((m) => {
        this.completedPhases.has(m.id) || this.progManager.updatePhase(m.id, 100, `${m.name} complete`);
      }), this.progManager.resetProgress(), this.memoryManager.clear(), g;
    } catch (o) {
      throw console.error("GIF generation failed:", o), n?.(o instanceof Error ? o : new Error(String(o))), o;
    }
  }
  async extractFrames(e) {
    try {
      const t = this.imgManager.getCacheKey(e);
      if (this.processedFramesCache.has(t))
        return console.debug("Using cached frames for:", e), this.processedFramesCache.get(t);
      this.progManager.updatePhase(
        P.EXTRACTING.id,
        0,
        "Starting frame extraction..."
      );
      const r = await (await Te(e)).arrayBuffer(), s = await G.analyzeGIF(r);
      console.debug("GIF Analysis:", s), this.progManager.updatePhase(
        P.EXTRACTING.id,
        20,
        "Decompressing frames..."
      );
      const n = $.decompressFrames($.parseGIF(r), !0), o = this.qualityManager.selectOptimalQuality(s);
      return console.debug("Selected quality preset:", o), this.processedFramesCache.set(t, n), this.progManager.updatePhase(
        P.EXTRACTING.id,
        100,
        "Frame extraction complete"
      ), n;
    } catch (t) {
      throw console.error("Frame extraction failed:", t), t;
    }
  }
  async analyzeGIF(e) {
    try {
      const a = await (await Te(e)).arrayBuffer(), { quality: r, metadata: s } = await this.qualityAnalyzer.analyzeGifQuality(e);
      console.debug("[GIF Analysis]", s, "Quality:", r);
      const n = $.decompressFrames($.parseGIF(a), !0);
      return { metadata: s, quality: r, frames: n };
    } catch (t) {
      throw console.error("GIF analysis failed:", t), t;
    }
  }
  CHUNK_SIZE = 5;
  // Process frames in smaller chunks
  MEMORY_LIMIT = 500 * 1024 * 1024;
  // 500MB limit
  async processFramesInChunks(e) {
    const t = [];
    for (let a = 0; a < e.length; a += this.CHUNK_SIZE) {
      const r = e.slice(a, a + this.CHUNK_SIZE), s = await Promise.all(
        r.map((n) => this.frameProcessor.processFrameOG(n))
      );
      t.push(...s), await new Promise((n) => setTimeout(n, 0));
    }
    return t;
  }
  async processFramesInWorkers(e) {
    const t = G.analyzeGIFFrameDimensions(e), a = e.map(
      (n) => this.pixelArtHandler.processPixelArtFrame(n, t, 0)
    ), r = Math.ceil(a.length / this.workerCount), s = [];
    for (let n = 0; n < a.length; n += r)
      s.push(a.slice(n, n + r));
    return (await Promise.all(
      s.map(async (n) => this.workerPool.addTask(async () => Promise.all(
        n.map(
          async (o) => this.frameProcessor.processFrame(
            await this.imageProcessor.preOptimizeGifFrame(
              o,
              !0,
              "HIGH"
            ),
            null
          )
        )
      )))
    )).flat();
  }
  cleanup() {
    this.isProcessing = !1, this.completedPhases.clear(), this.processedFramesCache.clear(), this.progManager.resetProgress(), this.memoryManager.cleanup?.(), this.sessionId && this.sessionManager.endSession(this.sessionId), this.sessionManager.cleanup(), b.activeInstanceCount = Math.max(
      0,
      b.activeInstanceCount - 1
    ), b.activeInstanceCount === 0 && (this.workerPool.terminate?.(!0), this.gifWorkerPool.terminate?.(!0), b.sharedWorkerPool = null, b.sharedGifWorkerPool = null);
  }
}
const st = b.getInstance();
export {
  S as AssetLoader,
  ge as AssetRegistry,
  ot as BrowserTaskAdapter,
  ct as CutEngine,
  b as GIFProcessor,
  lt as NamedClipPlanner,
  ht as PixelMatrixExporter,
  dt as PixelMatrixFileEmitter,
  gt as PreprocessPipeline,
  vt as RuntimeTaskRegistry,
  Et as SCANFORGE_PREPROCESS_TASKS,
  ut as SpriteAtlasExporter,
  mt as TimelineBuilder,
  pt as VeraShellExporter,
  ft as VideoFrameExtractor,
  de as WorkerPool,
  Pt as alignImage,
  Ct as alignImageSet,
  at as assetLoader,
  rt as assetRegistry,
  wt as createFlatBackgroundSpritePreprocess,
  xt as generatePreview,
  st as gifProcessor,
  St as registerScanForgePreprocessTasks,
  bt as splitMatrix
};
