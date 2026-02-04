'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTreatment, useUpdateTreatment } from '@/hooks/use-treatments';
import { TreatmentForm } from '@/components/treatments/treatment-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { TreatmentFormData } from '@/types';

export default function EditTreatmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const treatmentId = parseInt(resolvedParams.id);
  const { data: treatment, isLoading } = useTreatment(treatmentId, 'patient');
  const updateMutation = useUpdateTreatment();

  const handleSubmit = async (data: TreatmentFormData) => {
    try {
      await updateMutation.mutateAsync({ id: treatmentId, data });
      toast.success('Traitement mis à jour');
      router.push(`/treatments/${treatmentId}`);
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

  if (!treatment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Traitement non trouvé</p>
        <Link href="/treatments">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/treatments/${treatmentId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier le traitement
          </h1>
          <p className="text-muted-foreground">{treatment.title}</p>
        </div>
      </div>

      <TreatmentForm
        treatment={treatment}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
