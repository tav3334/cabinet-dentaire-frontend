import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentsService } from '@/services/appointments';
import { AppointmentFormData } from '@/types';

interface UseAppointmentsParams {
  page?: number;
  per_page?: number;
  status?: string;
  patient_id?: number;
  date_from?: string;
  date_to?: string;
  include_trashed?: boolean;
  include?: string;
}

export function useAppointments(params?: UseAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsService.getAll(params),
  });
}

export function useAppointment(id: number, include?: string) {
  return useQuery({
    queryKey: ['appointment', id, include],
    queryFn: () => appointmentsService.getById(id, include),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentFormData) => appointmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AppointmentFormData> }) =>
      appointmentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', id] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useRestoreAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentsService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
