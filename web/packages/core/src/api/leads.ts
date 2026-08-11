import { apiClient } from './client';
import { Lead, PaginatedResponse } from '../types';

export const leadApi = {
  list: (page = 1, perPage = 20) =>
    apiClient.get<PaginatedResponse<Lead>>('/leads', { page, per_page: perPage }),

  get: (id: string) =>
    apiClient.get<Lead>(`/leads/${id}`),

  create: (data: Omit<Lead, 'id' | 'created_at' | 'created_by' | 'company_id'>) =>
    apiClient.post<Lead>('/leads', data),

  update: (id: string, data: Partial<Lead>) =>
    apiClient.put<Lead>(`/leads/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/leads/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.put<Lead>(`/leads/${id}`, { status }),

  convert: (id: string, customerId: string) =>
    apiClient.post<Lead>(`/leads/${id}/convert`, { customer_id: customerId }),

  listByAgent: (agentId: string) =>
    apiClient.get<Lead[]>(`/agents/${agentId}/leads`),
};
