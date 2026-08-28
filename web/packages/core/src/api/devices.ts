import { apiClient } from './client';
import { CreateDeviceInput, Device, PaginatedResponse } from '../types';

export const deviceApi = {
  list: (page = 1, perPage = 20) =>
    apiClient.get<PaginatedResponse<Device>>('/devices', { page, per_page: perPage }),

  get: (id: string) =>
    apiClient.get<Device>(`/devices/${id}`),

  create: (data: CreateDeviceInput) =>
    apiClient.post<Device>('/devices', data),

  update: (id: string, data: Partial<Device>) =>
    apiClient.put<Device>(`/devices/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/devices/${id}`),

  assign: (id: string, agent_id: string) =>
    apiClient.post<Device>(`/devices/${id}/assign`, { agent_id }),

  unassign: (id: string) =>
    apiClient.post<Device>(`/devices/${id}/unassign`, {}),

  updateStatus: (id: string, status: string) =>
    apiClient.put<Device>(`/devices/${id}`, { status }),
};
