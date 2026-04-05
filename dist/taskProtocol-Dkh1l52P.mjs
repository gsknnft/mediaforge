var k = Object.defineProperty;
var P = (t, e, a) => e in t ? k(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a;
var S = (t, e, a) => P(t, typeof e != "symbol" ? e + "" : e, a);
const f = {
  MATRIX_SPLIT: "scanforge.matrix.split",
  IMAGE_ALIGN: "scanforge.image.align",
  PREVIEW_GENERATE: "scanforge.preview.generate"
};
function u(t, e, a) {
  return Math.min(a, Math.max(e, t));
}
function W(t) {
  return u(t, 0, 1);
}
function w(t, e, a) {
  return (a * t + e) * 4;
}
function R(t, e, a = [0, 0, 0, 0], c) {
  const o = new Uint8ClampedArray(t * e * 4);
  for (let h = 0; h < o.length; h += 4)
    o[h] = a[0], o[h + 1] = a[1], o[h + 2] = a[2], o[h + 3] = a[3];
  return { width: t, height: e, data: o, label: c };
}
function T(t, e, a, c, o, h) {
  const s = new Uint8ClampedArray(c * o * 4);
  for (let i = 0; i < o; i += 1)
    for (let r = 0; r < c; r += 1) {
      const n = w(t.width, e + r, a + i), l = w(c, r, i);
      s[l] = t.data[n], s[l + 1] = t.data[n + 1], s[l + 2] = t.data[n + 2], s[l + 3] = t.data[n + 3];
    }
  return { width: c, height: o, data: s, label: h };
}
function v(t, e, a, c, o, h = 24) {
  const s = w(t.width, e, a);
  if (t.data[s + 3] <= c)
    return !0;
  if (!o)
    return !1;
  const r = t.data[s] - o[0], n = t.data[s + 1] - o[1], l = t.data[s + 2] - o[2];
  return Math.sqrt(r * r + n * n + l * l) <= h;
}
function X(t, e, a, c) {
  let o = t.width, h = t.height, s = -1, i = -1;
  for (let r = 0; r < t.height; r += 1)
    for (let n = 0; n < t.width; n += 1)
      v(t, n, r, e, a, c) || (n < o && (o = n), r < h && (h = r), n > s && (s = n), r > i && (i = r));
  return s < o || i < h ? { x: 0, y: 0, width: t.width, height: t.height } : {
    x: o,
    y: h,
    width: s - o + 1,
    height: i - h + 1
  };
}
function I(t, e = 0) {
  if (e <= 0)
    return t;
  const a = Math.max(0, Math.floor((t.width - 1) / 2)), c = Math.max(0, Math.floor((t.height - 1) / 2)), o = Math.min(e, a), h = Math.min(e, c);
  return {
    x: t.x + o,
    y: t.y + h,
    width: Math.max(1, t.width - o * 2),
    height: Math.max(1, t.height - h * 2)
  };
}
function H(t) {
  const e = Math.max(0, t.padding ?? 0), a = W(t.anchorX ?? 0.5), c = W(t.anchorY ?? 0.5), o = W(t.coverage ?? 0.92), h = Math.max(0.01, t.subjectScale ?? 1), s = Math.max(1, t.targetWidth - e * 2), i = Math.max(1, t.targetHeight - e * 2), r = Math.min(
    s / Math.max(1, t.subjectWidth),
    i / Math.max(1, t.subjectHeight)
  ), n = t.scaleOverride ?? r * u(o * h, 0.01, 1), l = Math.max(1, Math.floor(t.subjectWidth * n)), d = Math.max(1, Math.floor(t.subjectHeight * n)), M = e, g = e, m = Math.max(
    e,
    t.targetWidth - e - l
  ), x = Math.max(
    e,
    t.targetHeight - e - d
  ), b = Math.round(
    u(
      a * t.targetWidth - l / 2,
      M,
      m
    )
  ), A = Math.round(
    u(
      c * t.targetHeight - d / 2,
      g,
      x
    )
  );
  return {
    offsetX: b,
    offsetY: A,
    drawWidth: l,
    drawHeight: d,
    scale: n
  };
}
function j(t) {
  const e = T(
    t.image,
    t.subjectBox.x,
    t.subjectBox.y,
    t.subjectBox.width,
    t.subjectBox.height,
    t.image.label
  ), a = R(
    t.targetWidth,
    t.targetHeight,
    t.fillColor ?? [0, 0, 0, 0],
    t.image.label
  );
  return y(
    e,
    a,
    t.placement.offsetX,
    t.placement.offsetY,
    t.placement.drawWidth,
    t.placement.drawHeight
  ), a;
}
function y(t, e, a, c, o, h) {
  for (let s = 0; s < h; s += 1)
    for (let i = 0; i < o; i += 1) {
      const r = Math.min(
        t.width - 1,
        Math.max(0, Math.floor(i / o * t.width))
      ), n = Math.min(
        t.height - 1,
        Math.max(0, Math.floor(s / h * t.height))
      ), l = w(t.width, r, n), d = w(
        e.width,
        a + i,
        c + s
      );
      e.data[d] = t.data[l], e.data[d + 1] = t.data[l + 1], e.data[d + 2] = t.data[l + 2], e.data[d + 3] = t.data[l + 3];
    }
}
function O(t) {
  const e = t.gapX ?? 0, a = t.gapY ?? 0, c = t.marginX ?? 0, o = t.marginY ?? 0, h = t.cellWidth ?? Math.floor(
    (t.image.width - c * 2 - e * (t.cols - 1)) / t.cols
  ), s = t.cellHeight ?? Math.floor(
    (t.image.height - o * 2 - a * (t.rows - 1)) / t.rows
  ), i = [];
  for (let r = 0; r < t.rows; r += 1)
    for (let n = 0; n < t.cols; n += 1) {
      const l = c + n * (h + e), d = o + r * (s + a);
      i.push({
        id: `r${r}c${n}`,
        row: r,
        col: n,
        x: l,
        y: d,
        image: T(
          t.image,
          l,
          d,
          h,
          s,
          `r${r}c${n}`
        )
      });
    }
  return {
    task: f.MATRIX_SPLIT,
    rows: t.rows,
    cols: t.cols,
    cellWidth: h,
    cellHeight: s,
    cells: i
  };
}
function _(t) {
  const e = t.alphaThreshold ?? 8, a = I(
    X(
      t.image,
      e,
      t.colorKey,
      t.colorTolerance
    ),
    t.trimPx ?? 0
  ), c = H({
    subjectWidth: a.width,
    subjectHeight: a.height,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    padding: t.padding,
    anchorX: t.anchorX,
    anchorY: t.anchorY,
    coverage: t.coverage,
    subjectScale: t.subjectScale
  }), o = j({
    image: t.image,
    subjectBox: a,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    fillColor: t.fillColor,
    placement: c
  });
  return {
    task: f.IMAGE_ALIGN,
    image: o,
    subjectBox: a,
    offsetX: c.offsetX,
    offsetY: c.offsetY,
    scale: c.scale,
    drawWidth: c.drawWidth,
    drawHeight: c.drawHeight
  };
}
function V(t) {
  if (t.images.length === 0)
    return {
      images: [],
      subjectBoxes: [],
      placements: [],
      sharedScale: 1
    };
  const e = t.alphaThreshold ?? 8, a = t.images.map(
    (r) => I(
      X(
        r,
        e,
        t.colorKey,
        t.colorTolerance
      ),
      t.trimPx ?? 0
    )
  ), c = Math.max(...a.map((r) => r.width)), o = Math.max(...a.map((r) => r.height)), h = H({
    subjectWidth: c,
    subjectHeight: o,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    padding: t.padding,
    anchorX: t.anchorX,
    anchorY: t.anchorY,
    coverage: t.coverage,
    subjectScale: t.subjectScale
  }), s = a.map(
    (r) => H({
      subjectWidth: r.width,
      subjectHeight: r.height,
      targetWidth: t.targetWidth,
      targetHeight: t.targetHeight,
      padding: t.padding,
      anchorX: t.anchorX,
      anchorY: t.anchorY,
      scaleOverride: h.scale
    })
  );
  return {
    images: t.images.map(
      (r, n) => j({
        image: r,
        subjectBox: a[n],
        targetWidth: t.targetWidth,
        targetHeight: t.targetHeight,
        fillColor: t.fillColor,
        placement: s[n]
      })
    ),
    subjectBoxes: a,
    placements: s,
    sharedScale: h.scale
  };
}
function G(t) {
  if (t.images.length === 0)
    throw new Error("preview.generate requires at least one image");
  const e = t.padding ?? 8, a = t.cellWidth ?? Math.max(...t.images.map((r) => r.width)), c = t.cellHeight ?? Math.max(...t.images.map((r) => r.height)), o = t.columns ?? Math.max(1, Math.ceil(Math.sqrt(t.images.length))), h = Math.ceil(t.images.length / o), s = R(
    o * a + (o + 1) * e,
    h * c + (h + 1) * e,
    t.fillColor ?? [18, 20, 24, 255],
    "scanforge-preview"
  ), i = t.images.map((r, n) => {
    const l = n % o, d = Math.floor(n / o), M = Math.min(a / r.width, c / r.height), g = Math.max(1, Math.floor(r.width * M)), m = Math.max(1, Math.floor(r.height * M)), x = e + l * (a + e) + Math.floor((a - g) / 2), b = e + d * (c + e) + Math.floor((c - m) / 2);
    return y(r, s, x, b, g, m), { index: n, x, y: b, width: g, height: m };
  });
  return {
    task: f.PREVIEW_GENERATE,
    image: s,
    placements: i,
    columns: o,
    rows: h
  };
}
function B(t) {
  t.register(f.MATRIX_SPLIT, O), t.register(f.IMAGE_ALIGN, _), t.register(
    f.PREVIEW_GENERATE,
    G
  );
}
const N = "invalid-request";
function Y(t) {
  return typeof t == "object" && t !== null && !Array.isArray(t);
}
function E(t) {
  return typeof t == "string" && t.trim().length > 0;
}
function C(t) {
  return Y(t) && E(t.id) ? t.id : N;
}
function L(t) {
  if (!Y(t))
    throw new Error("Runtime task request must be an object");
  if (!E(t.id))
    throw new Error("Runtime task request id must be a non-empty string");
  if (!E(t.taskName))
    throw new Error("Runtime task request taskName must be a non-empty string");
}
class p {
  constructor() {
    S(this, "handlers", /* @__PURE__ */ new Map());
  }
  register(e, a) {
    if (!E(e))
      throw new Error("Runtime task name must be a non-empty string");
    if (typeof a != "function")
      throw new Error(`Runtime task handler for ${e} must be a function`);
    if (this.handlers.has(e))
      throw new Error(`Runtime task ${e} is already registered`);
    this.handlers.set(e, a);
  }
  has(e) {
    return this.handlers.has(e);
  }
  async run(e, a) {
    const c = this.handlers.get(e);
    if (!c)
      throw new Error(`No runtime task registered for ${e}`);
    return await c(a);
  }
}
async function F(t, e) {
  try {
    L(e);
    const a = await t.run(
      e.taskName,
      e.payload
    );
    return {
      id: e.id,
      ok: !0,
      result: a
    };
  } catch (a) {
    return {
      id: C(e),
      ok: !1,
      error: a instanceof Error ? a.message : String(a)
    };
  }
}
export {
  p as R,
  f as S,
  _ as a,
  V as b,
  F as e,
  G as g,
  B as r,
  O as s
};
