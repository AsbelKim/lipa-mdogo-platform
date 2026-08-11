import { apiClient } from './client';
import { Payment, PaginatedResponse } from '../types';

export const paymentApi = {
  list: (page = 1, perPage = 20) =>
    apiClient.get<PaginatedResponse<Payment>>('/payments', { page, per_page: perPage }),

  get: (id: string) =>
    apiClient.get<Payment>(`/payments/${id}`),

  create: (data: Omit<Payment, 'id' | 'created_at' | 'created_by' | 'status'>) =>
    apiClient.post<Payment>('/payments', data),

  verify: (id: string) =>
    apiClient.post<Payment>(`/payments/${id}/verify`, {}),

  reject: (id: string, reason: string) =>
    apiClient.post<Payment>(`/payments/${id}/reject`, { reason }),

  listBySale: (saleId: string) =>
    apiClient.get<Payment[]>(`/sales/${saleId}/payments`),

  listByAgent: (agentId: string) =>
    apiClient.get<Payment[]>(`/agents/${agentId}/payments`),
};
