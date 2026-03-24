type AppConfig = {
  apiOrigin: string;
  menuPath: string;
  menuLinks: {
    knowhow: string;
    goods: string;
    money: string;
    schedule: string;
    recipe: string;
  };
};

export const appConfig: AppConfig = {
  apiOrigin: import.meta.env.VITE_LOGIN_ORIGIN ?? "http://localhost:8000",
  menuPath: "/menu",
  menuLinks: {
    knowhow: "/mobile/knowhow/",
    goods: "/mobile/goods/",
    money: "/mobile/cache/",
    schedule: "/mobile/schedule/",
    recipe: "/mobile/recipe/"
  }
};
