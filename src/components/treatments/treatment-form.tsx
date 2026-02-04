'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { usePatients } from '@/hooks/use-patients';
import { Treatment, TreatmentFormData, TreatmentCategory, TreatmentStatus } from '@/types';

const statusOptions: { value: TreatmentStatus; label: string }[] = [
  { value: 'planned', label: 'Planifié' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'on_hold', label: 'En attente' },
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

interface TreatmentFormProps {
  treatment?: Treatment;
  onSubmit: (data: TreatmentFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TreatmentForm({ treatment, onSubmit, isLoading }: TreatmentFormProps) {
  const { data: patientsData, isLoading: patientsLoading } = usePatients({ per_page: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TreatmentFormData>({
    defaultValues: {
      patient_id: treatment?.patient_id || 0,
      title: treatment?.title || '',
      description: treatment?.description || '',
      tooth_number: treatment?.tooth_number || '',
      category: treatment?.category || 'consultation',
      status: treatment?.status || 'planned',
      estimated_cost: treatment?.estimated_cost || undefined,
      actual_cost: treatment?.actual_cost || undefined,
      planned_date: treatment?.planned_date?.split('T')[0] || '',
      completed_date: treatment?.completed_date?.split('T')[0] || '',
      sessions_required: treatment?.sessions_required || undefined,
      sessions_completed: treatment?.sessions_completed || undefined,
      notes: treatment?.notes || '',
    },
  });

  const patientId = watch('patient_id');
  const category = watch('category');
  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de base</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Patient <span className="text-red-500">*</span>
            </Label>
            <Select
              value={patientId?.toString() || ''}
              onValueChange={(value) => setValue('patient_id', parseInt(value))}
              disabled={isLoading || patientsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patientsData?.data.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patient_id && (
              <p className="text-sm text-red-500">Le patient est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Titre du traitement <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register('title', { required: 'Le titre est requis' })}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Catégorie <span className="text-red-500">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setValue('category', value as TreatmentCategory)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as TreatmentStatus)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tooth_number">Numéro de dent</Label>
            <Input
              id="tooth_number"
              {...register('tooth_number')}
              placeholder="Ex: 14, 21-24"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description du traitement..."
              disabled={isLoading}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sessions & Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Planification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="planned_date">Date prévue</Label>
            <Input
              id="planned_date"
              type="date"
              {...register('planned_date')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completed_date">Date de fin</Label>
            <Input
              id="completed_date"
              type="date"
              {...register('completed_date')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions_required">Séances requises</Label>
            <Input
              id="sessions_required"
              type="number"
              min="1"
              {...register('sessions_required', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions_completed">Séances effectuées</Label>
            <Input
              id="sessions_completed"
              type="number"
              min="0"
              {...register('sessions_completed', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Costs */}
      <Card>
        <CardHeader>
          <CardTitle>Coûts</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="estimated_cost">Coût estimé (€)</Label>
            <Input
              id="estimated_cost"
              type="number"
              step="0.01"
              min="0"
              {...register('estimated_cost', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actual_cost">Coût réel (€)</Label>
            <Input
              id="actual_cost"
              type="number"
              step="0.01"
              min="0"
              {...register('actual_cost', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('notes')}
            placeholder="Notes supplémentaires..."
            disabled={isLoading}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {treatment ? 'Mettre à jour' : 'Créer le traitement'}
        </Button>
      </div>
    </form>
  );
}
