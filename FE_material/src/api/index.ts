export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export { apiClient, default as api } from '../services/apiClient';
export * from '../services/apiClient';
