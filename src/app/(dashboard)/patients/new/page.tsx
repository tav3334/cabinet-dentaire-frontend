'use client';

import { useRouter } from 'next/navigation';
import { useCreatePatient } from '@/hooks/use-patients';
import { PatientForm } from '@/components/patients/patient-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PatientFormData } from '@/types';

export default function NewPatientPage() {
  const router = useRouter();
  const createMutation = useCreatePatient();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Patient créé avec succès');
      router.push('/patients');
    } catch {
      // Géré par l'intercepteur Axios
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau patient</h1>
          <p className="text-muted-foreground">
            Créer un nouveau dossier patient
          </p>
        </div>
      </div>

      <PatientForm onSubmit={handleSubmit} onCancel={() => router.push('/patients')} isLoading={createMutation.isPending} />
    </div>
  );
}
