import api from '@/lib/api';
import { Treatment, TreatmentFormData, PaginatedResponse } from '@/types';

interface GetTreatmentsParams {
  page?: number;
  per_page?: number;
  patient_id?: number;
  status?: string;
  category?: string;
  include?: string;
}

export const treatmentsService = {
  getAll: async (params?: GetTreatmentsParams): Promise<PaginatedResponse<Treatment>> => {
    const response = await api.get('/treatments', { params });
    return response.data;
  },

  getById: async (id: number, include?: string): Promise<Treatment> => {
    const response = await api.get(`/treatments/${id}`, { params: { include } });
    return response.data.data;
  },

  create: async (data: TreatmentFormData): Promise<Treatment> => {
    const response = await api.post('/treatments', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<TreatmentFormData>): Promise<Treatment> => {
    const response = await api.put(`/treatments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/treatments/${id}`);
  },
};
