import axios from "axios";
import { API_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err.response?.data || err);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login",    data),
  getMe:    ()     => api.get("/auth/me"),
};

// ── Hostels ───────────────────────────────────────────────────
export const hostelAPI = {
  getAll:    (params) => api.get("/hostels",         { params }),
  getNearby: (params) => api.get("/hostels/nearby",  { params }),
  getById:   (id)     => api.get(`/hostels/${id}`),
  create:    (data)   => api.post("/hostels",         data),
  update:    (id, data) => api.put(`/hostels/${id}`,  data),
  delete:    (id)     => api.delete(`/hostels/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────
export const bookingAPI = {
  getAll:  ()     => api.get("/bookings"),
  create:  (data) => api.post("/bookings",          data),
  cancel:  (id)   => api.put(`/bookings/${id}/cancel`),
};

// ── Waiting List ──────────────────────────────────────────────
export const waitingAPI = {
  getAll:        ()   => api.get("/waiting-list"),
  getMine:       ()   => api.get("/waiting-list/mine"),
  assign:        (id) => api.put(`/waiting-list/${id}/assign`),
  remove:        (id) => api.delete(`/waiting-list/${id}`),
};

export default api;