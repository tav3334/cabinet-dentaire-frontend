import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsService } from '@/services/patients';
import { PatientFormData } from '@/types';

interface UsePatientsParams {
  page?: number;
  per_page?: number;
  search?: string;
  gender?: string;
  include?: string;
}

export function usePatients(params?: UsePatientsParams) {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => patientsService.getAll(params),
  });
}

export function usePatient(id: number, include?: string) {
  return useQuery({
    queryKey: ['patient', id, include],
    queryFn: () => patientsService.getById(id, include),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientFormData) => patientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PatientFormData> }) =>
      patientsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => patientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
