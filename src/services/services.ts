import api from '@/lib/api';
import { Service, ServiceFormData, PaginatedResponse } from '@/types';

export const servicesService = {
  getAll: async (): Promise<PaginatedResponse<Service>> => {
    const response = await api.get('/services');
    return response.data;
  },

  getById: async (id: number): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data.data;
  },

  create: async (data: ServiceFormData): Promise<Service> => {
    const response = await api.post('/services', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ServiceFormData>): Promise<Service> => {
    const response = await api.put(`/services/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
