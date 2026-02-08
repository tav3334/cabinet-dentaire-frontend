'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePatients, useDeletePatient } from '@/hooks/use-patients';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Patient } from '@/types';

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState<string>('');
  const [deletePatient, setDeletePatient] = useState<Patient | null>(null);

  const { data, isLoading } = usePatients({
    page,
    per_page: 10,
    search: search || undefined,
    gender: gender || undefined,
  });

  const deleteMutation = useDeletePatient();

  const handleDelete = async () => {
    if (!deletePatient) return;

    try {
      await deleteMutation.mutateAsync(deletePatient.id);
      toast.success('Patient supprimé avec succès');
      setDeletePatient(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getGenderLabel = (gender: string | null) => {
    switch (gender) {
      case 'male':
        return { label: 'Homme', color: 'bg-blue-100 dark:bg-blue-900 text-blue-700' };
      case 'female':
        return { label: 'Femme', color: 'bg-pink-100 text-pink-700' };
      case 'other':
        return { label: 'Autre', color: 'bg-muted text-foreground' };
      default:
        return { label: '-', color: 'bg-muted text-muted-foreground' };
    }
  };

  const hasFilters = search || gender;

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-2">
            {data?.meta?.total || 0} patient{(data?.meta?.total || 0) !== 1 ? 's' : ''} enregistré{(data?.meta?.total || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/patients/new">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nouveau patient
          </Button>
        </Link>
      </div>

      {/* Filters Section - Amélioré */}
      <Card className="border-2 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Filtrer les patients</CardTitle>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setGender('');
                  setPage(1);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Chercher un patient..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 border-2 border-border focus:border-blue-500"
              />
            </div>

            {/* Gender Filter */}
            <Select
              value={gender}
              onValueChange={(value) => {
                setGender(value === 'all' ? '' : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="border-2 border-border focus:border-blue-500">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les genres</SelectItem>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {search && (
                <Badge variant="secondary" className="gap-1">
                  <Search className="h-3 w-3" />
                  {search}
                </Badge>
              )}
              {gender && (
                <Badge variant="secondary" className="gap-1">
                  {getGenderLabel(gender).label}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-2 border-border overflow-hidden">
        {/* Table Header Stats */}
        {!isLoading && data?.data && data.data.length > 0 && (
          <CardHeader className="bg-muted border-b">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {data.meta?.total ? (
                    <>
                      <span className="text-lg font-bold text-foreground">{data.meta.total}</span> patient{data.meta.total !== 1 ? 's' : ''} trouvé{data.meta.total !== 1 ? 's' : ''}
                    </>
                  ) : (
                    'Aucun patient'
                  )}
                </p>
              </div>
            </div>
          </CardHeader>
        )}

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow className="border-b-2 border-border hover:bg-muted">
                      <TableHead className="font-semibold text-foreground">Patient</TableHead>
                      <TableHead className="font-semibold text-foreground">Contact</TableHead>
                      <TableHead className="font-semibold text-foreground">Genre</TableHead>
                      <TableHead className="font-semibold text-foreground">Âge</TableHead>
                      <TableHead className="font-semibold text-foreground">Enregistré</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((patient) => (
                      <TableRow
                        key={patient.id}
                        className="border-b border-border hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      >
                        <TableCell className="py-4">
                          <Link href={`/patients/${patient.id}`}>
                            <div className="font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                              {patient.first_name} {patient.last_name}
                            </div>
                            {patient.city && (
                              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {patient.city}
                              </div>
                            )}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {patient.phone && (
                              <div className="text-sm text-foreground flex items-center gap-2">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                                <a href={`tel:${patient.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                  {patient.phone}
                                </a>
                              </div>
                            )}
                            {patient.email && (
                              <div className="text-sm text-foreground flex items-center gap-2">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <a href={`mailto:${patient.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 truncate">
                                  {patient.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getGenderLabel(patient.gender).color}`}>
                            {getGenderLabel(patient.gender).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {patient.date_of_birth ? `${patient.age || '-'} ans` : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(patient.created_at), 'd MMM yyyy', { locale: fr })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Link href={`/patients/${patient.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400"
                                title="Voir le dossier"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/patients/${patient.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 hover:bg-amber-100 dark:hover:bg-amber-900 hover:text-amber-600"
                                title="Modifier"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletePatient(patient)}
                              className="h-9 w-9 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3 p-4">
                {data.data.map((patient) => (
                  <Link key={patient.id} href={`/patients/${patient.id}`}>
                    <div className="p-4 rounded-lg border-2 border-border hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {patient.first_name} {patient.last_name}
                          </p>
                          {patient.city && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {patient.city}
                            </p>
                          )}
                        </div>
                        <Badge className={`${getGenderLabel(patient.gender).color} flex-shrink-0`}>
                          {getGenderLabel(patient.gender).label}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3 text-sm">
                        {patient.phone && (
                          <p className="text-muted-foreground flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a href={`tel:${patient.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                              {patient.phone}
                            </a>
                          </p>
                        )}
                        {patient.email && (
                          <p className="text-muted-foreground flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <a href={`mailto:${patient.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 truncate">
                              {patient.email}
                            </a>
                          </p>
                        )}
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {patient.date_of_birth ? `${patient.age || '-'} ans` : '-'}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-border">
                        <Link href={`/patients/${patient.id}/edit`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeletePatient(patient);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination - Amélioré */}
              {data.meta && data.meta.last_page > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t-2 border-border bg-muted">
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
                    Affichage de <span className="font-semibold">{data.meta.from}</span> à{' '}
                    <span className="font-semibold">{data.meta.to}</span> sur{' '}
                    <span className="font-semibold">{data.meta.total}</span> patients
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Précédent
                    </Button>
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-sm font-medium text-foreground">
                        {page} / {data.meta.last_page}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === data.meta.last_page}
                      className="gap-1"
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-2">Aucun patient trouvé</p>
              <p className="text-muted-foreground mb-4 max-w-sm">
                {hasFilters
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par ajouter votre premier patient'}
              </p>
              <Link href="/patients/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un patient
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog - Amélioré */}
      <AlertDialog open={!!deletePatient} onOpenChange={() => setDeletePatient(null)}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Supprimer le patient ?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Êtes-vous sûr de vouloir supprimer{' '}
              <strong className="text-foreground">
                {deletePatient?.first_name} {deletePatient?.last_name}
              </strong>{' '}
              ? Cette action est irréversible et tous ses rendez-vous et traitements seront perdus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
