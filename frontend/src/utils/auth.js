export function getTokenPayload() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getTokenPayload()?.role ?? null;
}

export function getUserName() {
  return getTokenPayload()?.fullname ?? null;
}

export function isTokenExpired(token = localStorage.getItem("accessToken")) {
  if (!token) return true;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return !exp || Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function hasStoredSession() {
  return !!localStorage.getItem("accessToken");
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
