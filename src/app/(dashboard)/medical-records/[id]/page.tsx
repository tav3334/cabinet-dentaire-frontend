'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePatient } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Heart,
  Pill,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  Clock,
  Pencil,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MedicalRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const patientId = parseInt(resolvedParams.id);
  const { data: patient, isLoading } = usePatient(
    patientId,
    'appointments,treatments,consultations'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Fiche médicale non trouvée</p>
        <Link href="/medical-records">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case 'male':
        return 'Homme';
      case 'female':
        return 'Femme';
      case 'other':
        return 'Autre';
      default:
        return 'Non spécifié';
    }
  };

  const getConsultationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      first_visit: 'Première visite',
      follow_up: 'Suivi',
      emergency: 'Urgence',
      control: 'Contrôle',
      treatment: 'Traitement',
    };
    return labels[type] || type;
  };

  const getOralHygieneLabel = (hygiene: string | null) => {
    const labels: Record<string, string> = {
      excellent: 'Excellente',
      good: 'Bonne',
      moderate: 'Moyenne',
      poor: 'Mauvaise',
    };
    return hygiene ? labels[hygiene] || hygiene : null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/medical-records">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Fiche Médicale
            </h1>
            <p className="text-muted-foreground">
              {patient.first_name} {patient.last_name}
            </p>
          </div>
        </div>
        <Link href={`/patients/${patient.id}/edit`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Modifier le dossier
          </Button>
        </Link>
      </div>

      {/* Patient Info & Medical Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Identity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient.age ? `${patient.age} ans` : 'Âge non renseigné'} - {getGenderLabel(patient.gender)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm break-all">{patient.email}</span>
                </div>
              )}
              {(patient.address || patient.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    {patient.address && <p>{patient.address}</p>}
                    {patient.city && (
                      <p>
                        {patient.postal_code} {patient.city}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {patient.date_of_birth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Né(e) le {format(new Date(patient.date_of_birth), 'd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Medical Summary Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Résumé Médical
            </CardTitle>
            <CardDescription>
              Informations médicales importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Allergies Alert */}
              <div className={`p-4 rounded-lg ${patient.allergies ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${patient.allergies ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <h4 className="font-medium">Allergies</h4>
                </div>
                {patient.allergies ? (
                  <p className="text-sm text-red-700 whitespace-pre-wrap">{patient.allergies}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune allergie connue</p>
                )}
              </div>

              {/* Medical History */}
              <div className="p-4 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Antécédents Médicaux</h4>
                </div>
                {patient.medical_history ? (
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">{patient.medical_history}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun antécédent enregistré</p>
                )}
              </div>

              {/* Notes */}
              <div className="p-4 rounded-lg bg-slate-50 sm:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Pill className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-medium">Notes Médicales</h4>
                </div>
                {patient.notes ? (
                  <p className="text-sm whitespace-pre-wrap">{patient.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune note</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultations & Treatments Tabs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="consultations">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Consultations</span>
                <span className="sm:hidden">Consult.</span>
                {patient.consultations && patient.consultations.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {patient.consultations.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="treatments" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Traitements</span>
                <span className="sm:hidden">Trait.</span>
                {patient.treatments && patient.treatments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {patient.treatments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Consultations Tab */}
            <TabsContent value="consultations" className="mt-6">
              {patient.consultations && patient.consultations.length > 0 ? (
                <div className="space-y-4">
                  {patient.consultations.map((consultation) => (
                    <Link key={consultation.id} href={`/consultations/${consultation.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {getConsultationTypeLabel(consultation.type)}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(consultation.consultation_date), 'd MMM yyyy', { locale: fr })}
                                </span>
                                {consultation.consultation_time && (
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {consultation.consultation_time}
                                  </span>
                                )}
                              </div>
                              {consultation.chief_complaint && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium">Motif:</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {consultation.chief_complaint}
                                  </p>
                                </div>
                              )}
                              {consultation.diagnosis && (
                                <div className="mb-2">
                                  <p className="text-sm font-medium">Diagnostic:</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {consultation.diagnosis}
                                  </p>
                                </div>
                              )}
                              {consultation.oral_hygiene && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Hygiène bucco-dentaire:</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {getOralHygieneLabel(consultation.oral_hygiene)}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune consultation enregistrée</p>
                  <Link href={`/consultations/new?patient_id=${patient.id}`}>
                    <Button variant="outline" className="mt-4">
                      Créer une consultation
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* Treatments Tab */}
            <TabsContent value="treatments" className="mt-6">
              {patient.treatments && patient.treatments.length > 0 ? (
                <div className="space-y-4">
                  {patient.treatments.map((treatment) => (
                    <Link key={treatment.id} href={`/treatments/${treatment.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="pt-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-medium">{treatment.title}</h4>
                                <Badge variant="outline">{treatment.category_label}</Badge>
                              </div>
                              {treatment.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                  {treatment.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                {treatment.tooth_number && (
                                  <span className="text-muted-foreground">
                                    Dent(s): {treatment.tooth_number}
                                  </span>
                                )}
                                {treatment.sessions_required && (
                                  <span className="text-muted-foreground">
                                    Séances: {treatment.sessions_completed || 0}/{treatment.sessions_required}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge
                              variant={
                                treatment.status === 'completed'
                                  ? 'default'
                                  : treatment.status === 'in_progress'
                                  ? 'secondary'
                                  : treatment.status === 'cancelled'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {treatment.status_label}
                            </Badge>
                          </div>
                          {treatment.progress_percentage !== undefined && treatment.progress_percentage > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Progression</span>
                                <span>{treatment.progress_percentage}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${treatment.progress_percentage}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun traitement enregistré</p>
                  <Link href={`/treatments/new?patient_id=${patient.id}`}>
                    <Button variant="outline" className="mt-4">
                      Créer un traitement
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href={`/consultations/new?patient_id=${patient.id}`}>
              <Button variant="outline" size="sm">
                <Stethoscope className="mr-2 h-4 w-4" />
                Nouvelle consultation
              </Button>
            </Link>
            <Link href={`/treatments/new?patient_id=${patient.id}`}>
              <Button variant="outline" size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Nouveau traitement
              </Button>
            </Link>
            <Link href={`/appointments/new?patient_id=${patient.id}`}>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Prendre rendez-vous
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
