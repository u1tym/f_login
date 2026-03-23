import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import MenuView from "../views/MenuView.vue";
import { appConfig } from "../config/appConfig";
import { fetchMe } from "../api/authApi";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginView },
    { path: appConfig.menuPath, name: "menu", component: MenuView }
  ]
});

router.beforeEach(async (to) => {
  if (to.path === "/login") {
    return true;
  }

  try {
    await fetchMe();
    return true;
  } catch {
    return { path: "/login" };
  }
});
