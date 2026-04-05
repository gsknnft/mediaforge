const g = {
  MATRIX_SPLIT: "scanforge.matrix.split",
  IMAGE_ALIGN: "scanforge.image.align",
  PREVIEW_GENERATE: "scanforge.preview.generate"
};
function b(t, e, a) {
  return Math.min(a, Math.max(e, t));
}
function H(t) {
  return b(t, 0, 1);
}
function M(t, e, a) {
  return (a * t + e) * 4;
}
function X(t, e, a = [0, 0, 0, 0], h) {
  const c = new Uint8ClampedArray(t * e * 4);
  for (let r = 0; r < c.length; r += 4)
    c[r] = a[0], c[r + 1] = a[1], c[r + 2] = a[2], c[r + 3] = a[3];
  return { width: t, height: e, data: c, label: h };
}
function E(t, e, a, h, c, r) {
  const n = new Uint8ClampedArray(h * c * 4);
  for (let l = 0; l < c; l += 1)
    for (let o = 0; o < h; o += 1) {
      const s = M(t.width, e + o, a + l), i = M(h, o, l);
      n[i] = t.data[s], n[i + 1] = t.data[s + 1], n[i + 2] = t.data[s + 2], n[i + 3] = t.data[s + 3];
    }
  return { width: h, height: c, data: n, label: r };
}
function R(t, e, a, h, c, r = 24) {
  const n = M(t.width, e, a);
  if (t.data[n + 3] <= h)
    return !0;
  if (!c)
    return !1;
  const o = t.data[n] - c[0], s = t.data[n + 1] - c[1], i = t.data[n + 2] - c[2];
  return Math.sqrt(o * o + s * s + i * i) <= r;
}
function T(t, e, a, h) {
  let c = t.width, r = t.height, n = -1, l = -1;
  for (let o = 0; o < t.height; o += 1)
    for (let s = 0; s < t.width; s += 1)
      R(t, s, o, e, a, h) || (s < c && (c = s), o < r && (r = o), s > n && (n = s), o > l && (l = o));
  return n < c || l < r ? { x: 0, y: 0, width: t.width, height: t.height } : {
    x: c,
    y: r,
    width: n - c + 1,
    height: l - r + 1
  };
}
function Y(t, e = 0) {
  if (e <= 0)
    return t;
  const a = Math.max(0, Math.floor((t.width - 1) / 2)), h = Math.max(0, Math.floor((t.height - 1) / 2)), c = Math.min(e, a), r = Math.min(e, h);
  return {
    x: t.x + c,
    y: t.y + r,
    width: Math.max(1, t.width - c * 2),
    height: Math.max(1, t.height - r * 2)
  };
}
function S(t) {
  const e = Math.max(0, t.padding ?? 0), a = H(t.anchorX ?? 0.5), h = H(t.anchorY ?? 0.5), c = H(t.coverage ?? 0.92), r = Math.max(0.01, t.subjectScale ?? 1), n = Math.max(1, t.targetWidth - e * 2), l = Math.max(1, t.targetHeight - e * 2), o = Math.min(
    n / Math.max(1, t.subjectWidth),
    l / Math.max(1, t.subjectHeight)
  ), s = t.scaleOverride ?? o * b(c * r, 0.01, 1), i = Math.max(1, Math.floor(t.subjectWidth * s)), d = Math.max(1, Math.floor(t.subjectHeight * s)), w = e, f = e, m = Math.max(
    e,
    t.targetWidth - e - i
  ), x = Math.max(
    e,
    t.targetHeight - e - d
  ), W = Math.round(
    b(
      a * t.targetWidth - i / 2,
      w,
      m
    )
  ), A = Math.round(
    b(
      h * t.targetHeight - d / 2,
      f,
      x
    )
  );
  return {
    offsetX: W,
    offsetY: A,
    drawWidth: i,
    drawHeight: d,
    scale: s
  };
}
function j(t) {
  const e = E(
    t.image,
    t.subjectBox.x,
    t.subjectBox.y,
    t.subjectBox.width,
    t.subjectBox.height,
    t.image.label
  ), a = X(
    t.targetWidth,
    t.targetHeight,
    t.fillColor ?? [0, 0, 0, 0],
    t.image.label
  );
  return I(
    e,
    a,
    t.placement.offsetX,
    t.placement.offsetY,
    t.placement.drawWidth,
    t.placement.drawHeight
  ), a;
}
function I(t, e, a, h, c, r) {
  for (let n = 0; n < r; n += 1)
    for (let l = 0; l < c; l += 1) {
      const o = Math.min(
        t.width - 1,
        Math.max(0, Math.floor(l / c * t.width))
      ), s = Math.min(
        t.height - 1,
        Math.max(0, Math.floor(n / r * t.height))
      ), i = M(t.width, o, s), d = M(
        e.width,
        a + l,
        h + n
      );
      e.data[d] = t.data[i], e.data[d + 1] = t.data[i + 1], e.data[d + 2] = t.data[i + 2], e.data[d + 3] = t.data[i + 3];
    }
}
function u(t) {
  const e = t.gapX ?? 0, a = t.gapY ?? 0, h = t.marginX ?? 0, c = t.marginY ?? 0, r = t.cellWidth ?? Math.floor(
    (t.image.width - h * 2 - e * (t.cols - 1)) / t.cols
  ), n = t.cellHeight ?? Math.floor(
    (t.image.height - c * 2 - a * (t.rows - 1)) / t.rows
  ), l = [];
  for (let o = 0; o < t.rows; o += 1)
    for (let s = 0; s < t.cols; s += 1) {
      const i = h + s * (r + e), d = c + o * (n + a);
      l.push({
        id: `r${o}c${s}`,
        row: o,
        col: s,
        x: i,
        y: d,
        image: E(
          t.image,
          i,
          d,
          r,
          n,
          `r${o}c${s}`
        )
      });
    }
  return {
    task: g.MATRIX_SPLIT,
    rows: t.rows,
    cols: t.cols,
    cellWidth: r,
    cellHeight: n,
    cells: l
  };
}
function v(t) {
  const e = t.alphaThreshold ?? 8, a = Y(
    T(
      t.image,
      e,
      t.colorKey,
      t.colorTolerance
    ),
    t.trimPx ?? 0
  ), h = S({
    subjectWidth: a.width,
    subjectHeight: a.height,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    padding: t.padding,
    anchorX: t.anchorX,
    anchorY: t.anchorY,
    coverage: t.coverage,
    subjectScale: t.subjectScale
  }), c = j({
    image: t.image,
    subjectBox: a,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    fillColor: t.fillColor,
    placement: h
  });
  return {
    task: g.IMAGE_ALIGN,
    image: c,
    subjectBox: a,
    offsetX: h.offsetX,
    offsetY: h.offsetY,
    scale: h.scale,
    drawWidth: h.drawWidth,
    drawHeight: h.drawHeight
  };
}
function y(t) {
  if (t.images.length === 0)
    return {
      images: [],
      subjectBoxes: [],
      placements: [],
      sharedScale: 1
    };
  const e = t.alphaThreshold ?? 8, a = t.images.map(
    (o) => Y(
      T(
        o,
        e,
        t.colorKey,
        t.colorTolerance
      ),
      t.trimPx ?? 0
    )
  ), h = Math.max(...a.map((o) => o.width)), c = Math.max(...a.map((o) => o.height)), r = S({
    subjectWidth: h,
    subjectHeight: c,
    targetWidth: t.targetWidth,
    targetHeight: t.targetHeight,
    padding: t.padding,
    anchorX: t.anchorX,
    anchorY: t.anchorY,
    coverage: t.coverage,
    subjectScale: t.subjectScale
  }), n = a.map(
    (o) => S({
      subjectWidth: o.width,
      subjectHeight: o.height,
      targetWidth: t.targetWidth,
      targetHeight: t.targetHeight,
      padding: t.padding,
      anchorX: t.anchorX,
      anchorY: t.anchorY,
      scaleOverride: r.scale
    })
  );
  return {
    images: t.images.map(
      (o, s) => j({
        image: o,
        subjectBox: a[s],
        targetWidth: t.targetWidth,
        targetHeight: t.targetHeight,
        fillColor: t.fillColor,
        placement: n[s]
      })
    ),
    subjectBoxes: a,
    placements: n,
    sharedScale: r.scale
  };
}
function P(t) {
  if (t.images.length === 0)
    throw new Error("preview.generate requires at least one image");
  const e = t.padding ?? 8, a = t.cellWidth ?? Math.max(...t.images.map((o) => o.width)), h = t.cellHeight ?? Math.max(...t.images.map((o) => o.height)), c = t.columns ?? Math.max(1, Math.ceil(Math.sqrt(t.images.length))), r = Math.ceil(t.images.length / c), n = X(
    c * a + (c + 1) * e,
    r * h + (r + 1) * e,
    t.fillColor ?? [18, 20, 24, 255],
    "scanforge-preview"
  ), l = t.images.map((o, s) => {
    const i = s % c, d = Math.floor(s / c), w = Math.min(a / o.width, h / o.height), f = Math.max(1, Math.floor(o.width * w)), m = Math.max(1, Math.floor(o.height * w)), x = e + i * (a + e) + Math.floor((a - f) / 2), W = e + d * (h + e) + Math.floor((h - m) / 2);
    return I(o, n, x, W, f, m), { index: s, x, y: W, width: f, height: m };
  });
  return {
    task: g.PREVIEW_GENERATE,
    image: n,
    placements: l,
    columns: c,
    rows: r
  };
}
function O(t) {
  t.register(g.MATRIX_SPLIT, u), t.register(g.IMAGE_ALIGN, v), t.register(
    g.PREVIEW_GENERATE,
    P
  );
}
class _ {
  handlers = /* @__PURE__ */ new Map();
  register(e, a) {
    this.handlers.set(e, a);
  }
  has(e) {
    return this.handlers.has(e);
  }
  async run(e, a) {
    const h = this.handlers.get(e);
    if (!h)
      throw new Error(`No runtime task registered for ${e}`);
    return await h(a);
  }
}
async function k(t, e) {
  try {
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
      id: e.id,
      ok: !1,
      error: a instanceof Error ? a.message : String(a)
    };
  }
}
export {
  _ as R,
  g as S,
  v as a,
  y as b,
  k as e,
  P as g,
  O as r,
  u as s
};
