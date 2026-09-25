const { test } = require('node:test');
const assert = require('node:assert/strict');
const { read, load } = require('./helpers');

// 描画・履歴の関数だけを取り出し、グローバル状態（shapes など）をコンテキストに置いて動かす
function app(projection = 'cabinet') {
  const ctx = { S: 40, projection, shapes: [], selectedIds: [], history: [], historyIndex: -1, renders: 0 };
  ctx.render = () => ctx.renders++; // render は DOM を触るので回数だけ数える
  const api = load({
    functions: ['escapeXML', 'getStrokeStyle', 'getShapePath', 'getCuboidPath', 'getCylinderPath', 'saveState', 'undo', 'redo'],
    globals: ctx,
  });
  return { ...api, ctx };
}

test('1cm = 40px で長方形の SVG を作る', () => {
  const { getShapePath } = app();
  const svg = getShapePath({ type: 'rect', w: 3, h: 2, fill: 'none' });
  assert.match(svg, /<rect[^>]*width="120" height="80" fill="none" stroke="#000"/);
});

test('斜線の塗りは hatch パターンを参照する', () => {
  const { getShapePath } = app();
  assert.match(getShapePath({ type: 'circle', r: 1, fill: 'hatch' }), /fill="url\(#hatch\)"/);
});

test('全ツールバーの図形で SVG を生成できる', () => {
  const { getShapePath } = app();
  const types = [...read('index.html').matchAll(/onclick="addShape\('([a-zA-Z_]+)'\)"/g)].map((m) => m[1]);
  assert.ok(types.length >= 15);
  const base = { w: 2, h: 2, r: 1, d: 1, topX: 1, w2: 1, angle: 60, text: 'A', fontSize: 16, fill: 'none' };
  for (const type of types) {
    const svg = getShapePath({ ...base, type });
    assert.equal(typeof svg, 'string', type);
    assert.doesNotMatch(svg, /NaN|undefined/, type);
  }
});

test('直方体の奥行きはキャビネット図（45°・1/2）と等角図（30°・1/1）で変わる', () => {
  const cab = app('cabinet').getShapePath({ type: 'cuboid', w: 2, h: 2, d: 2, fill: 'none' });
  const iso = app('iso').getShapePath({ type: 'cuboid', w: 2, h: 2, d: 2, fill: 'none' });
  const dx = (svg) => Number(svg.match(/M 0,0 L ([\d.]+),/)[1]);
  assert.equal(dx(cab).toFixed(2), (80 * 0.5 * Math.cos(Math.PI / 4)).toFixed(2));
  assert.equal(dx(iso).toFixed(2), (80 * Math.cos(Math.PI / 6)).toFixed(2));
});

test('元に戻す・やり直しで図形の状態を行き来できる', () => {
  const { saveState, undo, redo, ctx } = app();
  saveState();
  ctx.shapes.push({ id: 's0', type: 'rect' });
  saveState();
  undo();
  assert.equal(ctx.shapes.length, 0);
  redo();
  assert.equal(ctx.shapes.length, 1);
  redo(); // これ以上先はない
  assert.equal(ctx.historyIndex, 1);
});

test('外部送信するコードがない', () => {
  assert.doesNotMatch(read('index.html'), /\bfetch\(|sendBeacon|XMLHttpRequest|WebSocket/);
});

test('テキスト図形の「<」「&」はエスケープして SVG を壊さない', () => {
  const { getShapePath } = app();
  const svg = getShapePath({ type: 'text', text: 'a<b & c', fontSize: 16 });
  assert.match(svg, />a&lt;b &amp; c<\/text>/);
});
