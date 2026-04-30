import { httpClient } from "./httpClient";

/**
 * ログイン済み Cookie を付けたまま Push 購読を登録する。
 * VAPID 公開鍵は `VITE_VAPID_PUBLIC_KEY`（`.env`）で指定する。
 */
export async function subscribePush(username: string): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return
  }

  const applicationServerKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!applicationServerKey) {
    return
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    })
  }

  console.log(subscription.toJSON())

  await httpClient.post("/save-subscription", {
    username,
    subscription: subscription.toJSON()
  })
}
