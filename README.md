# f_login (Vue + TypeScript)

FastAPI 認証 API（`/login` `/me` `/logout`）を Cookie ベースで利用する、スマホ向けの最小フロントエンドです。

## 前提

- Node.js 20 以上
- 認証 API が CORS で `Allow-Credentials: true` を許可済み
- API 側 Cookie は `HttpOnly` のため、フロントからは直接参照しない

## セットアップ

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数ファイルを作成

```bash
cp .env.example .env
```

Windows PowerShell の場合:

```powershell
Copy-Item .env.example .env
```

3. `.env` の `VITE_LOGIN_ORIGIN` を認証 API の起点 URL に変更

例:

```env
VITE_LOGIN_ORIGIN=https://example.com/api/auth
```

## 起動

```bash
npm run dev
```

## 実装ポイント

- axios のデフォルト設定で `withCredentials: true` を有効化（`src/api/httpClient.ts`）
- `POST /login` でログインし、成功時は `menu` 画面へ遷移（`src/views/LoginView.vue`）
- `GET /me` でログイン状態を確認（`src/views/MenuView.vue`, `src/router/index.ts`）
- `POST /logout` を呼ぶだけで API 側が Cookie を削除（`src/views/MenuView.vue`）
- Cookie はブラウザ管理なので、Vue Router のページ遷移をまたいで自動送信される

## 設定値

- API 起点: `src/config/appConfig.ts` の `apiOrigin`（`VITE_LOGIN_ORIGIN` を参照）
- メニュー URL: `src/config/appConfig.ts` の `menuPath`

## 補足（API 仕様との対応）

- `/login` の成功レスポンスは本文利用せず、Cookie セットを前提に遷移
- `/me` は `200` で `user` を表示、`401` の場合はログイン画面へ戻す
- `/logout` は結果にかかわらずログイン画面へ遷移
