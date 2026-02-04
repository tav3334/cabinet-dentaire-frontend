'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppointment, useUpdateAppointment } from '@/hooks/use-appointments';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AppointmentFormData } from '@/types';

export default function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const appointmentId = parseInt(resolvedParams.id);
  const { data: appointment, isLoading } = useAppointment(appointmentId, 'patient,service');
  const updateMutation = useUpdateAppointment();

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      await updateMutation.mutateAsync({ id: appointmentId, data });
      toast.success('Rendez-vous mis à jour');
      router.push(`/appointments/${appointmentId}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Rendez-vous non trouvé</p>
        <Link href="/appointments">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/appointments/${appointmentId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier le rendez-vous
          </h1>
          <p className="text-muted-foreground">
            {appointment.patient?.full_name || appointment.name}
          </p>
        </div>
      </div>

      <AppointmentForm
        appointment={appointment}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
