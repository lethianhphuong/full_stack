import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  code?: number;
  status?: number;
  isCanceled?: boolean;
  raw?: unknown;
}

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/+$/, '');
export const API_BASE_URL = rawBaseUrl.endsWith('/api/v1') ? rawBaseUrl : `${rawBaseUrl}/api/v1`;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tu dong gan access token neu co va ngan ngua trung lap /api/v1
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Neu URL bat dau bang /api/v1, loai bo de tranh baseURL bi duplicate thanh /api/v1/api/v1/...
    if (config.url && config.url.startsWith('/api/v1')) {
      config.url = config.url.replace(/^\/api\/v1/, '') || '/';
    }

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeApiError(error))
);

// Response Interceptor: Tra truc tiep response.data va chuan hoa loi
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Khong xu ly cancel nhu loi he thong hien thi cho nguoi dung
    if (axios.isCancel(error)) {
      return Promise.reject({
        message: 'Request was canceled',
        isCanceled: true,
        raw: error,
      } as ApiError);
    }

    const normalizedError = normalizeApiError(error);

    // Xu ly loi 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('[apiClient] 401 Unauthorized: Phien dang nhap het han');
    }

    return Promise.reject(normalizedError);
  }
);

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isCancel(error)) {
    return {
      message: 'Request was canceled',
      isCanceled: true,
      raw: error,
    };
  }

  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<ApiResponse<unknown>>;
    const serverMessage = axiosErr.response?.data?.message;
    const status = axiosErr.response?.status;
    const code = axiosErr.response?.data?.code || status;

    let message = serverMessage || axiosErr.message || 'Đã có lỗi xảy ra khi kết nối máy chủ';
    if (status === 404) {
      message = serverMessage || 'Không tìm thấy tài nguyên yêu cầu (404)';
    } else if (status === 500) {
      message = serverMessage || 'Lỗi hệ thống máy chủ (500)';
    } else if (status === 403) {
      message = serverMessage || 'Bạn không có quyền thực hiện hành động này (403)';
    }

    return {
      message,
      code,
      status,
      isCanceled: false,
      raw: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isCanceled: false,
      raw: error,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'Lỗi không xác định',
    isCanceled: false,
    raw: error,
  };
}

export default apiClient;
