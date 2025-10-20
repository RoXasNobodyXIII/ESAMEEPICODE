import axios from 'axios';
import { getAccessToken, getRefreshToken, isTokenExpired, setTokens, clearTokens } from './auth';

<<<<<<< HEAD
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
=======
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
});

api.interceptors.request.use(async (config) => {
  let token = getAccessToken();

  if (token && isTokenExpired(token)) {
    const refresh = getRefreshToken();
>>>>>>> d11cca6 (first commit)
    if (refresh) {
      try {
        const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
        const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
        setTokens(data.accessToken, refresh);
        token = data.accessToken;
      } catch (err) {
        clearTokens();
        token = null;
<<<<<<< HEAD
=======
        // Redirect to login if we are about to make a protected call without token
        // Do not throw here to avoid breaking callers; the response interceptor will handle 401
>>>>>>> d11cca6 (first commit)
        try { window.location && (window.location.href = '/login'); } catch {}
      }
    } else {
      clearTokens();
      token = null;
      try { window.location && (window.location.href = '/login'); } catch {}
    }
  }

<<<<<<< HEAD

  config.headers = config.headers || {};
=======
>>>>>>> d11cca6 (first commit)
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

<<<<<<< HEAD
=======
    // If unauthorized, try a one-time refresh + retry logic
>>>>>>> d11cca6 (first commit)
    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const refreshUrl = `${api.defaults.baseURL.replace(/\/$/, '')}/auth/refresh`;
          const { data } = await axios.post(refreshUrl, { refreshToken: refresh });
          setTokens(data.accessToken, refresh);
<<<<<<< HEAD
=======
          // mark to avoid infinite loop
>>>>>>> d11cca6 (first commit)
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (e) {
<<<<<<< HEAD
        }
      }

=======
          // fallthrough to clear + redirect
        }
      }

      // No refresh token or refresh failed: clear and redirect
>>>>>>> d11cca6 (first commit)
      clearTokens();
      try { window.location && (window.location.href = '/login'); } catch {}
    }

    return Promise.reject(error);
  }
);

export default api;
