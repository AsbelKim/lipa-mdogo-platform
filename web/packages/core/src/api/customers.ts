import { apiClient } from './client';
import { Customer, PaginatedResponse } from '../types';

export const customerApi = {
  list: (page = 1, perPage = 20) =>
    apiClient.get<PaginatedResponse<Customer>>('/customers', { page, per_page: perPage }),

  get: (id: string) =>
    apiClient.get<Customer>(`/customers/${id}`),

  create: (data: Omit<Customer, 'id' | 'created_at' | 'company_id'>) =>
    apiClient.post<Customer>('/customers', data),

  update: (id: string, data: Partial<Customer>) =>
    apiClient.put<Customer>(`/customers/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/customers/${id}`),

  search: (query: string) =>
    apiClient.get<Customer[]>('/customers/search', { q: query }),
};
