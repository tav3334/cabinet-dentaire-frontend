import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationsService } from '@/services/consultations';
import { ConsultationFormData } from '@/types';

interface UseConsultationsParams {
  page?: number;
  per_page?: number;
  patient_id?: number;
  type?: string;
  include?: string;
}

export function useConsultations(params?: UseConsultationsParams) {
  return useQuery({
    queryKey: ['consultations', params],
    queryFn: () => consultationsService.getAll(params),
  });
}

export function useConsultation(id: number, include?: string) {
  return useQuery({
    queryKey: ['consultation', id, include],
    queryFn: () => consultationsService.getById(id, include),
    enabled: !!id,
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConsultationFormData) => consultationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ConsultationFormData> }) =>
      consultationsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => consultationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
  });
}
