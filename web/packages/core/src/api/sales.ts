import { apiClient } from './client';
import { Sale, PaginatedResponse } from '../types';

export const saleApi = {
  list: (page = 1, perPage = 20) =>
    apiClient.get<PaginatedResponse<Sale>>('/sales', { page, per_page: perPage }),

  get: (id: string) =>
    apiClient.get<Sale>(`/sales/${id}`),

  create: (data: Omit<Sale, 'id' | 'created_at' | 'created_by'>) =>
    apiClient.post<Sale>('/sales', data),

  update: (id: string, data: Partial<Sale>) =>
    apiClient.put<Sale>(`/sales/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/sales/${id}`),

  activate: (id: string) =>
    apiClient.post<Sale>(`/sales/${id}/activate`, {}),

  complete: (id: string) =>
    apiClient.post<Sale>(`/sales/${id}/complete`, {}),

  listByCustomer: (customerId: string) =>
    apiClient.get<Sale[]>(`/customers/${customerId}/sales`),

  listByAgent: (agentId: string) =>
    apiClient.get<Sale[]>(`/agents/${agentId}/sales`),
};
