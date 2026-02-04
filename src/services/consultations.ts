import api from '@/lib/api';
import { Consultation, ConsultationFormData, PaginatedResponse } from '@/types';

interface GetConsultationsParams {
  page?: number;
  per_page?: number;
  patient_id?: number;
  type?: string;
  include?: string;
}

export const consultationsService = {
  getAll: async (params?: GetConsultationsParams): Promise<PaginatedResponse<Consultation>> => {
    const response = await api.get('/consultations', { params });
    return response.data;
  },

  getById: async (id: number, include?: string): Promise<Consultation> => {
    const response = await api.get(`/consultations/${id}`, { params: { include } });
    return response.data.data;
  },

  create: async (data: ConsultationFormData): Promise<Consultation> => {
    const response = await api.post('/consultations', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ConsultationFormData>): Promise<Consultation> => {
    const response = await api.put(`/consultations/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/consultations/${id}`);
  },
};
