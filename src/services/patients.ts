import api from '@/lib/api';
import { Patient, PatientFormData, PaginatedResponse } from '@/types';

interface GetPatientsParams {
  page?: number;
  per_page?: number;
  search?: string;
  gender?: string;
  include?: string;
}

export const patientsService = {
  getAll: async (params?: GetPatientsParams): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  getById: async (id: number, include?: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`, { params: { include } });
    return response.data.data;
  },

  create: async (data: PatientFormData): Promise<Patient> => {
    const response = await api.post('/patients', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<PatientFormData>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },
};
