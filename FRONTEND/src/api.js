import axios from 'axios';
import { getAccessToken, getRefreshToken, isTokenExpired, setTokens, clearTokens } from './auth';

const envBase = (import.meta.env?.VITE_API_BASE || '').trim();
let baseURL = envBase;
if (!baseURL) {
  if (import.meta.env.DEV) {
    baseURL = 'http://localhost:5002';
  } else if (import.meta.env.PROD) {
    console.error('[api] VITE_API_BASE is REQUIRED in production. Set it to your backend Web Service URL.');
    baseURL = '';
  }
}

const api = axios.create({ baseURL });

api.interceptors.request.use(async (config) => {
  let token = getAccessToken();
  const refresh = getRefreshToken();


  if (!token && refresh) {
    try {
      const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
      const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
      setTokens(data.accessToken, refresh);
      token = data.accessToken;
    } catch (err) {
      clearTokens();
      token = null;
      try { window.location && (window.location.href = '/login'); } catch {}
    }
  }


  if (token && isTokenExpired(token)) {
    if (refresh) {
      try {
        const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
        const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
        setTokens(data.accessToken, refresh);
        token = data.accessToken;
      } catch (err) {
        clearTokens();
        token = null;
        try { window.location && (window.location.href = '/login'); } catch {}
      }
    } else {
      clearTokens();
      token = null;
      try { window.location && (window.location.href = '/login'); } catch {}
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

    if (status === 401 && originalRequest && !originalRequest._retry) {
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

    return Promise.reject(error);
  }
);

export default api;

