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
    knowhow: "knowhow/",
    goods: "goods/",
    money: "cache/",
    schedule: "schedule/",
    recipe: "recipe/"
  }
};
