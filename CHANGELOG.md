# Changelog

このプロジェクトの主な変更を記録します。形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/)、
バージョンは [Semantic Versioning](https://semver.org/lang/ja/) に従います。
0.x の履歴は、この CHANGELOG を作成した時点で Git の履歴からまとめ直したものです（Web 未公開のため 0.x）。

## [Unreleased]

## [0.3.0] - 2026-09-25

### Added

- テスト（`npm test`）と HTML 静的チェック（`npm run check`）、GitHub Actions の CI
- README にデータの扱い・制限事項・開発手順を追記

### Fixed

- README の図形一覧・スナップ単位・ショートカットを実装に合わせた
- テキスト図形に「<」「&」を入れると SVG が壊れる問題（文字列をエスケープせずに挿入していた）

## [0.2.0] - 2026-04-28

- Ver.2：台形・扇形・円錐・展開図・補助記号、元に戻す／やり直し

## [0.1.0] - 2026-04-27

- 初版：平面・立体図形の作図と SVG 保存
