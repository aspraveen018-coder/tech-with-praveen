import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

export const resourcesAPI = {
  getAll: () => api.get('/resources'),
  getById: (id) => api.get(`/resources/${id}`),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
};

export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const roadmapsAPI = {
  getAll: () => api.get('/roadmaps'),
  getById: (id) => api.get(`/roadmaps/${id}`),
  create: (data) => api.post('/roadmaps', data),
  update: (id, data) => api.put(`/roadmaps/${id}`, data),
  delete: (id) => api.delete(`/roadmaps/${id}`),
};

export const sessionsAPI = {
  getAll: () => api.get('/sessions'),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
};

export const downloadsAPI = {
  getAll: () => api.get('/downloads'),
  getById: (id) => api.get(`/downloads/${id}`),
  create: (data) => api.post('/downloads', data),
  update: (id, data) => api.put(`/downloads/${id}`, data),
  delete: (id) => api.delete(`/downloads/${id}`),
};

export const recentLinksAPI = {
  getAll: () => api.get('/recent-links'),
  getById: (id) => api.get(`/recent-links/${id}`),
  create: (data) => api.post('/recent-links', data),
  update: (id, data) => api.put(`/recent-links/${id}`, data),
  delete: (id) => api.delete(`/recent-links/${id}`),
};

export const communityAPI = {
  get: () => api.get('/community'),
  update: (data) => api.put('/community', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getAnalytics: () => api.get('/dashboard/analytics'),
};

export default api;