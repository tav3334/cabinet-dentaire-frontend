'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useConsultations, useDeleteConsultation } from '@/hooks/use-consultations';
import { Button } from '@/components/ui/button';
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
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Consultation, ConsultationType } from '@/types';

const typeOptions: { value: ConsultationType; label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }[] = [
  { value: 'first_visit', label: 'Première visite', color: 'default' },
  { value: 'follow_up', label: 'Suivi', color: 'secondary' },
  { value: 'emergency', label: 'Urgence', color: 'destructive' },
  { value: 'control', label: 'Contrôle', color: 'outline' },
  { value: 'treatment', label: 'Traitement', color: 'secondary' },
];

function TypeBadge({ type }: { type: ConsultationType }) {
  const option = typeOptions.find((o) => o.value === type);
  return <Badge variant={option?.color || 'outline'}>{option?.label || type}</Badge>;
}

export default function ConsultationsPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>('');
  const [deleteConsultation, setDeleteConsultation] = useState<Consultation | null>(null);

  const { data, isLoading } = useConsultations({
    page,
    per_page: 10,
    type: type || undefined,
    include: 'patient',
  });

  const deleteMutation = useDeleteConsultation();

  const handleDelete = async () => {
    if (!deleteConsultation) return;

    try {
      await deleteMutation.mutateAsync(deleteConsultation.id);
      toast.success('Consultation supprimée');
      setDeleteConsultation(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Gérez les consultations des patients
          </p>
        </div>
        <Link href="/consultations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle consultation
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
              value={type}
              onValueChange={(value) => {
                setType(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Type de consultation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {type && (
              <Button
                variant="ghost"
                onClick={() => {
                  setType('');
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
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Motif</TableHead>
                      <TableHead>Diagnostic</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((consultation) => (
                      <TableRow key={consultation.id}>
                        <TableCell>
                          <div className="font-medium">
                            {format(new Date(consultation.consultation_date), 'd MMM yyyy', {
                              locale: fr,
                            })}
                          </div>
                          {consultation.consultation_time && (
                            <div className="text-sm text-muted-foreground">
                              {consultation.consultation_time}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {consultation.patient ? (
                            <Link
                              href={`/patients/${consultation.patient.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              {consultation.patient.first_name} {consultation.patient.last_name}
                            </Link>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <TypeBadge type={consultation.type} />
                        </TableCell>
                        <TableCell>
                          <span className="line-clamp-2 max-w-[200px]">
                            {consultation.chief_complaint || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="line-clamp-2 max-w-[200px]">
                            {consultation.diagnosis || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Link href={`/consultations/${consultation.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/consultations/${consultation.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteConsultation(consultation)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-3 p-4">
                {data.data.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {format(new Date(consultation.consultation_date), 'd MMM yyyy', { locale: fr })}
                          </span>
                          {consultation.consultation_time && (
                            <span className="text-sm text-muted-foreground">
                              {consultation.consultation_time}
                            </span>
                          )}
                        </div>
                        {consultation.patient && (
                          <Link
                            href={`/patients/${consultation.patient.id}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {consultation.patient.first_name} {consultation.patient.last_name}
                          </Link>
                        )}
                      </div>
                      <TypeBadge type={consultation.type} />
                    </div>

                    <div className="space-y-2 text-sm mb-3">
                      {consultation.chief_complaint && (
                        <div>
                          <p className="text-muted-foreground text-xs">Motif</p>
                          <p className="line-clamp-2">{consultation.chief_complaint}</p>
                        </div>
                      )}
                      {consultation.diagnosis && (
                        <div>
                          <p className="text-muted-foreground text-xs">Diagnostic</p>
                          <p className="line-clamp-2">{consultation.diagnosis}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Link href={`/consultations/${consultation.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                      </Link>
                      <Link href={`/consultations/${consultation.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConsultation(consultation)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.meta && data.meta.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Affichage de {data.meta.from} à {data.meta.to} sur{' '}
                    {data.meta.total} consultations
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Précédent</span>
                    </Button>
                    <span className="text-sm text-muted-foreground flex items-center px-2">
                      {page} / {data.meta.last_page}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.meta.last_page}
                    >
                      <span className="hidden sm:inline mr-1">Suivant</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucune consultation trouvée</p>
              <Link href="/consultations/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle consultation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteConsultation}
        onOpenChange={() => setDeleteConsultation(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la consultation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette consultation du{' '}
              {deleteConsultation &&
                format(new Date(deleteConsultation.consultation_date), 'd MMMM yyyy', {
                  locale: fr,
                })}{' '}
              ?
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
