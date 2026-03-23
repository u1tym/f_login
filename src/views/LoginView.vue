<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../api/authApi";
import { appConfig } from "../config/appConfig";

const router = useRouter();

const form = reactive({
  username: "",
  password: ""
});
const loading = ref(false);
const errorMessage = ref("");

async function onSubmit(): Promise<void> {
  errorMessage.value = "";
  loading.value = true;

  try {
    await login({
      username: form.username,
      password: form.password
    });
    await router.push(appConfig.menuPath);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      errorMessage.value = error.response?.data?.detail ?? "ログインに失敗しました";
    } else {
      errorMessage.value = "ログインに失敗しました";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="phone-shell">
    <section class="card">
      <h1 class="title">ログイン</h1>

      <form class="form" @submit.prevent="onSubmit">
        <label class="label" for="username">ユーザー名</label>
        <input id="username" v-model="form.username" class="input" type="text" required />

        <label class="label" for="password">パスワード</label>
        <input id="password" v-model="form.password" class="input" type="password" required />

        <button class="button" type="submit" :disabled="loading">
          {{ loading ? "ログイン中..." : "ログイン" }}
        </button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </section>
  </main>
</template>
