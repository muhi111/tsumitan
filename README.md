# 積み単 (tsumitan)

スマートフォン最適化された英単語学習アプリケーション

## 概要

積み単は効率的な英単語学習を支援するWebアプリケーションです。単語を検索すると自動的に単語帳に追加され、検索回数や復習回数を記録することで、ユーザーに最適化された学習体験を提供します。

## 主な機能

- 🔍 **単語検索と自動単語帳追加** - 検索した単語が自動的に個人の単語帳に保存
- 📊 **学習データ記録** - 検索回数や復習回数を追跡し学習効率を向上
- 🎯 **最適化された単語帳** - 学習データに基づいて最適な復習単語を提示
- 👤 **匿名認証** - Firebase匿名認証によりログイン不要で利用可能
- 📱 **スマートフォン最適化** - スマートフォンでの使用を想定したUI設計
- 🔧 **PWA対応** - ホーム画面への追加やオフライン機能をサポート

## 技術スタック

### フロントエンド
- **React** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **React Router DOM** - SPA ルーティング
- **Jotai** - 状態管理
- **Tailwind CSS** - スタイリング
- **Biome** - コードフォーマッター・リンター

### バックエンド・認証
- **Firebase** - 認証・匿名ログイン
- **REST API** - バックエンドサーバーとの連携

### デプロイ
- **GitHub Pages** - フロントエンドホスティング

## 関連リポジトリ・デプロイ先

- **デプロイ先**: [tsumitan.me](https://tsumitan.me)
- **バックエンドリポジトリ**: https://github.com/geek-hackathon-vol6-team20/tsumitan-backend

## セットアップ

### 前提条件
- Node.js
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/tsumitan-frontend.git
cd tsumitan-frontend

# 依存関係をインストール
npm install
```

### 環境変数設定

`.env.example` を参考に `.env` ファイルを作成し、必要な環境変数を設定してください。

```bash
cp .env.example .env
```

必要な環境変数:
- `VITE_FIREBASE_API_KEY` - Firebase API キー
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase 認証ドメイン
- `VITE_FIREBASE_PROJECT_ID` - Firebase プロジェクト ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase ストレージバケット
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase メッセージング送信者 ID
- `VITE_FIREBASE_APP_ID` - Firebase アプリ ID
- `VITE_API_BASE_URL` - バックエンド API のベース URL

### 開発サーバー起動

```bash
npm run dev
```

開発サーバーが `http://localhost:5173` で起動します。

## プロジェクト構造

```
src/
├── components/     # 再利用可能なUIコンポーネント
├── pages/          # ページコンポーネント
├── firebase/       # Firebase設定
├── utils/          # ユーティリティ
├── types/          # TypeScript型定義
├── atoms.ts        # Jotai状態管理
├── App.tsx         # アプリケーションルート
└── main.tsx        # エントリーポイント
```

## ビルド・デプロイ

### プロダクションビルド

```bash
npm run build
```

### GitHub Pages デプロイ

このプロジェクトは GitHub Actions を使用して自動的に GitHub Pages にデプロイされます。

`.github/workflows/deploy.yml` が設定済みで、メインブランチへの push 時に自動デプロイが実行されます。

## 開発

### 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # プロダクションビルドのプレビュー
npm run check    # Biomeのコードチェック
```
