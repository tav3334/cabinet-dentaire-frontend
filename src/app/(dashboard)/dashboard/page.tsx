'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatients } from '@/hooks/use-patients';
import { useAppointments } from '@/hooks/use-appointments';
import { useTreatments } from '@/hooks/use-treatments';
import { useServices } from '@/hooks/use-services';
import {
  Users,
  Calendar,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MoreVertical,
  Plus,
  CalendarDays,
  Stethoscope,
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress'; // Ajouter un composant Progress

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  isLoading,
  color = 'blue',
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'violet';
}) {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    orange: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100' },
  };

  const colors = colorMap[color];

  return (
    <Card className={`border ${colors.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-24 mb-1" />
        ) : (
          <div className="text-3xl font-bold text-gray-900">{value}</div>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-500">{description}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${trend.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <TrendingUp className={`h-3 w-3 ${trend.positive ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
              {trend.positive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'En attente', variant: 'secondary' },
    confirmed: { label: 'Confirmé', variant: 'default' },
    canceled: { label: 'Annulé', variant: 'destructive' },
    completed: { label: 'Terminé', variant: 'outline' },
  };

  const { label, variant } = variants[status] || { label: status, variant: 'outline' as const };

  return <Badge variant={variant}>{label}</Badge>;
}

export default function DashboardPage() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: patientsData, isLoading: patientsLoading } = usePatients({ per_page: 1 });
  const { data: appointmentsData, isLoading: appointmentsLoading } = useAppointments({
    include: 'patient,service',
    per_page: 5,
  });
  const { data: todayAppointments, isLoading: todayLoading } = useAppointments({
    date_from: today,
    date_to: today,
    include: 'patient,service',
    per_page: 10,
  });
  const { data: treatmentsData, isLoading: treatmentsLoading } = useTreatments({
    status: 'in_progress',
    per_page: 1,
  });
  const { data: servicesData, isLoading: servicesLoading } = useServices();

  const pendingAppointments = appointmentsData?.data.filter(a => a.status === 'pending').length || 0;

  return (
    
    <div className="space-y-6">
      
      {/* Page Header */}
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue ! Voici un aperçu de votre cabinet dentaire.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patientsData?.meta?.total || 0}
          description="Patients enregistrés"
          icon={Users}
          isLoading={patientsLoading}
        />
        <StatCard
          title="RDV Aujourd'hui"
          value={todayAppointments?.meta?.total || 0}
          description={format(new Date(), 'EEEE d MMMM', { locale: fr })}
          icon={Calendar}
          isLoading={todayLoading}
        />
        <StatCard
          title="Traitements en cours"
          value={treatmentsData?.meta?.total || 0}
          description="Traitements actifs"
          icon={ClipboardList}
          isLoading={treatmentsLoading}
        />
        <StatCard
          title="Services"
          value={servicesData?.data?.length || 0}
          description="Services proposés"
          icon={TrendingUp}
          isLoading={servicesLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Appointments */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rendez-vous du jour</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </CardDescription>
            </div>
            <Link href="/appointments">
              <Button variant="outline" size="sm">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {todayLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : todayAppointments?.data && todayAppointments.data.length > 0 ? (
              <div className="space-y-4">
                {todayAppointments.data.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {appointment.patient?.full_name || appointment.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.appointment_time} - {appointment.service?.title}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun rendez-vous aujourd&apos;hui</p>
                <Link href="/appointments/new">
                  <Button variant="link" className="mt-2">
                    Planifier un rendez-vous
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity / Pending Actions */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Actions en attente</CardTitle>
            <CardDescription>Éléments nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAppointments > 0 && (
                <div className="flex items-center gap-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">
                      {pendingAppointments} rendez-vous à confirmer
                    </p>
                    <p className="text-sm text-yellow-600">
                      En attente de confirmation
                    </p>
                  </div>
                  <Link href="/appointments?status=pending">
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </Link>
                </div>
              )}

              {treatmentsData && treatmentsData.meta.total > 0 && (
                <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">
                      {treatmentsData.meta.total} traitements en cours
                    </p>
                    <p className="text-sm text-blue-600">
                      Suivre la progression
                    </p>
                  </div>
                  <Link href="/treatments?status=in_progress">
                    <Button variant="outline" size="sm">
                      Voir
                    </Button>
                  </Link>
                </div>
              )}

              {pendingAppointments === 0 && (!treatmentsData || treatmentsData.meta.total === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <p className="text-muted-foreground">Tout est à jour !</p>
                  <p className="text-sm text-muted-foreground">
                    Aucune action en attente
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Derniers rendez-vous</CardTitle>
            <CardDescription>Les 5 derniers rendez-vous enregistrés</CardDescription>
          </div>
          <Link href="/appointments">
            <Button variant="outline" size="sm">
              Voir tous les rendez-vous
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : appointmentsData?.data && appointmentsData.data.length > 0 ? (
            <div className="space-y-3">
              {appointmentsData.data.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {appointment.patient?.full_name || appointment.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.service?.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(appointment.appointment_date), 'd MMM yyyy', { locale: fr })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.appointment_time}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun rendez-vous</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
