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

## Push 通知連携（追加）

- Service Worker: `public/sw.js` を配信し、ログイン成功時に `navigator.serviceWorker.register(...)` を実行
- `vite.config.ts` の `base` が `/mobile/login/` のため、実際の SW URL は `/mobile/login/sw.js`
- Push 購読: `src/api/pushSubscription.ts` で `pushManager.getSubscription()` を確認し、未購読なら `subscribe(...)`
- 保存 API: ログインと同じ API 起点（`VITE_LOGIN_ORIGIN`）に対して `POST /save-subscription` を呼び出し
- 送信 payload: `username` と `subscription`（`subscription.toJSON()`）を送る

## Push 用環境変数

`.env` に以下を設定:

```env
VITE_VAPID_PUBLIC_KEY=...
```

- `VITE_VAPID_PUBLIC_KEY` は VAPID の公開鍵（クライアントに載るのが仕様）
- 秘密にすべきなのはサーバ側の VAPID 秘密鍵で、フロントには置かない

## デバッグログとエラー解釈

ログイン成功時に、次のログを出力する実装:

- Service Worker 登録成功/失敗
- Push Subscription の取得結果（既存再利用 or 新規作成）
- `save-subscription` 送信完了

次のエラーが出た場合:

`NotAllowedError: Registration failed - permission denied`

- Service Worker の登録自体は成功している
- 失敗は `pushManager.subscribe(...)` の権限チェックで発生
- 通知許可が拒否されている（`Notification.permission === "denied"` など）状態
