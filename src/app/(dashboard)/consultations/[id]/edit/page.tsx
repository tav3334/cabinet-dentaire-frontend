'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useConsultation, useUpdateConsultation } from '@/hooks/use-consultations';
import { ConsultationForm } from '@/components/consultations/consultation-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ConsultationFormData } from '@/types';

export default function EditConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const consultationId = parseInt(resolvedParams.id);
  const { data: consultation, isLoading } = useConsultation(consultationId, 'patient');
  const updateMutation = useUpdateConsultation();

  const handleSubmit = async (data: ConsultationFormData) => {
    try {
      await updateMutation.mutateAsync({ id: consultationId, data });
      toast.success('Consultation mise à jour');
      router.push(`/consultations/${consultationId}`);
    } catch {
      // Géré par l'intercepteur Axios
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

  if (!consultation) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Consultation non trouvée</p>
        <Link href="/consultations">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/consultations/${consultationId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier la consultation
          </h1>
          <p className="text-muted-foreground">
            {consultation.patient?.first_name} {consultation.patient?.last_name}
          </p>
        </div>
      </div>

      <ConsultationForm
        consultation={consultation}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/consultations/${consultationId}`)}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
