'use client';

import { use } from 'react';
import Link from 'next/link';
import { usePatient } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Pencil,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  AlertCircle,
  ClipboardList,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: patient, isLoading } = usePatient(
    parseInt(resolvedParams.id),
    'appointments,treatments,consultations'
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 md:col-span-1" />
          <Skeleton className="h-64 md:col-span-2" />
        </div>
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-muted-foreground">
              Patient depuis le{' '}
              {format(new Date(patient.created_at), 'd MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        <Link href={`/patients/${patient.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{patient.phone}</span>
            </div>
            {patient.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{patient.email}</span>
              </div>
            )}
            {(patient.address || patient.city) && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  {patient.address && <p>{patient.address}</p>}
                  {patient.city && (
                    <p>
                      {patient.postal_code} {patient.city}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                {patient.date_of_birth ? (
                  <>
                    {format(new Date(patient.date_of_birth), 'd MMMM yyyy', {
                      locale: fr,
                    })}{' '}
                    <span className="text-muted-foreground">
                      ({patient.age} ans)
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Non renseigné</span>
                )}
              </div>
            </div>
            <div className="pt-2">
              <Badge variant="outline">{getGenderLabel(patient.gender)}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Medical Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dossier médical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history">
              <TabsList>
                <TabsTrigger value="history">Antécédents</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                {patient.medical_history ? (
                  <p className="whitespace-pre-wrap">{patient.medical_history}</p>
                ) : (
                  <p className="text-muted-foreground">
                    Aucun antécédent médical enregistré
                  </p>
                )}
              </TabsContent>
              <TabsContent value="allergies" className="mt-4">
                {patient.allergies ? (
                  <p className="whitespace-pre-wrap">{patient.allergies}</p>
                ) : (
                  <p className="text-muted-foreground">
                    Aucune allergie connue
                  </p>
                )}
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                {patient.notes ? (
                  <p className="whitespace-pre-wrap">{patient.notes}</p>
                ) : (
                  <p className="text-muted-foreground">Aucune note</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Appointments & Treatments */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Rendez-vous
            </CardTitle>
            <Link href={`/appointments?patient_id=${patient.id}`}>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {patient.appointments && patient.appointments.length > 0 ? (
              <div className="space-y-3">
                {patient.appointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(appointment.appointment_date), 'd MMM yyyy', {
                          locale: fr,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.appointment_time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        appointment.status === 'confirmed'
                          ? 'default'
                          : appointment.status === 'pending'
                          ? 'secondary'
                          : appointment.status === 'canceled'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {appointment.status === 'pending'
                        ? 'En attente'
                        : appointment.status === 'confirmed'
                        ? 'Confirmé'
                        : appointment.status === 'canceled'
                        ? 'Annulé'
                        : 'Terminé'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucun rendez-vous
              </p>
            )}
          </CardContent>
        </Card>

        {/* Treatments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Traitements
            </CardTitle>
            <Link href={`/treatments?patient_id=${patient.id}`}>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {patient.treatments && patient.treatments.length > 0 ? (
              <div className="space-y-3">
                {patient.treatments.slice(0, 5).map((treatment) => (
                  <div
                    key={treatment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div>
                      <p className="font-medium">{treatment.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {treatment.category_label}
                      </p>
                    </div>
                    <Badge
                      variant={
                        treatment.status === 'completed'
                          ? 'default'
                          : treatment.status === 'in_progress'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {treatment.status_label}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Aucun traitement
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
