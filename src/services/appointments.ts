import api from '@/lib/api';
import { Appointment, AppointmentFormData, PaginatedResponse } from '@/types';

interface GetAppointmentsParams {
  page?: number;
  per_page?: number;
  status?: string;
  patient_id?: number;
  date_from?: string;
  date_to?: string;
  include_trashed?: boolean;
  include?: string;
}

export const appointmentsService = {
  getAll: async (params?: GetAppointmentsParams): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getById: async (id: number, include?: string): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`, { params: { include } });
    return response.data.data;
  },

  create: async (data: AppointmentFormData): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<AppointmentFormData>): Promise<Appointment> => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },

  restore: async (id: number): Promise<Appointment> => {
    const response = await api.post(`/appointments/${id}/restore`);
    return response.data.data;
  },
};
