import { R as K } from "./taskProtocol-BJL-xt0L.mjs";
function Z(a) {
  return a.map((t, e) => ({
    ...t,
    index: e
  }));
}
function tt(a) {
  let t = 0;
  const e = a.map((s, i) => {
    const o = Math.max(1, Math.round(s.durationMs || 0)), h = {
      ...s,
      index: i,
      timestampMs: t,
      durationMs: o
    };
    return t += o, h;
  }), r = t, n = e.length > 0 && r > 0 ? Math.max(1, Math.round(e.length * 1e3 / r)) : 1;
  return { frames: e, durationMs: r, fps: n };
}
class et {
  static cutByFrame(t, e, r, n = "clip") {
    if (t.frames.length === 0)
      throw new Error("Cannot cut an empty timeline");
    const s = Math.max(0, e), i = Math.min(t.frames.length - 1, r);
    if (i < s)
      throw new Error(
        `Invalid frame range: ${e}-${r}`
      );
    const o = Z(t.frames.slice(s, i + 1)), h = tt(o), c = {
      name: n,
      startFrame: 0,
      endFrame: h.frames.length - 1
    };
    return {
      ...t,
      id: `${t.id}:${n}`,
      fps: h.fps,
      durationMs: h.durationMs,
      frames: h.frames,
      clips: [c]
    };
  }
  static cutByTime(t, e, r, n = "clip") {
    if (t.frames.length === 0)
      throw new Error("Cannot cut an empty timeline");
    const s = Math.max(0, e), i = Math.max(s, r), o = t.frames.filter((h) => {
      const c = h.timestampMs;
      return h.timestampMs + h.durationMs > s && c <= i;
    });
    if (o.length === 0)
      throw new Error(`No frames found in range ${e}-${r}ms`);
    return this.cutByFrame(
      { ...t, frames: o },
      0,
      o.length - 1,
      n
    );
  }
  static sampleEvery(t, e, r = "sampled") {
    if (e <= 0)
      throw new Error("step must be greater than 0");
    const n = t.frames.filter((s, i) => i % e === 0);
    if (n.length === 0)
      throw new Error("Sampling removed all frames");
    return this.cutByFrame(
      { ...t, frames: n },
      0,
      n.length - 1,
      r
    );
  }
}
const rt = ["idle", "walk", "blink", "react"], nt = {
  idle: [0, 0.35],
  walk: [0.35, 0.7],
  blink: [0.7, 0.85],
  react: [0.85, 1]
};
function $(a, t) {
  return Math.max(0, Math.min(t, a));
}
function at(a, t) {
  let e = 0;
  for (let r = t.startFrame; r <= t.endFrame; r += 1)
    e += a.frames[r]?.durationMs ?? 0;
  return e;
}
class st {
  static plan(t, e = {}) {
    if (!t.frames.length)
      throw new Error("Cannot plan clips for an empty timeline");
    const r = t.frames.length - 1, n = Math.max(1, e.minClipFrames ?? 1);
    return rt.map((s) => {
      const i = e.clips?.[s];
      if (i?.startFrame !== void 0 || i?.endFrame !== void 0) {
        const u = $(i.startFrame ?? 0, r), d = $(
          i.endFrame ?? Math.max(u, u + n - 1),
          r
        );
        return {
          name: s,
          startFrame: Math.min(u, d),
          endFrame: Math.max(u, d)
        };
      }
      const [o, h] = nt[s], c = $(
        Math.floor(o * t.frames.length),
        r
      ), l = $(
        Math.max(
          c + n - 1,
          Math.ceil(h * t.frames.length) - 1
        ),
        r
      );
      return {
        name: s,
        startFrame: c,
        endFrame: l
      };
    });
  }
  static split(t, e = {}) {
    const r = this.plan(t, e), n = {};
    for (const s of r)
      n[s.name] = et.cutByFrame(
        t,
        s.startFrame,
        s.endFrame,
        s.name
      );
    return n;
  }
  static summarize(t, e = {}) {
    return this.plan(t, e).map((r) => ({
      ...r,
      durationMs: at(t, r)
    }));
  }
}
function it(a, t, e, r, n) {
  return r === 0 ? 0 : Math.round(a * 0.299 + t * 0.587 + e * 0.114) >= n ? 1 : 0;
}
function ot(a, t, e, r) {
  return r === 0 ? 0 : Math.round(a * 0.299 + t * 0.587 + e * 0.114);
}
function ct(a) {
  const t = a.replace(/[^a-zA-Z0-9_]/g, "_");
  return t ? /^[0-9]/.test(t) ? `_${t}` : t : "FRAME";
}
function ht(a, t, e) {
  const { data: r, width: n, height: s } = a, i = new Array(s);
  for (let o = 0; o < s; o += 1) {
    const h = new Array(n);
    for (let c = 0; c < n; c += 1) {
      const l = (o * n + c) * 4, u = r[l], d = r[l + 1], g = r[l + 2], m = r[l + 3];
      t === "alpha-mask" ? h[c] = m > 0 ? 1 : 0 : t === "binary" ? h[c] = it(u, d, g, m, e) : h[c] = ot(u, d, g, m);
    }
    i[o] = h;
  }
  return i;
}
function lt(a, t) {
  const e = t.frameIndexes?.filter(
    (i) => Number.isInteger(i) && i >= 0 && i < a
  );
  if (e && e.length > 0)
    return Array.from(new Set(e)).sort((i, o) => i - o);
  const r = Math.max(1, t.frameStride ?? 1), n = t.maxFrames ?? a, s = [];
  for (let i = 0; i < a && s.length < n; i += r)
    s.push(i);
  return s;
}
function ut(a) {
  return `[
${a.map((e) => `  [${e.join(", ")}]`).join(`,
`)}
]`;
}
function dt(a) {
  const t = [];
  for (const e of a)
    for (const r of e)
      t.push(r);
  return t;
}
function mt(a) {
  const t = new Uint8Array(Math.ceil(a.length / 8));
  for (let e = 0; e < a.length; e += 1)
    a[e] > 0 && (t[Math.floor(e / 8)] |= 1 << 7 - e % 8);
  return t;
}
function gt(a) {
  if (!a.length) return "";
  const t = 32, e = [];
  for (let r = 0; r < a.length; r += t) {
    const n = Array.from(a.slice(r, r + t));
    e.push(`  ${n.join(", ")}`);
  }
  return `
${e.join(`,
`)}
`;
}
function ft(a, t, e, r, n, s) {
  const i = n.map((c) => `export const ${`${a}_FRAME_${c.index}`}: number[][] = ${ut(c.pixels)};`), o = s ? `export const ${a}_META = ${JSON.stringify(
    {
      mode: e,
      threshold: r,
      frameCount: n.length,
      sourceTimelineId: t.id,
      width: t.width,
      height: t.height
    },
    null,
    2
  )} as const;` : "", h = `export const ${a}_FRAMES: number[][][] = [
${n.map((c) => `  ${a}_FRAME_${c.index}`).join(`,
`)}
];`;
  return [o, ...i, h].filter(Boolean).join(`

`);
}
function pt(a, t, e, r, n, s) {
  const i = s ? `export const ${a}_PACKED_META = ${JSON.stringify(
    {
      mode: e,
      threshold: r,
      frameCount: n.length,
      sourceTimelineId: t.id,
      width: t.width,
      height: t.height,
      encoding: "bit-packed-msb"
    },
    null,
    2
  )} as const;` : "", o = `export function decodeBitPackedFrame(bytes: Uint8Array, width: number, height: number): number[][] {
  const rows: number[][] = new Array(height);
  for (let y = 0; y < height; y += 1) {
    const row: number[] = new Array(width);
    for (let x = 0; x < width; x += 1) {
      const bitIndex = y * width + x;
      const byte = bytes[Math.floor(bitIndex / 8)] ?? 0;
      const bit = (byte >> (7 - (bitIndex % 8))) & 1;
      row[x] = bit;
    }
    rows[y] = row;
  }
  return rows;
}`, h = n.map((l) => `export const ${`${a}_FRAME_${l.index}_BITS`} = new Uint8Array([${gt(l.bytes)}]);`), c = `export const ${a}_PACKED_FRAMES = [
${n.map((l) => {
    const u = `${a}_FRAME_${l.index}_BITS`;
    return `  { index: ${l.index}, width: ${l.width}, height: ${l.height}, timestampMs: ${l.timestampMs}, durationMs: ${l.durationMs}, bitLength: ${l.bitLength}, bytes: ${u} }`;
  }).join(`,
`)}
] as const;`;
  return [i, o, ...h, c].filter(Boolean).join(`

`);
}
class q {
  static exportTimeline(t, e = {}) {
    const r = e.mode ?? "binary", n = e.outputFormat ?? "matrix", s = Math.max(0, Math.min(255, e.threshold ?? 128)), i = ct(
      (e.constPrefix ?? t.id).toUpperCase()
    ), o = e.includeMetadataConst !== !1;
    if (n !== "matrix" && r === "grayscale")
      throw new Error(
        "Bit-packed output supports only binary/alpha-mask modes. Use mode 'binary' or 'alpha-mask'."
      );
    const c = lt(t.frames.length, e).map((m) => {
      const f = t.frames[m];
      return {
        index: f.index,
        width: f.width,
        height: f.height,
        timestampMs: f.timestampMs,
        durationMs: f.durationMs,
        pixels: ht(f.imageData, r, s)
      };
    }), l = n === "bit-packed" ? void 0 : ft(
      i,
      t,
      r,
      s,
      c,
      o
    ), u = n === "matrix" ? void 0 : c.map((m) => {
      const f = mt(dt(m.pixels));
      return {
        index: m.index,
        width: m.width,
        height: m.height,
        timestampMs: m.timestampMs,
        durationMs: m.durationMs,
        bitLength: m.width * m.height,
        bytes: f
      };
    }), d = u ? pt(
      i,
      t,
      r,
      s,
      u,
      o
    ) : void 0, g = n === "matrix" ? l ?? "" : n === "bit-packed" ? d ?? "" : [l, d].filter(Boolean).join(`

`);
    return {
      format: n,
      constModule: g,
      frames: c,
      packedFrames: u,
      matrixModule: l,
      packedModule: d
    };
  }
}
function L(a) {
  return a.replace(/[^a-zA-Z0-9_-]/g, "_") || "pixel_matrix";
}
function D(a) {
  return a.endsWith(".ts") ? a : `${a}.ts`;
}
class _t {
  static emitModules(t, e = {}, r = {}) {
    const n = L(r.baseFileName ?? t.id), s = r.splitByClip ?? !1, i = r.includeIndexFile ?? s;
    if (!s) {
      const c = q.exportTimeline(t, e);
      return [
        {
          fileName: D(`${n}.pixels`),
          content: c.constModule,
          format: c.format,
          frameCount: c.frames.length
        }
      ];
    }
    const o = [], h = [];
    for (const c of t.clips) {
      const l = [];
      for (let f = c.startFrame; f <= c.endFrame; f += 1)
        f >= 0 && f < t.frames.length && l.push(f);
      if (!l.length) continue;
      const u = q.exportTimeline(t, {
        ...e,
        frameIndexes: l
      }), d = L(c.name.toLowerCase()), g = `${n}.${d}.pixels`, m = D(g);
      o.push({
        fileName: m,
        content: u.constModule,
        format: u.format,
        clipName: c.name,
        frameCount: u.frames.length
      }), h.push(`export * from "./${g}";`);
    }
    return i && h.length > 0 && o.push({
      fileName: D(`${n}.pixels.index`),
      content: h.join(`
`),
      format: "matrix",
      frameCount: 0
    }), o;
  }
}
function wt(a) {
  return {
    ...a,
    preprocess: a.preprocess ? { ...a.preprocess } : void 0
  };
}
function S(a) {
  return Math.max(0, Math.min(255, Math.round(a)));
}
function xt(a) {
  return a ?? [24, 24, 24];
}
function Mt(a, t) {
  return [a[t], a[t + 1], a[t + 2], a[t + 3]];
}
function yt(a, t) {
  const e = a[0] - t[0], r = a[1] - t[1], n = a[2] - t[2];
  return Math.sqrt(e * e + r * r + n * n);
}
function V(a) {
  const { data: t, width: e, height: r } = a, n = [
    0,
    (e - 1) * 4,
    (r - 1) * e * 4,
    ((r - 1) * e + (e - 1)) * 4
  ];
  let s = 0, i = 0, o = 0, h = 0;
  for (const c of n) {
    const [l, u, d] = Mt(t, c);
    s += l, i += u, o += d, h += 1;
  }
  return [
    S(s / Math.max(1, h)),
    S(i / Math.max(1, h)),
    S(o / Math.max(1, h))
  ];
}
function kt(a) {
  const { imageData: t, tolerance: e } = a, r = xt(a.keyColor) ?? V(t), n = new Uint8ClampedArray(t.width * t.height), { data: s } = t;
  for (let i = 0, o = 0; i < s.length; i += 4, o += 1) {
    const h = s[i + 3];
    if (h <= 0) {
      n[o] = 0;
      continue;
    }
    const c = yt([s[i], s[i + 1], s[i + 2]], r);
    n[o] = c <= e ? 0 : h;
  }
  return n;
}
function Ft(a, t, e, r) {
  if (r <= 0) return a;
  const n = new Uint8ClampedArray(a.length), s = r * 2 + 1, i = s * s;
  for (let o = 0; o < e; o += 1)
    for (let h = 0; h < t; h += 1) {
      let c = 0;
      for (let l = -r; l <= r; l += 1) {
        const u = Math.max(0, Math.min(e - 1, o + l));
        for (let d = -r; d <= r; d += 1) {
          const g = Math.max(0, Math.min(t - 1, h + d));
          c += a[u * t + g];
        }
      }
      n[o * t + h] = S(c / i);
    }
  return n;
}
function vt(a, t) {
  const e = new ImageData(
    new Uint8ClampedArray(a.data),
    a.width,
    a.height
  );
  for (let r = 0, n = 0; r < e.data.length; r += 4, n += 1)
    e.data[r + 3] = t[n];
  return e;
}
function bt(a, t, e, r) {
  let n = t, s = e, i = -1, o = -1;
  for (let h = 0; h < e; h += 1)
    for (let c = 0; c < t; c += 1)
      a[h * t + c] < r || (c < n && (n = c), h < s && (s = h), c > i && (i = c), h > o && (o = h));
  return i < n || o < s ? {
    x: 0,
    y: 0,
    width: t,
    height: e,
    confidence: 0
  } : {
    x: n,
    y: s,
    width: i - n + 1,
    height: o - s + 1,
    confidence: 1
  };
}
function Ct(a) {
  const { frame: t, targetWidth: e, targetHeight: r, keepFrameSize: n, subjectBox: s } = a, i = n ? t.width : e, o = n ? t.height : r, h = document.createElement("canvas");
  h.width = i, h.height = o;
  const c = h.getContext("2d", { willReadFrequently: !0 });
  if (!c)
    return {
      imageData: t.imageData,
      width: t.width,
      height: t.height,
      anchor: {
        x: t.width / 2,
        y: t.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  const l = document.createElement("canvas");
  l.width = t.width, l.height = t.height;
  const u = l.getContext("2d", { willReadFrequently: !0 });
  if (!u)
    return {
      imageData: t.imageData,
      width: t.width,
      height: t.height,
      anchor: {
        x: t.width / 2,
        y: t.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  u.putImageData(t.imageData, 0, 0);
  const d = s ?? {
    x: 0,
    y: 0,
    width: t.width,
    height: t.height
  }, g = d.x + d.width / 2, m = d.y + d.height / 2, f = i / 2, p = o / 2, x = f - g, k = p - m;
  return c.clearRect(0, 0, i, o), c.drawImage(l, x, k), {
    imageData: c.getImageData(0, 0, i, o),
    width: i,
    height: o,
    anchor: {
      x: f,
      y: p,
      confidence: 1,
      label: "subject-center"
    }
  };
}
function Pt(a) {
  const t = Math.max(0, Math.min(441, a.keyTolerance ?? 42)), e = Math.max(
    0,
    Math.min(4, Math.round(a.featherRadius ?? 1))
  ), r = Math.max(
    0,
    Math.min(255, Math.round(a.alphaThreshold ?? 18))
  );
  return {
    enabled: !0,
    stages: [
      {
        id: "segment-foreground",
        run: (n) => {
          const s = a.keyColor ?? V(n.imageData), i = kt({
            imageData: n.imageData,
            keyColor: s,
            tolerance: t
          }), o = Ft(
            i,
            n.width,
            n.height,
            e
          ), h = vt(n.imageData, o), c = bt(
            o,
            n.width,
            n.height,
            r
          );
          return {
            imageData: h,
            preprocess: {
              alphaMask: o,
              subjectBox: c,
              diagnostics: {
                stage: "segment-foreground",
                keyColor: s,
                tolerance: t
              }
            }
          };
        }
      },
      {
        id: "center-canvas",
        run: (n) => {
          const s = Ct({
            frame: n,
            targetWidth: a.targetWidth,
            targetHeight: a.targetHeight,
            keepFrameSize: a.keepFrameSize ?? !1,
            subjectBox: n.preprocess?.subjectBox
          });
          return {
            imageData: s.imageData,
            width: s.width,
            height: s.height,
            preprocess: {
              ...n.preprocess ?? {},
              anchor: s.anchor
            }
          };
        }
      }
    ]
  };
}
class Tt {
  static async run(t, e) {
    const r = e?.enabled !== !1, n = r ? e?.stages ?? [] : [];
    if (!r || n.length === 0 || t.frames.length === 0)
      return {
        timeline: t,
        report: {
          enabled: r,
          stagesRun: n.map((o) => o.id),
          frameCount: t.frames.length
        }
      };
    const s = [];
    for (let o = 0; o < t.frames.length; o += 1) {
      let h = wt(t.frames[o]);
      for (const c of n) {
        const l = await c.run(h, {
          stageId: c.id,
          frameIndex: o,
          frameCount: t.frames.length,
          timeline: t
        });
        l && (l.imageData && (h.imageData = l.imageData), typeof l.width == "number" && (h.width = Math.max(1, Math.round(l.width))), typeof l.height == "number" && (h.height = Math.max(1, Math.round(l.height))), l.preprocess && (h.preprocess = {
          ...h.preprocess ?? {},
          ...l.preprocess
        }));
      }
      s.push({
        ...h,
        index: s.length
      });
    }
    return {
      timeline: {
        ...t,
        id: `${t.id}-preprocessed`,
        frames: s
      },
      report: {
        enabled: !0,
        stagesRun: n.map((o) => o.id),
        frameCount: s.length
      }
    };
  }
}
function Et(a, t) {
  return Math.floor((a + t - 1) / t);
}
class Rt {
  static async exportTimeline(t, e = {}) {
    if (!t.frames.length)
      throw new Error("Cannot export atlas from empty timeline");
    const r = e.framePadding ?? 2, n = e.maxAtlasWidth ?? 4096, s = e.maxAtlasHeight ?? 4096, i = Math.max(0.1, e.frameScale ?? 1), o = e.fitMode ?? "contain", h = e.backgroundFill ?? "", c = Math.max(...t.frames.map((w) => w.width)), l = Math.max(...t.frames.map((w) => w.height)), u = Math.max(1, Math.round(c * i)), d = Math.max(1, Math.round(l * i)), g = Math.max(
      1,
      Math.round(e.targetFrameWidth ?? u)
    ), m = Math.max(
      1,
      Math.round(e.targetFrameHeight ?? d)
    ), f = g + r * 2, p = m + r * 2, x = Math.max(1, Math.floor(n / f)), k = Et(t.frames.length, x), v = Math.min(n, x * f), y = k * p;
    if (y > s)
      throw new Error(
        `Atlas height ${y}px exceeds max ${s}px. Reduce frame count or increase limits.`
      );
    const F = document.createElement("canvas");
    F.width = v, F.height = y;
    const M = F.getContext("2d", { willReadFrequently: !0 });
    if (!M)
      throw new Error("Failed to acquire canvas context for atlas export");
    M.clearRect(0, 0, v, y);
    const X = t.frames.map((w, b) => {
      const T = b % x, J = Math.floor(b / x), E = T * f + r, R = J * p + r, C = document.createElement("canvas");
      C.width = w.width, C.height = w.height;
      const B = C.getContext("2d");
      if (!B)
        throw new Error("Failed to acquire frame canvas context");
      B.putImageData(w.imageData, 0, 0), h && (M.fillStyle = h, M.fillRect(E, R, g, m));
      const U = g / w.width * i, _ = m / w.height * i, P = o === "cover" ? Math.max(U, _) : o === "contain" ? Math.min(U, _) : 1, A = o === "stretch" ? g : w.width * P, W = o === "stretch" ? m : w.height * P, j = E + (g - A) / 2, H = R + (m - W) / 2;
      return o === "cover" ? (M.save(), M.beginPath(), M.rect(E, R, g, m), M.clip(), M.drawImage(C, j, H, A, W), M.restore()) : M.drawImage(C, j, H, A, W), {
        index: b,
        x: E,
        y: R,
        width: g,
        height: m,
        durationMs: w.durationMs,
        timestampMs: w.timestampMs
      };
    }), Q = {
      version: "1.0.0",
      frameCount: t.frames.length,
      atlasWidth: v,
      atlasHeight: y,
      frameWidth: g,
      frameHeight: m,
      framePadding: r,
      cellWidth: f,
      cellHeight: p,
      columns: x,
      rows: k,
      clips: e.clipName ? [
        {
          name: e.clipName,
          startFrame: 0,
          endFrame: t.frames.length - 1
        }
      ] : t.clips,
      frames: X
    }, Y = e.imageType ?? "image/png", G = e.imageQuality ?? 0.92;
    return { imageBlob: await new Promise((w, b) => {
      F.toBlob(
        (T) => {
          if (!T) {
            b(new Error("Failed to encode atlas image"));
            return;
          }
          w(T);
        },
        Y,
        G
      );
    }), manifest: Q };
  }
}
function N(a, t) {
  return new Promise((e, r) => {
    const n = () => {
      i(), e();
    }, s = () => {
      i(), r(new Error(`Video event failed: ${t}`));
    }, i = () => {
      a.removeEventListener(t, n), a.removeEventListener("error", s);
    };
    a.addEventListener(t, n, {
      once: !0
    }), a.addEventListener("error", s, { once: !0 });
  });
}
class $t {
  static async extractFrames(t, e = "video-timeline") {
    const {
      src: r,
      fps: n = 12,
      startMs: s = 0,
      endMs: i,
      maxFrames: o = 240,
      crossOrigin: h = "anonymous"
    } = t;
    if (!r)
      throw new Error("Video source is required");
    const c = document.createElement("video");
    c.preload = "auto", c.crossOrigin = h, c.muted = !0, c.playsInline = !0, c.src = r, await N(c, "loadedmetadata");
    const l = c.videoWidth, u = c.videoHeight;
    if (!l || !u)
      throw new Error("Failed to load video dimensions");
    const d = document.createElement("canvas");
    d.width = l, d.height = u;
    const g = d.getContext("2d", { willReadFrequently: !0 });
    if (!g)
      throw new Error("Failed to acquire canvas context for video extraction");
    const m = Math.max(
      s,
      i ?? Math.floor(c.duration * 1e3)
    ), f = Math.max(1, Math.floor(1e3 / n)), p = [];
    let x = Math.max(0, s);
    for (; x <= m && p.length < o; ) {
      c.currentTime = x / 1e3, await N(c, "seeked"), g.clearRect(0, 0, l, u), g.drawImage(c, 0, 0, l, u);
      const y = g.getImageData(0, 0, l, u);
      p.push({
        index: p.length,
        timestampMs: x,
        durationMs: f,
        width: l,
        height: u,
        imageData: y
      }), x += f;
    }
    if (!p.length)
      throw new Error("No frames extracted from video source");
    const k = p.reduce(
      (y, F) => y + F.durationMs,
      0
    ), v = {
      name: "full",
      startFrame: 0,
      endFrame: p.length - 1
    };
    return {
      id: e,
      sourceKind: "video",
      fps: n,
      durationMs: k,
      width: l,
      height: u,
      frames: p,
      clips: [v]
    };
  }
}
function St(a) {
  return a.buffer instanceof ArrayBuffer ? a : new Uint8ClampedArray(a);
}
function O(a, t, e, r, n) {
  const s = e.reduce((h, c) => h + c.durationMs, 0), i = e.length > 0 && s > 0 ? Math.max(1, Math.round(e.length * 1e3 / s)) : 1, o = {
    name: "full",
    startFrame: 0,
    endFrame: Math.max(0, e.length - 1)
  };
  return {
    id: a,
    sourceKind: t,
    fps: i,
    durationMs: s,
    width: r,
    height: n,
    frames: e,
    clips: [o]
  };
}
class jt {
  static fromGifFrames(t, e = "gif-timeline") {
    if (!t.length)
      throw new Error("No GIF frames provided");
    let r = 0;
    const n = t.map((i, o) => {
      const h = Math.max(10, Number(i.delay) || 100), c = new ImageData(
        St(i.patch),
        i.dims.width,
        i.dims.height
      ), l = {
        index: o,
        timestampMs: r,
        durationMs: h,
        width: i.dims.width,
        height: i.dims.height,
        imageData: c
      };
      return r += h, l;
    }), s = n[0];
    return O(e, "gif", n, s.width, s.height);
  }
  static async fromImageSource(t, e = "image-timeline", r = 1e3) {
    const n = t.width || t.width, s = t.height || t.height;
    if (!n || !s)
      throw new Error("Unable to derive dimensions from image source");
    const i = document.createElement("canvas");
    i.width = n, i.height = s;
    const o = i.getContext("2d", { willReadFrequently: !0 });
    if (!o)
      throw new Error("Failed to acquire 2D context for image timeline");
    o.clearRect(0, 0, n, s), o.drawImage(t, 0, 0, n, s);
    const h = o.getImageData(0, 0, n, s);
    return O(
      e,
      "image",
      [
        {
          index: 0,
          timestampMs: 0,
          durationMs: Math.max(1, r),
          width: n,
          height: s,
          imageData: h
        }
      ],
      n,
      s
    );
  }
  static async fromVideo(t, e = "video-timeline") {
    return $t.extractFrames(t, e);
  }
}
const It = {
  normal: "idle",
  focused: "walk",
  tired: "walk",
  alarmed: "react",
  sleeping: "blink",
  offline: "react"
};
function At(a, t) {
  return [a % t, Math.floor(a / t)];
}
function Wt(a, t) {
  if (t <= 1) return a;
  const e = [];
  for (let s = 0; s < a.frames.length; s += t) {
    const i = a.frames.slice(s, s + t);
    if (!i.length) continue;
    const o = i.reduce((c, l) => c + l.durationMs, 0), h = i[0];
    e.push({
      ...h,
      index: e.length,
      durationMs: o
    });
  }
  const r = Math.max(0, e.length - 1), n = a.clips.map((s) => {
    const i = Math.min(r, Math.floor(s.startFrame / t)), o = Math.min(r, Math.floor(s.endFrame / t));
    return {
      ...s,
      startFrame: Math.min(i, o),
      endFrame: Math.max(i, o)
    };
  });
  return {
    ...a,
    id: `${a.id}-ds${t}`,
    fps: a.fps / t,
    frames: e,
    clips: n
  };
}
class Ht {
  static async exportSpriteSheet(t, e) {
    const r = await Tt.run(
      t,
      e.preprocess
    ), n = r.timeline, s = e.maxFrames ?? 0, i = e.frameStride ?? 1, o = s > 0 ? Math.max(
      i,
      Math.ceil(n.frames.length / s)
    ) : i, h = Wt(
      n,
      o
    ), c = await Rt.exportTimeline(
      h,
      e
    ), l = st.summarize(h), u = /* @__PURE__ */ new Map();
    for (const p of l)
      u.set(p.name, p.startFrame);
    const d = {
      ...It,
      ...e.clipToExpression ?? {}
    }, g = {};
    for (const p of Object.keys(d)) {
      const x = d[p], k = u.get(x) ?? 0;
      g[p] = At(k, c.manifest.columns);
    }
    const m = {
      type: "sheet",
      url: e.atlasUrl,
      cellWidth: c.manifest.cellWidth,
      cellHeight: c.manifest.cellHeight,
      frames: g
    }, f = e.pixelMatrix?.enabled ? q.exportTimeline(h, e.pixelMatrix) : void 0;
    return {
      ...c,
      veraShellManifest: {
        schema: "vera-shell.sprite-sheet.v1",
        timelineId: h.id,
        atlas: c.manifest,
        sprite: m,
        clips: l.map((p) => ({
          name: p.name,
          startFrame: p.startFrame,
          endFrame: p.endFrame,
          durationMs: p.durationMs
        }))
      },
      pixelMatrix: f,
      preprocess: r.report
    };
  }
}
function Dt() {
  return typeof navigator < "u" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
}
class I {
  constructor(t = Math.max(
    1,
    Math.ceil(Dt())
  ), e) {
    this.maxWorkers = t, this.workerScript = e;
  }
  static instance = null;
  executingTasks = /* @__PURE__ */ new Map();
  availableWorkers = /* @__PURE__ */ new Set();
  taskRegistry = new K();
  queue = [];
  initialized = !1;
  shutdownRequested = !1;
  static getInstance(t, e) {
    return this.instance || (this.instance = new I(t, e)), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  get stats() {
    return {
      activeWorkers: this.executingTasks.size,
      availableWorkers: this.availableWorkers.size,
      maxWorkers: this.maxWorkers,
      queuedTasks: this.queue.length
    };
  }
  async initialize() {
    if (!this.initialized) {
      for (let t = 0; t < this.maxWorkers; t += 1)
        this.availableWorkers.add(t);
      this.shutdownRequested = !1, this.initialized = !0;
    }
  }
  async registerTask(t, e) {
    this.taskRegistry.register(t, e);
  }
  hasTask(t) {
    return this.taskRegistry.has(t);
  }
  async runTask(t, e, r = 3e4) {
    if (!this.taskRegistry.has(t))
      throw new Error(`Unknown worker task: ${t}`);
    return this.addTask(
      () => this.taskRegistry.run(t, e),
      r
    );
  }
  async addTask(t, e = 3e4) {
    if (this.initialized || await this.initialize(), this.shutdownRequested)
      throw new Error("Worker pool is shutting down");
    return new Promise((r, n) => {
      this.queue.push({
        task: t,
        resolve: r,
        reject: n,
        timeoutMs: e
      }), this.processQueue();
    });
  }
  markWorkerAvailable(t) {
    this.availableWorkers.add(t);
  }
  async terminate(t = !1) {
    if (this.shutdownRequested = !0, t)
      for (; this.queue.length > 0; )
        this.queue.shift()?.reject(new Error("Worker pool terminated"));
    for (const [, e] of this.executingTasks)
      clearTimeout(e.timeoutId), t && e.reject(new Error("Worker pool terminated"));
    this.executingTasks.clear(), this.availableWorkers.clear(), this.initialized = !1;
  }
  processQueue() {
    for (; this.queue.length > 0 && this.availableWorkers.size > 0; ) {
      const t = this.availableWorkers.values().next().value;
      if (t === void 0)
        return;
      this.availableWorkers.delete(t);
      const e = this.queue.shift();
      if (!e) {
        this.availableWorkers.add(t);
        return;
      }
      const r = setTimeout(() => {
        const n = this.executingTasks.get(t);
        n && (this.executingTasks.delete(t), n.reject(new Error("Task timed out")), this.markWorkerAvailable(t), this.processQueue());
      }, e.timeoutMs);
      this.executingTasks.set(t, {
        ...e,
        timeoutId: r
      }), this.executeTask(t, e, r);
    }
  }
  async executeTask(t, e, r) {
    try {
      const n = await e.task();
      clearTimeout(r), this.executingTasks.has(t) && e.resolve(n);
    } catch (n) {
      clearTimeout(r), this.executingTasks.has(t) && e.reject(n);
    } finally {
      this.executingTasks.delete(t), this.shutdownRequested || (this.markWorkerAvailable(t), this.processQueue());
    }
  }
}
I.getInstance();
class qt {
  workerScriptUrl;
  pendingRequests = /* @__PURE__ */ new Map();
  nextRequestId = 0;
  worker = null;
  constructor(t = {}) {
    this.pool = t.pool ?? I.getInstance(), this.registry = t.registry ?? new K(), this.workerScriptUrl = t.workerScriptUrl;
  }
  pool;
  registry;
  registerTask(t, e) {
    this.registry.register(t, e), this.pool.registerTask(t, e);
  }
  async runTask(t, e, r = 3e4) {
    return this.registry.has(t) ? this.pool.runTask(t, e, r) : typeof Worker < "u" && this.workerScriptUrl ? this.runTaskInWorker(
      t,
      e,
      r
    ) : this.pool.runTask(t, e, r);
  }
  get taskRegistry() {
    return this.registry;
  }
  terminate() {
    for (const t of this.pendingRequests.values())
      clearTimeout(t.timeoutId), t.reject(new Error("Browser task adapter terminated"));
    this.pendingRequests.clear(), this.worker?.terminate(), this.worker = null;
  }
  async runTaskInWorker(t, e, r) {
    const n = this.ensureWorker(), s = `task-${this.nextRequestId++}`;
    return new Promise((i, o) => {
      const h = setTimeout(() => {
        this.pendingRequests.delete(s), o(new Error(`Task timed out: ${t}`));
      }, r);
      this.pendingRequests.set(s, {
        resolve: (c) => i(c),
        reject: o,
        timeoutId: h
      }), n.postMessage({
        id: s,
        taskName: t,
        payload: e
      });
    });
  }
  ensureWorker() {
    if (this.worker)
      return this.worker;
    if (!this.workerScriptUrl)
      throw new Error(
        "BrowserTaskAdapter requires workerScriptUrl for off-main-thread execution"
      );
    return this.worker = new Worker(this.workerScriptUrl, { type: "module" }), this.worker.onmessage = (t) => {
      const e = t.data, r = this.pendingRequests.get(e.id);
      if (r) {
        if (clearTimeout(r.timeoutId), this.pendingRequests.delete(e.id), e.ok) {
          r.resolve(e.result);
          return;
        }
        r.reject(new Error(e.error ?? "Task failed"));
      }
    }, this.worker.onerror = (t) => {
      for (const e of this.pendingRequests.values())
        clearTimeout(e.timeoutId), e.reject(t);
      this.pendingRequests.clear(), this.worker?.terminate(), this.worker = null;
    }, this.worker;
  }
}
new qt();
function zt(a, t) {
  if (typeof document > "u")
    throw new Error(
      "CanvasPool requires a DOM-like environment with document.createElement"
    );
  const e = document.createElement("canvas");
  return e.width = a, e.height = t, e;
}
class z {
  constructor(t = 5, e = 2, r = 500 * 1024 * 1024) {
    this.maxPoolSize = t, this.maxCanvasesPerSize = e, this.memoryLimit = r;
  }
  static instance = null;
  pool = /* @__PURE__ */ new Map();
  usage = /* @__PURE__ */ new Map();
  metrics = /* @__PURE__ */ new Map();
  static getInstance() {
    return this.instance || (this.instance = new z()), this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  getCanvas(t, e, r = !1) {
    const n = this.getKey(t, e), s = this.pool.get(n);
    return s && s.length > 0 ? (this.incrementUsage(n), this.updateMetrics(n), s.pop()) : (this.incrementUsage(n), this.updateMetrics(n), zt(t, e));
  }
  releaseCanvas(t) {
    const e = this.getKey(t.width, t.height);
    if (!this.shouldAddToPool(e)) {
      this.disposeCanvas(t);
      return;
    }
    t.getContext("2d")?.clearRect(0, 0, t.width, t.height);
    const r = this.pool.get(e) ?? [];
    r.push(t), this.pool.set(e, r), this.updateMetrics(e);
  }
  clear() {
    for (const t of this.pool.values())
      t.forEach((e) => this.disposeCanvas(e));
    this.pool.clear(), this.usage.clear(), this.metrics.clear();
  }
  terminate() {
    this.clear();
  }
  getPoolSize() {
    return this.pool.size;
  }
  getUsageStats() {
    return this.usage;
  }
  getKey(t, e) {
    return `${t}x${e}`;
  }
  incrementUsage(t) {
    this.usage.set(t, (this.usage.get(t) ?? 0) + 1);
  }
  shouldAddToPool(t) {
    const e = this.pool.get(t)?.length ?? 0, r = Array.from(this.pool.values()).reduce(
      (n, s) => n + s.length,
      0
    );
    return e < this.maxCanvasesPerSize && r < this.maxPoolSize && this.getCurrentMemoryUsage() < this.memoryLimit;
  }
  getCurrentMemoryUsage() {
    return Array.from(this.pool.entries()).reduce((t, [e, r]) => {
      const [n, s] = e.split("x").map(Number);
      return t + r.length * n * s * 4;
    }, 0);
  }
  updateMetrics(t) {
    const e = this.metrics.get(t) ?? { usage: 0, lastUsed: 0 };
    e.usage += 1, e.lastUsed = Date.now(), this.metrics.set(t, e);
  }
  disposeCanvas(t) {
    t.width = 0, t.height = 0, t.remove();
  }
}
z.getInstance();
export {
  qt as B,
  z as C,
  st as N,
  q as P,
  Rt as S,
  jt as T,
  Ht as V,
  I as W,
  et as a,
  _t as b,
  Tt as c,
  $t as d,
  Pt as e
};
