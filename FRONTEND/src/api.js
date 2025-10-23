import axios from 'axios';
import { getAccessToken, getRefreshToken, isTokenExpired, setTokens, clearTokens } from './auth';

const envBase = (import.meta.env?.VITE_API_BASE || '').trim();
const baseURL = envBase;

const api = axios.create({ baseURL });

function isAuthRequest(url) {
  try {
    const u = new URL(url, api.defaults.baseURL);
    return u.pathname.startsWith('/auth/');
  } catch {
    return typeof url === 'string' && url.includes('/auth/');
  }
}

api.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  const refresh = getRefreshToken();

  if (!token && refresh && !isAuthRequest(config.url || '')) {
    try {
      const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
      const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
      setTokens(data.accessToken, refresh);
      token = data.accessToken;
    } catch (err) {
      clearTokens();
      token = null;
      if (!isAuthRequest(config.url || '')) {
        try { window.location && (window.location.href = '/login'); } catch {}
      }
    }
  }

  if (token && isTokenExpired(token) && !isAuthRequest(config.url || '')) {
    if (refresh) {
      try {
        const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
        const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
        setTokens(data.accessToken, refresh);
        token = data.accessToken;
      } catch (err) {
        clearTokens();
        token = null;
        if (!isAuthRequest(config.url || '')) {
          try { window.location && (window.location.href = '/login'); } catch {}
        }
      }
    } else {
      clearTokens();
      token = null;
      if (!isAuthRequest(config.url || '')) {
        try { window.location && (window.location.href = '/login'); } catch {}
      }
    }
  }

  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !isAuthRequest(originalRequest.url || '')) {
      if (!originalRequest._retry) {
        const refresh = getRefreshToken();
        if (refresh) {
          try {
            const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
            const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
            setTokens(data.accessToken, refresh);
            originalRequest._retry = true;
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(originalRequest);
          } catch (e) {
          }
        }

        clearTokens();
        try { window.location && (window.location.href = '/login'); } catch {}
      }
    }

    return Promise.reject(error);
  }
);

export default api;

