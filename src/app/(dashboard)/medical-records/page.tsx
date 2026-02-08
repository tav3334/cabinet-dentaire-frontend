'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePatients } from '@/hooks/use-patients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  FolderHeart,
  User,
  Phone,
  AlertTriangle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MedicalRecordsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePatients({ page, per_page: 12, search });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderHeart className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            Fiches Médicales
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Consultez les dossiers médicaux des patients
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un patient par nom, prénom ou téléphone..."
              className="pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Patient Medical Records Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderHeart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              {search
                ? 'Aucun patient trouvé pour cette recherche'
                : 'Aucun dossier médical disponible'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.data.map((patient) => (
              <Link key={patient.id} href={`/medical-records/${patient.id}`}>
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {patient.first_name} {patient.last_name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </p>
                        </div>
                      </div>
                      {patient.allergies && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Allergies
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      {patient.date_of_birth && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Âge</span>
                          <span>{patient.age} ans</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Depuis</span>
                        <span>
                          {format(new Date(patient.created_at), 'd MMM yyyy', {
                            locale: fr,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {patient.medical_history
                            ? 'Antécédents enregistrés'
                            : 'Pas d\'antécédents'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {data?.meta && data.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Précédent</span>
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} sur {data.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.meta.last_page}
              >
                <span className="hidden sm:inline mr-1">Suivant</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
