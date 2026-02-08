'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateConsultation } from '@/hooks/use-consultations';
import { ConsultationForm } from '@/components/consultations/consultation-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ConsultationFormData } from '@/types';

export default function NewConsultationPage() {
  const router = useRouter();
  const createMutation = useCreateConsultation();

  const handleSubmit = async (data: ConsultationFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Consultation créée avec succès');
      router.push('/consultations');
    } catch {
      // Géré par l'intercepteur Axios
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/consultations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle consultation</h1>
          <p className="text-muted-foreground">
            Enregistrer une nouvelle consultation
          </p>
        </div>
      </div>

      <ConsultationForm onSubmit={handleSubmit} onCancel={() => router.push('/consultations')} isLoading={createMutation.isPending} />
    </div>
  );
}
