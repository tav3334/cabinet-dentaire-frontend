'use client';

import { use } from 'react';
import Link from 'next/link';
import { useAppointment, useUpdateAppointment } from '@/hooks/use-appointments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Wrench,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { AppointmentStatus } from '@/types';

const statusConfig = {
  pending: { label: 'En attente', color: 'secondary' as const, icon: Clock },
  confirmed: { label: 'Confirmé', color: 'default' as const, icon: Check },
  canceled: { label: 'Annulé', color: 'destructive' as const, icon: X },
  completed: { label: 'Terminé', color: 'outline' as const, icon: Check },
};

export default function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: appointment, isLoading } = useAppointment(
    parseInt(resolvedParams.id),
    'patient,service'
  );
  const updateMutation = useUpdateAppointment();

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (!appointment) return;

    try {
      await updateMutation.mutateAsync({
        id: appointment.id,
        data: { status: newStatus },
      });
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

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

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Rendez-vous non trouvé</p>
        <Link href="/appointments">
          <Button variant="link">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const config = statusConfig[appointment.status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/appointments">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Rendez-vous du{' '}
              {format(new Date(appointment.appointment_date), 'd MMMM yyyy', {
                locale: fr,
              })}
            </h1>
            <p className="text-muted-foreground">
              {appointment.patient?.full_name || appointment.name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/appointments/${appointment.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Statut</span>
            <Badge variant={config.color} className="text-sm">
              <StatusIcon className="mr-1 h-4 w-4" />
              {config.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={appointment.status === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('confirmed')}
              disabled={appointment.status === 'confirmed'}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmer
            </Button>
            <Button
              variant={appointment.status === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('completed')}
              disabled={appointment.status === 'completed'}
            >
              <Check className="mr-2 h-4 w-4" />
              Marquer terminé
            </Button>
            <Button
              variant={appointment.status === 'canceled' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('canceled')}
              disabled={appointment.status === 'canceled'}
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
          </div>
        </CardContent>
      </Card>

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
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-lg">
                {appointment.patient?.full_name || appointment.name}
              </p>
              {appointment.patient && (
                <Link
                  href={`/patients/${appointment.patient.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Voir le dossier patient
                </Link>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Détails
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {format(new Date(appointment.appointment_date), 'EEEE d MMMM yyyy', {
                  locale: fr,
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {appointment.appointment_time}
                {appointment.duration && ` (${appointment.duration} min)`}
              </span>
            </div>
            {appointment.service && (
              <div className="flex items-center gap-3">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span>{appointment.service.title}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {appointment.message && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{appointment.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
