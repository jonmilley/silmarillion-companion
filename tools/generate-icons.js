#!/usr/bin/env node
/* Generates the PWA app icons with zero dependencies (Node's built-in zlib).
   Draws a gold four-point star (the "✦" motif) on the night-sky gradient,
   matching the app's palette. Run:  node tools/generate-icons.js          */

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'icons');
fs.mkdirSync(OUT, { recursive: true });

// palette (sRGB)
const NIGHT  = [7, 11, 22];
const NIGHT2 = [12, 18, 34];
const GOLD   = [230, 192, 104];
const GOLDHI = [255, 233, 170];

const lerp = (a, b, t) => a + (b - a) * t;
const mix  = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0, e1, x) => { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

function renderRGBA(size) {
  const cx = size / 2, cy = size / 2;
  const R = size * 0.34;           // star tip radius — stays inside the maskable safe zone
  const buf = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // background: vertical night gradient + soft central gold glow
      let col = mix(NIGHT, NIGHT2, y / size);
      const dr = Math.hypot(x - cx, y - cy) / (size * 0.5);
      const glow = Math.max(0, 1 - dr) ** 2 * 0.18;
      col = mix(col, GOLD, glow);

      // four-point star: astroid-like shape  |nx|^0.5 + |ny|^0.5 <= 1
      const nx = Math.abs(x - cx) / R;
      const ny = Math.abs(y - cy) / R;
      const s = Math.sqrt(nx) + Math.sqrt(ny);
      const star = 1 - smooth(0.92, 1.04, s);        // soft edge
      if (star > 0) {
        const core = 1 - smooth(0, 0.22, dr);        // brighter toward the centre
        const sc = mix(GOLD, GOLDHI, core);
        col = mix(col, sc, star);
      }

      const i = (y * size + x) * 4;
      buf[i] = Math.round(clamp01(col[0] / 255) * 255);
      buf[i + 1] = Math.round(clamp01(col[1] / 255) * 255);
      buf[i + 2] = Math.round(clamp01(col[2] / 255) * 255);
      buf[i + 3] = 255;
    }
  }
  return buf;
}

// ---- minimal PNG encoder ----
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

for (const size of [192, 512]) {
  const png = encodePNG(size, renderRGBA(size));
  fs.writeFileSync(path.join(OUT, `icon-${size}.png`), png);
  console.log(`wrote icons/icon-${size}.png (${png.length} bytes)`);
}
