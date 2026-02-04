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
import { Consultation, ConsultationFormData, ConsultationType } from '@/types';

const typeOptions: { value: ConsultationType; label: string }[] = [
  { value: 'first_visit', label: 'Première visite' },
  { value: 'follow_up', label: 'Suivi' },
  { value: 'emergency', label: 'Urgence' },
  { value: 'control', label: 'Contrôle' },
  { value: 'treatment', label: 'Traitement' },
];

interface ConsultationFormProps {
  consultation?: Consultation;
  onSubmit: (data: ConsultationFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ConsultationForm({ consultation, onSubmit, isLoading }: ConsultationFormProps) {
  const { data: patientsData, isLoading: patientsLoading } = usePatients({ per_page: 100 });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConsultationFormData>({
    defaultValues: {
      patient_id: consultation?.patient_id || 0,
      consultation_date: consultation?.consultation_date?.split('T')[0] || new Date().toISOString().split('T')[0],
      consultation_time: consultation?.consultation_time || '',
      type: consultation?.type || 'first_visit',
      chief_complaint: consultation?.chief_complaint || '',
      clinical_examination: consultation?.clinical_examination || '',
      oral_hygiene: consultation?.oral_hygiene || '',
      periodontal_status: consultation?.periodontal_status || '',
      diagnosis: consultation?.diagnosis || '',
      treatment_plan: consultation?.treatment_plan || '',
      prescriptions: consultation?.prescriptions || '',
      recommendations: consultation?.recommendations || '',
      next_appointment_date: consultation?.next_appointment_date?.split('T')[0] || '',
      notes: consultation?.notes || '',
    },
  });

  const patientId = watch('patient_id');
  const type = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
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
            <Label>
              Type de consultation <span className="text-red-500">*</span>
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setValue('type', value as ConsultationType)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="consultation_date"
              type="date"
              {...register('consultation_date', { required: 'La date est requise' })}
              disabled={isLoading}
            />
            {errors.consultation_date && (
              <p className="text-sm text-red-500">{errors.consultation_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_time">Heure</Label>
            <Input
              id="consultation_time"
              type="time"
              {...register('consultation_time')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="chief_complaint">Motif de consultation</Label>
            <Textarea
              id="chief_complaint"
              {...register('chief_complaint')}
              placeholder="Plainte principale du patient..."
              disabled={isLoading}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clinical Examination */}
      <Card>
        <CardHeader>
          <CardTitle>Examen clinique</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="clinical_examination">Examen clinique</Label>
            <Textarea
              id="clinical_examination"
              {...register('clinical_examination')}
              placeholder="Observations de l'examen clinique..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oral_hygiene">Hygiène bucco-dentaire</Label>
            <Select
              value={watch('oral_hygiene') || ''}
              onValueChange={(value) => setValue('oral_hygiene', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Évaluer l'hygiène" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellente</SelectItem>
                <SelectItem value="good">Bonne</SelectItem>
                <SelectItem value="moderate">Moyenne</SelectItem>
                <SelectItem value="poor">Mauvaise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodontal_status">État parodontal</Label>
            <Textarea
              id="periodontal_status"
              {...register('periodontal_status')}
              placeholder="État des gencives, parodonte..."
              disabled={isLoading}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis & Treatment */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic et traitement</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnostic</Label>
            <Textarea
              id="diagnosis"
              {...register('diagnosis')}
              placeholder="Diagnostic établi..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment_plan">Plan de traitement</Label>
            <Textarea
              id="treatment_plan"
              {...register('treatment_plan')}
              placeholder="Plan de traitement proposé..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescriptions">Prescriptions</Label>
            <Textarea
              id="prescriptions"
              {...register('prescriptions')}
              placeholder="Médicaments prescrits..."
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recommandations</Label>
            <Textarea
              id="recommendations"
              {...register('recommendations')}
              placeholder="Recommandations au patient..."
              disabled={isLoading}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Follow-up */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="next_appointment_date">Prochain rendez-vous</Label>
            <Input
              id="next_appointment_date"
              type="date"
              {...register('next_appointment_date')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notes supplémentaires..."
              disabled={isLoading}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {consultation ? 'Mettre à jour' : 'Créer la consultation'}
        </Button>
      </div>
    </form>
  );
}
