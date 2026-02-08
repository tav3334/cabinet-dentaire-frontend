'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AppointmentFormData } from '@/types';

export default function NewAppointmentPage() {
  const router = useRouter();
  const createMutation = useCreateAppointment();

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Rendez-vous créé avec succès');
      router.push('/appointments');
    } catch (error: unknown) {
      console.error('Erreur création rendez-vous:', error);
      const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création';
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0]?.[0];
        toast.error(firstError || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau rendez-vous</h1>
          <p className="text-muted-foreground">
            Planifier un nouveau rendez-vous
          </p>
        </div>
      </div>

      <AppointmentForm onSubmit={handleSubmit} onCancel={() => router.push('/appointments')} isLoading={createMutation.isPending} />
    </div>
  );
}
