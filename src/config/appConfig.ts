type AppConfig = {
  apiOrigin: string;
  menuPath: string;
};

export const appConfig: AppConfig = {
  apiOrigin: import.meta.env.VITE_LOGIN_ORIGIN ?? "http://localhost:8000",
  menuPath: "/menu"
};
