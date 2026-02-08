'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePatient, useUpdatePatient } from '@/hooks/use-patients';
import { PatientForm } from '@/components/patients/patient-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PatientFormData } from '@/types';

export default function EditPatientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const patientId = parseInt(resolvedParams.id);
  const { data: patient, isLoading } = usePatient(patientId);
  const updateMutation = useUpdatePatient();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await updateMutation.mutateAsync({ id: patientId, data });
      toast.success('Patient mis à jour avec succès');
      router.push(`/patients/${patientId}`);
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

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Patient non trouvé</p>
        <Link href="/patients">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href={`/patients/${patientId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier {patient.first_name} {patient.last_name}
          </h1>
          <p className="text-muted-foreground">
            Modifier les informations du patient
          </p>
        </div>
      </div>

      <PatientForm
        patient={patient}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/patients/${patientId}`)}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
