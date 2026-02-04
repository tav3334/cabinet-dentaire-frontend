import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentsService } from '@/services/treatments';
import { TreatmentFormData } from '@/types';

interface UseTreatmentsParams {
  page?: number;
  per_page?: number;
  patient_id?: number;
  status?: string;
  category?: string;
  include?: string;
}

export function useTreatments(params?: UseTreatmentsParams) {
  return useQuery({
    queryKey: ['treatments', params],
    queryFn: () => treatmentsService.getAll(params),
  });
}

export function useTreatment(id: number, include?: string) {
  return useQuery({
    queryKey: ['treatment', id, include],
    queryFn: () => treatmentsService.getById(id, include),
    enabled: !!id,
  });
}

export function useCreateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TreatmentFormData) => treatmentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
  });
}

export function useUpdateTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TreatmentFormData> }) =>
      treatmentsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
      queryClient.invalidateQueries({ queryKey: ['treatment', id] });
    },
  });
}

export function useDeleteTreatment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => treatmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatments'] });
    },
  });
}
