# D-shape

算数プリント用の図形を SVG で作成するブラウザツール。GitHub Pages は有効化しない方針（リポジトリのみ公開）。
共通方針は [edi-tool 開発原則](https://github.com/edi-tool/.github/blob/main/PRINCIPLES.md)。

## 実行コマンド

- プレビュー: `python -m http.server 8000`
- テスト: `npm test`（Node.js 22 以上、依存なし）
- HTML 静的チェック: `npm run check`（viewport 欠落は PC 向けのため package.json で警告扱い）

## 守ること

- 単一の `index.html` で完結させる。外部ライブラリ・外部送信を入れない（テストで確認）。
- 図形を追加したら README の「主な機能」を更新する（テストはツールバーの全図形を自動で検査する）。
- `scripts/check-static.mjs` と `tests/helpers.js` は edi-tool/.github の templates からのコピー。直すときは原本も直す。
