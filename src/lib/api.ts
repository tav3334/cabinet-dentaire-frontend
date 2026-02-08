import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Instance pour les requêtes CSRF
export const baseApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Fonction pour obtenir le cookie CSRF avant les requêtes d'auth
export const getCsrfCookie = async () => {
  await baseApi.get('/sanctum/csrf-cookie');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag pour éviter les boucles infinies de refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

// Response interceptor avec refresh token + gestion d'erreurs centralisée
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // --- Refresh token sur 401 ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si la requête qui a échoué est déjà /refresh ou /login, ne pas retry
      if (originalRequest.url?.includes('/refresh') || originalRequest.url?.includes('/login')) {
        forceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // File d'attente si un refresh est déjà en cours
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await getCsrfCookie();
        const response = await api.post('/refresh');
        const newToken = response.data.token;

        localStorage.setItem('token', newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- Gestion d'erreurs centralisée ---
    handleApiError(error);

    return Promise.reject(error);
  }
);

function forceLogout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Éviter de rediriger si déjà sur /login
    if (!window.location.pathname.includes('/login')) {
      toast.error('Session expirée', { description: 'Veuillez vous reconnecter.' });
      window.location.href = '/login';
    }
  }
}

function handleApiError(error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) {
  // Pas de réponse du serveur (réseau, timeout...)
  if (!error.response) {
    toast.error('Erreur réseau', {
      description: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
    });
    return;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      toast.error('Requête invalide', {
        description: data?.message || 'Les données envoyées sont invalides.',
      });
      break;

    case 403:
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas la permission d\'effectuer cette action.',
      });
      break;

    case 404:
      toast.error('Ressource introuvable', {
        description: data?.message || 'L\'élément demandé n\'existe pas.',
      });
      break;

    case 422:
      // Erreurs de validation Laravel — on laisse les formulaires les gérer
      // mais on affiche un toast général
      if (data?.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        toast.error('Erreur de validation', {
          description: firstError || 'Veuillez vérifier les champs du formulaire.',
        });
      }
      break;

    case 429:
      toast.error('Trop de requêtes', {
        description: 'Veuillez patienter quelques instants avant de réessayer.',
      });
      break;

    case 500:
    case 502:
    case 503:
      toast.error('Erreur serveur', {
        description: 'Une erreur interne est survenue. Réessayez plus tard.',
      });
      break;

    default:
      // 401 est déjà géré plus haut
      if (status !== 401) {
        toast.error('Erreur', {
          description: data?.message || 'Une erreur inattendue est survenue.',
        });
      }
      break;
  }
}

export default api;
