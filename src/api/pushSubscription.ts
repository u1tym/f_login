import { httpClient } from "./httpClient";

/**
 * ログイン済み Cookie を付けたまま Push 購読を登録する。
 * VAPID 公開鍵は `VITE_VAPID_PUBLIC_KEY`（`.env`）で指定する。
 */
export async function subscribePush(username: string): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("[Push] Service Worker または PushManager 非対応のため購読をスキップしました");
    return;
  }

  const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!applicationServerKey) {
    console.log("[Push] VITE_VAPID_PUBLIC_KEY 未設定のため購読をスキップしました");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    console.log("[Push] Push Subscription を取得しました（既存の購読を再利用）", {
      endpoint: subscription.endpoint
    });
  } else {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    console.log("[Push] Push Subscription を取得しました（新規購読）", {
      endpoint: subscription.endpoint
    });
  }

  await httpClient.post("/save-subscription", {
    username,
    subscription: subscription.toJSON()
  });
  console.log("[Push] save-subscription への送信が完了しました");
}
