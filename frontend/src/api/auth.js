import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token tidak ditemukan");
  }

  const response = await axios.put(`${baseUrl}/authentications`, {
    refreshToken,
  });

  const accessToken = response.data?.data?.accessToken;
  if (!accessToken) {
    throw new Error("Gagal memperbarui access token");
  }

  localStorage.setItem("accessToken", accessToken);
  return accessToken;
}
