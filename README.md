> [!NOTE]
> このリポジトリは、技育ハッカソンvol6で作成したプロジェクト「積み単」を、バックエンドが不要な形に改修したものです。(もとのリポジトリは[こちら](https://github.com/orgs/geek-hackathon-vol6-team20/repositories))

<div align="center">
  <img src="./public/icons/icon-512x512.png" alt="積み単ロゴ" width="120" height="120">
</div>

# 積み単 (tsumitan)

スマートフォン最適化された英単語学習アプリケーション

## 概要

積み単は効率的な英単語学習を支援するWebアプリケーションです。単語を検索すると自動的に単語帳に追加され、検索回数や復習回数を記録することで、ユーザーに最適化された学習体験を提供します。

## 主な機能

- 🔍 **単語検索と自動単語帳追加** - 検索した単語が自動的に個人の単語帳に保存
- 📊 **学習データ記録** - 検索回数や復習回数を追跡し学習効率を向上
- 🎯 **最適化された単語帳** - 学習データに基づいて最適な復習単語を提示
- 🗄️ **ローカルストレージ** - IndexedDBによるオフラインのデータ保存
- 📱 **スマートフォン最適化** - スマートフォンでの使用を想定したUI設計
- 🔧 **PWA対応** - ホーム画面への追加やオフライン機能をサポート

## 技術スタック

### フロントエンド
- **React**
- **TypeScript**
- **Vite**
- **Jotai**
- **Tailwind CSS**
- **Biome**
- **lefthook**

### デプロイ
- **Cloudflare Pages Functions** - 辞書API プロキシ（CORS回避）
- **Cloudflare Pages** - フロントエンドホスティング

## 関連リポジトリ・デプロイ先

- **デプロイ先**: https://tsumitan.muhi111.com

## セットアップ

### 前提条件
- Node.js
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/muhi111/tsumitan.git
cd tsumitan

# 依存関係をインストール
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーが `http://localhost:8788` で起動します。

## プロジェクト構造

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── pages/          # ページコンポーネント
├── database/       # IndexedDB操作
├── utils/          # ユーティリティ・API
├── types/          # TypeScript型定義
├── hooks/          # カスタムReactフック
├── config/         # ルーティング設定
├── atoms.ts        # Jotai状態管理
├── App.tsx         # アプリケーションルート
└── main.tsx        # エントリーポイント

functions/
├── dictionary.ts   # Cloudflare Pages Functions（辞書API）
└── _middleware.ts  # ミドルウェア設定
```

## 開発

### 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # プロダクションビルドのプレビュー
npm run check    # Biomeのコードチェック
```
