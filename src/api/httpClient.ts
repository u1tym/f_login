import axios from "axios";
import { appConfig } from "../config/appConfig";

export const httpClient = axios.create({
  baseURL: appConfig.apiOrigin,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});
