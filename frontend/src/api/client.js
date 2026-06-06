import axios from "axios";
import { refreshAccessToken } from "./auth";
import { clearAuth } from "../utils/auth";

const baseUrl = import.meta.env.VITE_API_URL;

let refreshPromise = null;

function notifySessionExpired() {
  clearAuth();
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
}

async function getValidAccessToken() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    const isExpired = !exp || Date.now() >= exp * 1000;
    if (!isExpired) return token;
  } catch {
    // Token malformed — try refresh below
  }

  if (!localStorage.getItem("refreshToken")) {
    notifySessionExpired();
    throw new Error("Sesi telah berakhir, silakan login kembali");
  }

  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch((error) => {
        notifySessionExpired();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiClient(
  endpoint,
  { method = "GET", data, customHeaders, _retried = false, ...customConfig } = {},
) {
  const token = await getValidAccessToken();

  const isFormData = data instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    url: `${baseUrl}${endpoint}`,
    headers,
    ...customConfig,
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401 && !_retried && localStorage.getItem("refreshToken")) {
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken()
            .catch((refreshError) => {
              notifySessionExpired();
              throw refreshError;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return apiClient(endpoint, {
          method,
          data,
          customHeaders,
          _retried: true,
          ...customConfig,
        });
      } catch {
        return Promise.reject(
          new Error("Sesi telah berakhir, silakan login kembali"),
        );
      }
    }

    if (status === 401) {
      notifySessionExpired();
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
}
