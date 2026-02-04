'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppointments, useDeleteAppointment, useUpdateAppointment } from '@/hooks/use-appointments';
import { useServices } from '@/hooks/use-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MoreHorizontal,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Appointment, AppointmentStatus } from '@/types';

const statusOptions = [
  { value: 'pending', label: 'En attente', color: 'secondary' },
  { value: 'confirmed', label: 'Confirmé', color: 'default' },
  { value: 'canceled', label: 'Annulé', color: 'destructive' },
  { value: 'completed', label: 'Terminé', color: 'outline' },
] as const;

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const option = statusOptions.find((o) => o.value === status);
  return (
    <Badge variant={option?.color || 'outline'}>
      {option?.label || status}
    </Badge>
  );
}

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteAppointment, setDeleteAppointment] = useState<Appointment | null>(null);

  const { data, isLoading } = useAppointments({
    page,
    per_page: 10,
    status: status || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    include: 'patient,service',
  });

  const { data: servicesData } = useServices();
  const deleteMutation = useDeleteAppointment();
  const updateMutation = useUpdateAppointment();

  const handleDelete = async () => {
    if (!deleteAppointment) return;

    try {
      await deleteMutation.mutateAsync(deleteAppointment.id);
      toast.success('Rendez-vous supprimé');
      setDeleteAppointment(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status: newStatus } });
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérez les rendez-vous du cabinet
          </p>
        </div>
        <Link href="/appointments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 flex-1">
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="Date début"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="Date fin"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {(status || dateFrom || dateTo) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatus('');
                  setDateFrom('');
                  setDateTo('');
                  setPage(1);
                }}
              >
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date & Heure</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="font-medium">
                          {appointment.patient?.full_name || appointment.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {appointment.service?.title || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(appointment.appointment_date), 'd MMM yyyy', {
                            locale: fr,
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.appointment_time}
                          {appointment.duration && ` (${appointment.duration} min)`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-auto">
                              <StatusBadge status={appointment.status} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {statusOptions.map((option) => (
                              <DropdownMenuItem
                                key={option.value}
                                onClick={() =>
                                  handleStatusChange(appointment.id, option.value)
                                }
                              >
                                {option.value === 'confirmed' && (
                                  <Check className="mr-2 h-4 w-4 text-green-500" />
                                )}
                                {option.value === 'canceled' && (
                                  <X className="mr-2 h-4 w-4 text-red-500" />
                                )}
                                {option.value === 'pending' && (
                                  <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                )}
                                {option.value === 'completed' && (
                                  <Check className="mr-2 h-4 w-4 text-blue-500" />
                                )}
                                {option.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/appointments/${appointment.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/appointments/${appointment.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteAppointment(appointment)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {data.meta && data.meta.last_page > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Affichage de {data.meta.from} à {data.meta.to} sur{' '}
                    {data.meta.total} rendez-vous
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.meta.last_page}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucun rendez-vous trouvé</p>
              <Link href="/appointments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Planifier un rendez-vous
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteAppointment}
        onOpenChange={() => setDeleteAppointment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le rendez-vous ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous du{' '}
              {deleteAppointment &&
                format(
                  new Date(deleteAppointment.appointment_date),
                  'd MMMM yyyy',
                  { locale: fr }
                )}{' '}
              à {deleteAppointment?.appointment_time} ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
