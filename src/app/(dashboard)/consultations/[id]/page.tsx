'use client';

import { use } from 'react';
import Link from 'next/link';
import { useConsultation } from '@/hooks/use-consultations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Pencil,
  User,
  Calendar,
  FileText,
  Stethoscope,
  Pill,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ConsultationType } from '@/types';

const typeConfig: Record<ConsultationType, { label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  first_visit: { label: 'Première visite', color: 'default' },
  follow_up: { label: 'Suivi', color: 'secondary' },
  emergency: { label: 'Urgence', color: 'destructive' },
  control: { label: 'Contrôle', color: 'outline' },
  treatment: { label: 'Traitement', color: 'secondary' },
};

export default function ConsultationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: consultation, isLoading } = useConsultation(
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

  const config = typeConfig[consultation.type];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/consultations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Consultation du{' '}
              {format(new Date(consultation.consultation_date), 'd MMMM yyyy', {
                locale: fr,
              })}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={config.color}>{config.label}</Badge>
              {consultation.consultation_time && (
                <span className="text-muted-foreground">
                  à {consultation.consultation_time}
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/consultations/${consultation.id}/edit`}>
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
            {consultation.patient ? (
              <div>
                <p className="font-medium text-lg">
                  {consultation.patient.first_name} {consultation.patient.last_name}
                </p>
                <Link
                  href={`/patients/${consultation.patient.id}`}
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

        {/* Chief Complaint */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Motif de consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">
              {consultation.chief_complaint || 'Non spécifié'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Examination */}
      {(consultation.clinical_examination ||
        consultation.oral_hygiene ||
        consultation.periodontal_status) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Examen clinique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.clinical_examination && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Examen clinique
                </p>
                <p className="whitespace-pre-wrap">
                  {consultation.clinical_examination}
                </p>
              </div>
            )}
            {consultation.oral_hygiene && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Hygiène bucco-dentaire
                </p>
                <Badge variant="outline">
                  {consultation.oral_hygiene === 'excellent'
                    ? 'Excellente'
                    : consultation.oral_hygiene === 'good'
                    ? 'Bonne'
                    : consultation.oral_hygiene === 'moderate'
                    ? 'Moyenne'
                    : consultation.oral_hygiene === 'poor'
                    ? 'Mauvaise'
                    : consultation.oral_hygiene}
                </Badge>
              </div>
            )}
            {consultation.periodontal_status && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  État parodontal
                </p>
                <p className="whitespace-pre-wrap">
                  {consultation.periodontal_status}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Diagnosis & Treatment */}
      <div className="grid gap-6 md:grid-cols-2">
        {consultation.diagnosis && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnostic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{consultation.diagnosis}</p>
            </CardContent>
          </Card>
        )}

        {consultation.treatment_plan && (
          <Card>
            <CardHeader>
              <CardTitle>Plan de traitement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{consultation.treatment_plan}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Prescriptions & Recommendations */}
      {(consultation.prescriptions || consultation.recommendations) && (
        <div className="grid gap-6 md:grid-cols-2">
          {consultation.prescriptions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{consultation.prescriptions}</p>
              </CardContent>
            </Card>
          )}

          {consultation.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{consultation.recommendations}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Follow-up */}
      {(consultation.next_appointment_date || consultation.notes) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Suivi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.next_appointment_date && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Prochain rendez-vous
                </p>
                <p>
                  {format(
                    new Date(consultation.next_appointment_date),
                    'd MMMM yyyy',
                    { locale: fr }
                  )}
                </p>
              </div>
            )}
            {consultation.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Notes
                </p>
                <p className="whitespace-pre-wrap">{consultation.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
