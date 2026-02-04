'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTreatments, useDeleteTreatment } from '@/hooks/use-treatments';
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
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Treatment, TreatmentStatus, TreatmentCategory } from '@/types';

const statusOptions: { value: TreatmentStatus; label: string; color: 'default' | 'secondary' | 'destructive' | 'outline' }[] = [
  { value: 'planned', label: 'Planifié', color: 'outline' },
  { value: 'in_progress', label: 'En cours', color: 'secondary' },
  { value: 'completed', label: 'Terminé', color: 'default' },
  { value: 'cancelled', label: 'Annulé', color: 'destructive' },
  { value: 'on_hold', label: 'En attente', color: 'outline' },
];

const categoryOptions: { value: TreatmentCategory; label: string }[] = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'preventive', label: 'Préventif' },
  { value: 'restorative', label: 'Restauration' },
  { value: 'endodontic', label: 'Endodontie' },
  { value: 'periodontic', label: 'Parodontie' },
  { value: 'surgery', label: 'Chirurgie' },
  { value: 'prosthetic', label: 'Prothèse' },
  { value: 'orthodontic', label: 'Orthodontie' },
  { value: 'cosmetic', label: 'Esthétique' },
  { value: 'emergency', label: 'Urgence' },
];

function StatusBadge({ status }: { status: TreatmentStatus }) {
  const option = statusOptions.find((o) => o.value === status);
  return <Badge variant={option?.color || 'outline'}>{option?.label || status}</Badge>;
}

export default function TreatmentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [deleteTreatment, setDeleteTreatment] = useState<Treatment | null>(null);

  const { data, isLoading } = useTreatments({
    page,
    per_page: 10,
    status: status || undefined,
    category: category || undefined,
    include: 'patient',
  });

  const deleteMutation = useDeleteTreatment();

  const handleDelete = async () => {
    if (!deleteTreatment) return;

    try {
      await deleteMutation.mutateAsync(deleteTreatment.id);
      toast.success('Traitement supprimé');
      setDeleteTreatment(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Traitements</h1>
          <p className="text-muted-foreground">
            Gérez les traitements des patients
          </p>
        </div>
        <Link href="/treatments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau traitement
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

            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(status || category) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatus('');
                  setCategory('');
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
                    <TableHead>Traitement</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Progression</TableHead>
                    <TableHead>Coût</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((treatment) => (
                    <TableRow key={treatment.id}>
                      <TableCell>
                        <div className="font-medium">{treatment.title}</div>
                        {treatment.tooth_number && (
                          <div className="text-sm text-muted-foreground">
                            Dent: {treatment.tooth_number}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {treatment.patient ? (
                          <Link
                            href={`/patients/${treatment.patient.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {treatment.patient.first_name} {treatment.patient.last_name}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryOptions.find((c) => c.value === treatment.category)?.label ||
                            treatment.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {treatment.sessions_required ? (
                          <div className="space-y-1">
                            <Progress
                              value={treatment.progress_percentage || 0}
                              className="h-2"
                            />
                            <p className="text-xs text-muted-foreground">
                              {treatment.sessions_completed || 0} / {treatment.sessions_required}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {treatment.estimated_cost ? (
                          <div>
                            <p className="font-medium">
                              {treatment.actual_cost
                                ? `${treatment.actual_cost} €`
                                : `~${treatment.estimated_cost} €`}
                            </p>
                            {treatment.actual_cost && treatment.estimated_cost && (
                              <p className="text-xs text-muted-foreground">
                                Est: {treatment.estimated_cost} €
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={treatment.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Link href={`/treatments/${treatment.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/treatments/${treatment.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTreatment(treatment)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
                    {data.meta.total} traitements
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
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Aucun traitement trouvé</p>
              <Link href="/treatments/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau traitement
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!deleteTreatment}
        onOpenChange={() => setDeleteTreatment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le traitement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le traitement &quot;{deleteTreatment?.title}&quot; ?
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
