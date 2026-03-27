<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchMe, logout } from "../api/authApi";
import { appConfig } from "../config/appConfig";
import portalImg from "../assets/menu/PORTAL.jpg";
import knowhowImg from "../assets/menu/KNOWHOW.jpg";
import goodsImg from "../assets/menu/GOODS.jpg";
import moneyImg from "../assets/menu/MONEY.jpg";
import scheduleImg from "../assets/menu/SCHEDULE.jpg";
import recipeImg from "../assets/menu/RECIPE.png";
import routineImg from "../assets/menu/ROUTINE.jpg";

type MenuItem = {
  href: string;
  ariaLabel: string;
  image: string;
};

const router = useRouter();
const loading = ref(true);
const username = ref("");

const menuItems = computed<MenuItem[]>(() => [
  { href: appConfig.menuLinks.knowhow, ariaLabel: "ノウハウ", image: knowhowImg },
  { href: appConfig.menuLinks.goods, ariaLabel: "グッズ", image: goodsImg },
  { href: appConfig.menuLinks.money, ariaLabel: "お金", image: moneyImg },
  { href: appConfig.menuLinks.schedule, ariaLabel: "スケジュール", image: scheduleImg },
  { href: appConfig.menuLinks.recipe, ariaLabel: "レシピ", image: recipeImg },
  { href: appConfig.menuLinks.routine, ariaLabel: "ルーティーン", image: routineImg }
]);

async function loadUser(): Promise<void> {
  loading.value = true;
  try {
    const response = await fetchMe();
    username.value = response.user.username;
  } catch {
    await router.push("/login");
  } finally {
    loading.value = false;
  }
}

function moveToMenuItem(path: string): void {
  const url = new URL(path, window.location.href);
  const nonce = Math.floor(Math.random() * 999999999) + 1;
  url.searchParams.set("a", String(nonce));
  window.location.assign(url.href);
}

async function onLogout(): Promise<void> {
  try {
    await logout();
  } finally {
    await router.push("/login");
  }
}

onMounted(loadUser);
</script>

<template>
  <main class="menu-root">
    <div v-if="loading" class="loading">読み込み中...</div>
    <div v-else class="wrap">
      <header class="top-row">
        <p class="username">{{ username }}</p>
        <button class="logout-btn" type="button" @click="onLogout">ログアウト</button>
      </header>

      <h1 class="site-title">PORTAL</h1>
      <nav class="pentagon" aria-label="メインメニュー">
        <div class="pentagon-center">
          <img :src="portalImg" alt="PORTAL" width="400" height="400" />
        </div>
        <a
          v-for="(item, index) in menuItems"
          :key="item.href"
          href="#"
          :aria-label="item.ariaLabel"
          :style="{ '--i': index, '--count': menuItems.length }"
          @click.prevent="moveToMenuItem(item.href)"
        >
          <img :src="item.image" alt="" width="400" height="400" />
        </a>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.menu-root {
  --cream-top: #fff9ec;
  --cream-mid: #fff2d9;
  --cream-bottom: #f2e4c8;
  --icon-border: #5c3d2e;
  --icon-border-soft: #7a5542;
  --ink: #2f2118;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --top-icon-rise: min(46vw, 21dvh, 172px);
}

* {
  box-sizing: border-box;
}

.menu-root {
  min-height: 100dvh;
  overflow: hidden;
  color: var(--ink);
  background-color: var(--cream-mid);
  background-image: linear-gradient(168deg, var(--cream-top) 0%, var(--cream-mid) 42%, var(--cream-bottom) 100%);
}

.loading {
  min-height: 100dvh;
  display: grid;
  place-items: center;
}

.wrap {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 0 clamp(0.75rem, 4vw, 1.1rem) calc(0.5rem + var(--safe-bottom));
}

.top-row {
  position: absolute;
  top: calc(var(--safe-top) + 10px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  z-index: 5;
}

.username {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.75;
}

.logout-btn {
  border: 0;
  border-radius: 12px;
  background: rgba(47, 33, 24, 0.14);
  color: var(--ink);
  padding: 7px 10px;
  font-size: 0.8rem;
}

.site-title {
  position: absolute;
  top: calc(var(--safe-top) + clamp(1.1rem, (50dvh - var(--top-icon-rise)) / 2, 44dvh));
  left: 0;
  right: 0;
  z-index: 3;
  margin: 0;
  transform: translateY(-50%);
  padding-bottom: clamp(1rem, 4dvh, 1.75rem);
  pointer-events: none;
  text-align: center;
  font-size: clamp(1.12rem, 5.4vw, 1.58rem);
  font-weight: 600;
  letter-spacing: 0.48em;
  text-indent: 0.48em;
  color: rgba(47, 33, 24, 0.78);
  text-transform: uppercase;
}

.pentagon-center img,
.pentagon a img {
  border-radius: 50%;
  border: 3px solid var(--icon-border);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.35) inset, 0 10px 22px rgba(62, 42, 32, 0.2),
    0 4px 10px rgba(62, 42, 32, 0.14), 0 0 0 1px var(--icon-border-soft);
}

.pentagon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(92vw, 360px);
  max-width: 100%;
  max-height: min(92vw, 360px, 82dvh);
  aspect-ratio: 1;
  container-type: size;
  container-name: portal-pentagon;
}

.pentagon-center {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 35cqmin;
  max-width: 120px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.pentagon-center img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
}

.pentagon a {
  --i: 0;
  --count: 6;
  --step: calc(360deg / var(--count));
  --orbit: 38cqmin;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  width: 28cqmin;
  max-width: 104px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  transform: translate(-50%, -50%) rotate(calc(var(--i) * var(--step))) translateY(calc(-1 * var(--orbit)))
    rotate(calc(-1 * var(--i) * var(--step)));
  transform-origin: center center;
  transition: transform 0.18s ease, opacity 0.18s ease;
  touch-action: manipulation;
}

.pentagon a:active {
  transform: translate(-50%, -50%) rotate(calc(var(--i) * var(--step))) translateY(calc(-1 * var(--orbit)))
    rotate(calc(-1 * var(--i) * var(--step))) scale(0.94);
  opacity: 0.9;
}

.pentagon a img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 1;
  object-fit: cover;
}

@supports not (width: 1cqmin) {
  .pentagon-center {
    width: min(32vw, 15.5dvh, 112px);
  }

  .pentagon a {
    --orbit: min(35vw, 17dvh, 132px);
    width: min(26vw, 12.8dvh, 96px);
  }
}
</style>
