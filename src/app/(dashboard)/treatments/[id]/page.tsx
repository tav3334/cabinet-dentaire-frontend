'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTreatment } from '@/hooks/use-treatments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Pencil,
  User,
  Calendar,
  ClipboardList,
  DollarSign,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TreatmentStatus, TreatmentCategory } from '@/types';

const statusConfig: Record<TreatmentStatus, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  planned: { label: 'Planifié', color: 'outline' },
  in_progress: { label: 'En cours', color: 'secondary' },
  completed: { label: 'Terminé', color: 'default' },
  cancelled: { label: 'Annulé', color: 'destructive' },
  on_hold: { label: 'En attente', color: 'outline' },
};

const categoryLabels: Record<TreatmentCategory, string> = {
  consultation: 'Consultation',
  preventive: 'Préventif',
  restorative: 'Restauration',
  endodontic: 'Endodontie',
  periodontic: 'Parodontie',
  surgery: 'Chirurgie',
  prosthetic: 'Prothèse',
  orthodontic: 'Orthodontie',
  cosmetic: 'Esthétique',
  emergency: 'Urgence',
};

export default function TreatmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: treatment, isLoading } = useTreatment(
    parseInt(resolvedParams.id),
    'patient'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
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

  const config = statusConfig[treatment.status];
  const progressPercent = treatment.sessions_required
    ? ((treatment.sessions_completed || 0) / treatment.sessions_required) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/treatments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{treatment.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={config.color}>{config.label}</Badge>
              <Badge variant="outline">{categoryLabels[treatment.category]}</Badge>
              {treatment.tooth_number && (
                <Badge variant="outline">Dent: {treatment.tooth_number}</Badge>
              )}
            </div>
          </div>
        </div>
        <Link href={`/treatments/${treatment.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            {treatment.patient ? (
              <div>
                <p className="font-medium text-lg">
                  {treatment.patient.first_name} {treatment.patient.last_name}
                </p>
                <Link
                  href={`/patients/${treatment.patient.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Voir le dossier patient
                </Link>
              </div>
            ) : (
              <p className="text-muted-foreground">Patient non spécifié</p>
            )}
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {treatment.sessions_required ? (
              <>
                <Progress value={progressPercent} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {treatment.sessions_completed || 0} / {treatment.sessions_required} séances
                  terminées ({Math.round(progressPercent)}%)
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Nombre de séances non défini
              </p>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date prévue:</span>
              <span>
                {treatment.planned_date
                  ? format(new Date(treatment.planned_date), 'd MMMM yyyy', {
                      locale: fr,
                    })
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date de fin:</span>
              <span>
                {treatment.completed_date
                  ? format(new Date(treatment.completed_date), 'd MMMM yyyy', {
                      locale: fr,
                    })
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Créé le:</span>
              <span>
                {format(new Date(treatment.created_at), 'd MMMM yyyy', {
                  locale: fr,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Coûts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coût estimé:</span>
              <span>
                {treatment.estimated_cost ? `${treatment.estimated_cost} €` : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coût réel:</span>
              <span className="font-medium">
                {treatment.actual_cost ? `${treatment.actual_cost} €` : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {treatment.description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{treatment.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {treatment.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{treatment.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
