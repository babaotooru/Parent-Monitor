import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const userAPI = {
  getAll: () => apiClient.get('/users'),
  getById: (id) => apiClient.get(`/users/${id}`),
  create: (data) => apiClient.post('/users', data),
  update: (id, data) => apiClient.put(`/users/${id}`, data),
  delete: (id) => apiClient.delete(`/users/${id}`),
  login: (credentials) => apiClient.post('/users/login', credentials),
  biometricLogin: (data) => apiClient.post('/users/biometric-login', data),
};

export const outputAPI = {
  getGuardianDashboard: (parentId) => apiClient.get(`/outputs/guardian-dashboard/${parentId}`),
  getMedicineLog: (userId) => apiClient.get(`/outputs/medicine-log/${userId}`),
  getActivityMonitoring: (userId) => apiClient.get(`/outputs/activity-monitoring/${userId}`),
  getFallDetection: (userId) => apiClient.get(`/outputs/fall-detection/${userId}`),
  getEmergencyAlert: (emergencyId) => apiClient.get(`/outputs/emergency-alert/${emergencyId}`),
  getLocationMonitoring: (userId) => apiClient.get(`/outputs/location-monitoring/${userId}`),
  getSafetyScore: (userId) => apiClient.get(`/outputs/safety-score/${userId}`),
  getHealthReport: (userId, period = 'weekly') => apiClient.get(`/outputs/health-report/${userId}?period=${period}`),
  getAdminMonitoring: () => apiClient.get('/outputs/admin-monitoring'),
};

export const activityAPI = {
  getByUser: (userId) => apiClient.get(`/activity/user/${userId}`),
  getLatest: (userId) => apiClient.get(`/activity/user/${userId}/latest`),
  create: (data) => apiClient.post('/activity', data),
  getAnomalies: () => apiClient.get('/activity/anomalies'),
  learnRoutine: (userId) => apiClient.get(`/activity/user/${userId}/learn-routine`),
};

export const emergencyAPI = {
  getByUser: (userId) => apiClient.get(`/emergency/user/${userId}`),
  create: (data) => apiClient.post('/emergency', data),
  getPending: () => apiClient.get('/emergency/pending'),
  getCritical: () => apiClient.get('/emergency/critical'),
  acknowledge: (id, guardianId) => apiClient.put(`/emergency/${id}/acknowledge?guardianId=${guardianId}`),
  resolve: (id, response) => apiClient.put(`/emergency/${id}/resolve`, response),
};

export const fallDetectionAPI = {
  getByUser: (userId) => apiClient.get(`/fall-detection/user/${userId}`),
  create: (data) => apiClient.post('/fall-detection', data),
  getRecent: () => apiClient.get('/fall-detection/recent'),
};

export const locationAPI = {
  getByUser: (userId) => apiClient.get(`/location/user/${userId}`),
  create: (data) => apiClient.post('/location', data),
  getLatest: (userId) => apiClient.get(`/location/user/${userId}/latest`),
};

export const medicineAPI = {
  getByUser: (userId) => apiClient.get(`/medicine/user/${userId}`),
  create: (data) => apiClient.post('/medicine', data),
  update: (id, data) => apiClient.put(`/medicine/${id}`, data),
  delete: (id) => apiClient.delete(`/medicine/${id}`),
  markTaken: (id) => apiClient.put(`/medicine/${id}/taken`),
  getDueReminders: (userId) => apiClient.get(`/medicine/user/${userId}/due`),
};

export const safetyScoreAPI = {
  getByUser: (userId) => apiClient.get(`/safety-score/user/${userId}`),
  getLatest: (userId) => apiClient.get(`/safety-score/user/${userId}/latest`),
  calculate: (userId) => apiClient.get(`/safety-score/user/${userId}/calculate`),
};

export const dashboardAPI = {
  getGuardianDashboard: (guardianId) => apiClient.get(`/dashboard/guardian/${guardianId}`),
  getParentAnalytics: (userId) => apiClient.get(`/dashboard/parent/${userId}/analytics`),
};

export const videoAPI = {
  initiate: (data) => apiClient.post('/video/initiate', data),
  start: (sessionId) => apiClient.put(`/video/${sessionId}/start`),
  end: (sessionId) => apiClient.put(`/video/${sessionId}/end`),
  history: (parentId, guardianId) => apiClient.get(`/video/history?parentId=${parentId}&guardianId=${guardianId}`),
  last: (parentId, guardianId) => apiClient.get(`/video/last?parentId=${parentId}&guardianId=${guardianId}`),
};

// Communication helpers (client-side, no backend needed)
export const communicationHelper = {
  openWhatsApp: (phoneNumber, message = '') => {
    const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
    const number = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
    const url = message
      ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
      : `https://wa.me/${number}`;
    window.open(url, '_blank');
  },
  makePhoneCall: (phoneNumber) => {
    const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
    window.open(`tel:${cleaned}`, '_self');
  },
  sendEmail: (email, subject = '', body = '') => {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  },
  openVideoCall: (roomId) => {
    const url = `https://meet.jit.si/ParentCare-${roomId}`;
    window.open(url, '_blank', 'width=1200,height=800');
    return url;
  },
};

export default apiClient;
