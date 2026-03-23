<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchMe, logout } from "../api/authApi";

const router = useRouter();
const username = ref("");
const loading = ref(true);
const errorMessage = ref("");

async function loadUser(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetchMe();
    username.value = response.user.username;
  } catch {
    await router.push("/login");
  } finally {
    loading.value = false;
  }
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
  <main class="phone-shell">
    <section class="card">
      <h1 class="title">Menu</h1>

      <p v-if="loading">読み込み中...</p>
      <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
      <template v-else>
        <p class="welcome">こんにちは、{{ username }} さん</p>
        <button class="button button-secondary" type="button" @click="onLogout">ログアウト</button>
      </template>
    </section>
  </main>
</template>
