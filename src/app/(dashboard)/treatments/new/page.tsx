'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateTreatment } from '@/hooks/use-treatments';
import { TreatmentForm } from '@/components/treatments/treatment-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { TreatmentFormData } from '@/types';

export default function NewTreatmentPage() {
  const router = useRouter();
  const createMutation = useCreateTreatment();

  const handleSubmit = async (data: TreatmentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('Traitement créé avec succès');
      router.push('/treatments');
    } catch {
      // Géré par l'intercepteur Axios
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/treatments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouveau traitement</h1>
          <p className="text-muted-foreground">
            Créer un nouveau plan de traitement
          </p>
        </div>
      </div>

      <TreatmentForm onSubmit={handleSubmit} onCancel={() => router.push('/treatments')} isLoading={createMutation.isPending} />
    </div>
  );
}
