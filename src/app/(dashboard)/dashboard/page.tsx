'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatients } from '@/hooks/use-patients';
import { useAppointments } from '@/hooks/use-appointments';
import { useTreatments } from '@/hooks/use-treatments';
import { useConsultations } from '@/hooks/use-consultations';
import {
  Users,
  Calendar,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Stethoscope,
  Zap,
  UserPlus,
  FolderHeart,
  Activity,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  trend,
  isLoading,
  color = 'blue',
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  href?: string;
  trend?: { value: number; positive: boolean };
  isLoading?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'violet' | 'rose';
}) {
  const colorMap = {
    blue: { bg: 'bg-blue-500', iconBg: 'bg-blue-100 dark:bg-blue-900', icon: 'text-blue-600 dark:text-blue-400', gradient: 'from-blue-500 to-blue-600' },
    green: { bg: 'bg-emerald-500', iconBg: 'bg-emerald-100 dark:bg-emerald-900', icon: 'text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
    orange: { bg: 'bg-amber-500', iconBg: 'bg-amber-100 dark:bg-amber-900', icon: 'text-amber-600 dark:text-amber-400', gradient: 'from-amber-500 to-amber-600' },
    violet: { bg: 'bg-violet-500', iconBg: 'bg-violet-100 dark:bg-violet-900', icon: 'text-violet-600 dark:text-violet-400', gradient: 'from-violet-500 to-violet-600' },
    rose: { bg: 'bg-rose-500', iconBg: 'bg-rose-100 dark:bg-rose-900', icon: 'text-rose-600 dark:text-rose-400', gradient: 'from-rose-500 to-rose-600' },
  };

  const colors = colorMap[color];

  const content = (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${href ? 'cursor-pointer' : ''}`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-3 rounded-xl ${colors.iconBg} shadow-sm`}>
          <Icon className={`h-5 w-5 ${colors.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-28 mb-1" />
        ) : (
          <div className="text-4xl font-bold text-foreground tracking-tight">{value}</div>
        )}
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-muted-foreground">{description}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${trend.positive ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
              <TrendingUp className={`h-3 w-3 ${!trend.positive && 'rotate-180'}`} />
              {trend.positive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        {href && (
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Voir détails <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

function AppointmentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-700' },
    confirmed: { label: 'Confirmé', className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' },
    canceled: { label: 'Annulé', className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' },
    completed: { label: 'Terminé', className: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700' },
  };

  const { label, className } = variants[status] || { label: status, className: 'bg-muted text-foreground' };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  href,
  color,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className={`h-auto py-4 px-4 flex flex-col items-center gap-2 hover:border-${color}-300 hover:bg-${color}-50 dark:hover:bg-${color}-950 transition-all group w-full`}
      >
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900 group-hover:bg-${color}-200 dark:group-hover:bg-${color}-800 transition-colors`}>
          <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <span className="text-xs font-medium text-foreground">{label}</span>
      </Button>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
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
    per_page: 5,
  });
  const { data: consultationsData, isLoading: consultationsLoading } = useConsultations({
    per_page: 1,
  });

  const pendingAppointments = appointmentsData?.data.filter(a => a.status === 'pending').length || 0;
  const confirmedToday = todayAppointments?.data.filter(a => a.status === 'confirmed').length || 0;

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Bonjour{user?.name ? `, ${user.name}` : ''} 👋
            </h1>
            <p className="text-blue-100 mt-1 text-sm md:text-base">
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{todayAppointments?.meta?.total || 0} RDV aujourd'hui</span>
              </div>
              {confirmedToday > 0 && (
                <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{confirmedToday} confirmés</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/appointments/new">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau RDV
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Priority Alert */}
      {pendingAppointments > 0 && (
        <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950 to-orange-50 dark:to-orange-950 border border-amber-200 dark:border-amber-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Action requise</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {pendingAppointments} rendez-vous en attente de confirmation
              </p>
            </div>
          </div>
          <Link href="/appointments?status=pending">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 shadow-sm w-full sm:w-auto">
              Confirmer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={patientsData?.meta?.total || 0}
          description="Patients enregistrés"
          icon={Users}
          href="/patients"
          isLoading={patientsLoading}
          color="blue"
        />
        <StatCard
          title="RDV Aujourd'hui"
          value={todayAppointments?.meta?.total || 0}
          description={format(new Date(), 'EEEE d MMMM', { locale: fr })}
          icon={Calendar}
          href="/appointments"
          isLoading={todayLoading}
          color="green"
        />
        <StatCard
          title="Traitements actifs"
          value={treatmentsData?.meta?.total || 0}
          description="En cours de traitement"
          icon={ClipboardList}
          href="/treatments?status=in_progress"
          isLoading={treatmentsLoading}
          color="orange"
        />
        <StatCard
          title="Consultations"
          value={consultationsData?.meta?.total || 0}
          description="Total enregistrées"
          icon={FileText}
          href="/consultations"
          isLoading={consultationsLoading}
          color="violet"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/patients/new">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group w-full">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                  <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-foreground">Nouveau patient</span>
              </Button>
            </Link>
            <Link href="/appointments/new">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950 transition-all group w-full">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-medium text-foreground">Nouveau RDV</span>
              </Button>
            </Link>
            <Link href="/consultations/new">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all group w-full">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900 group-hover:bg-violet-200 dark:group-hover:bg-violet-800 transition-colors">
                  <Stethoscope className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-xs font-medium text-foreground">Consultation</span>
              </Button>
            </Link>
            <Link href="/medical-records">
              <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all group w-full">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900 group-hover:bg-rose-200 dark:group-hover:bg-rose-800 transition-colors">
                  <FolderHeart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="text-xs font-medium text-foreground">Fiches médicales</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Rendez-vous du jour
              </CardTitle>
              <CardDescription className="mt-1">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </CardDescription>
            </div>
            <Link href="/appointments">
              <Button variant="outline" size="sm" className="gap-1">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {todayLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : todayAppointments?.data && todayAppointments.data.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.data.map((appointment, index) => (
                  <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 dark:hover:from-blue-950 hover:to-transparent transition-all group cursor-pointer">
                      <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                        <span className="text-lg font-bold">{appointment.appointment_time.split(':')[0]}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-80">h{appointment.appointment_time.split(':')[1]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {appointment.patient?.full_name || appointment.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {appointment.service?.title}
                        </p>
                      </div>
                      <AppointmentStatusBadge status={appointment.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">Aucun rendez-vous aujourd'hui</p>
                <p className="text-sm text-muted-foreground mt-1">Profitez de cette journée tranquille !</p>
                <Link href="/appointments/new">
                  <Button variant="outline" className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Planifier un RDV
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Actions */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                À faire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {pendingAppointments > 0 && (
                <Link href="/appointments?status=pending">
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-700 hover:border-amber-300 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          {pendingAppointments} confirmation{pendingAppointments > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )}

              {treatmentsData && treatmentsData.meta.total > 0 && (
                <Link href="/treatments?status=in_progress">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 hover:border-blue-300 transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {treatmentsData.meta.total} traitement{treatmentsData.meta.total > 1 ? 's' : ''} en cours
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )}

              {pendingAppointments === 0 && (!treatmentsData || treatmentsData.meta.total === 0) && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-medium text-foreground text-sm">Tout est à jour !</p>
                  <p className="text-xs text-muted-foreground mt-1">Aucune action en attente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Treatments */}
          {treatmentsData && treatmentsData.data.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-orange-500" />
                    Traitements actifs
                  </CardTitle>
                  <Link href="/treatments?status=in_progress">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Voir tout
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {treatmentsData.data.slice(0, 3).map((treatment) => (
                  <Link key={treatment.id} href={`/treatments/${treatment.id}`}>
                    <div className="p-3 rounded-lg border border-border hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground truncate">{treatment.title}</p>
                        {treatment.progress_percentage !== undefined && (
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-400">{treatment.progress_percentage}%</span>
                        )}
                      </div>
                      {treatment.sessions_required && (
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${treatment.progress_percentage || 0}%` }}
                          />
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {treatment.patient?.first_name} {treatment.patient?.last_name}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Derniers rendez-vous
            </CardTitle>
            <CardDescription className="mt-1">Les 5 derniers rendez-vous enregistrés</CardDescription>
          </div>
          <Link href="/appointments">
            <Button variant="outline" size="sm" className="gap-1">
              Voir tous
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : appointmentsData?.data && appointmentsData.data.length > 0 ? (
            <div className="space-y-3">
              {appointmentsData.data.map((appointment) => (
                <Link key={appointment.id} href={`/appointments/${appointment.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 dark:hover:from-blue-950 hover:to-transparent transition-all group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {appointment.patient?.full_name || appointment.name}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {appointment.service?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                          {format(new Date(appointment.appointment_date), 'd MMM yyyy', { locale: fr })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.appointment_time}
                        </p>
                      </div>
                      <AppointmentStatusBadge status={appointment.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">Aucun rendez-vous</p>
              <p className="text-sm text-muted-foreground mt-1">Commencez par créer votre premier rendez-vous</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
