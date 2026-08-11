import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, ApiError } from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status,
        };
        if (error.response?.data) {
          apiError.errors = (error.response.data as any).errors;
        }
        return Promise.reject(apiError);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('auth_token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', { email, password });
    this.setToken(response.data.token);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Generic GET
  get<T>(url: string, params?: any) {
    return this.client.get<T>(url, { params });
  }

  // Generic POST
  post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  // Generic PUT
  put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  // Generic DELETE
  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
