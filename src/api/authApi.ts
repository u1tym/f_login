import { httpClient } from "./httpClient";

export type LoginRequest = {
  username: string;
  password: string;
};

export type MeResponse = {
  user: {
    id: number;
    username: string;
  };
};

export async function login(payload: LoginRequest): Promise<void> {
  await httpClient.post("/login", payload);
}

export async function logout(): Promise<void> {
  await httpClient.post("/logout");
}

export async function fetchMe(): Promise<MeResponse> {
  const response = await httpClient.get<MeResponse>("/me");
  return response.data;
}
