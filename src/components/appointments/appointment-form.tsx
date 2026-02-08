'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useServices } from '@/hooks/use-services';
import { Appointment, AppointmentFormData } from '@/types';
import { appointmentSchema } from '@/lib/validations';

interface AppointmentFormProps {
  appointment?: Appointment;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AppointmentForm({ appointment, onSubmit, onCancel, isLoading }: AppointmentFormProps) {
  const { data: patientsData, isLoading: patientsLoading } = usePatients({ per_page: 100 });
  const { data: servicesData, isLoading: servicesLoading } = useServices();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: appointment?.patient_id || undefined,
      service_id: appointment?.service_id || undefined,
      name: appointment?.name || '',
      phone: appointment?.phone || '',
      appointment_date: appointment?.appointment_date?.split('T')[0] || '',
      appointment_time: appointment?.appointment_time || '',
      duration: appointment?.duration || 30,
      message: appointment?.message || '',
      status: appointment?.status || 'pending',
    },
  });

  const patientId = watch('patient_id');
  const serviceId = watch('service_id');
  const status = watch('status');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Patient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Patient existant</Label>
            <Select
              value={patientId?.toString() || 'new'}
              onValueChange={(value) => {
                setValue('patient_id', value && value !== 'new' ? parseInt(value) : undefined);
                if (value && value !== 'new') {
                  const patient = patientsData?.data.find(
                    (p) => p.id === parseInt(value)
                  );
                  if (patient) {
                    setValue('name', `${patient.first_name} ${patient.last_name}`);
                    setValue('phone', patient.phone);
                  }
                }
              }}
              disabled={isLoading || patientsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Nouveau patient</SelectItem>
                {patientsData?.data.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.first_name} {patient.last_name} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!patientId && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Service & Date */}
      <Card>
        <CardHeader>
          <CardTitle>Détails du rendez-vous</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Service <span className="text-red-500">*</span>
            </Label>
            <Select
              value={serviceId?.toString() || ''}
              onValueChange={(value) => setValue('service_id', parseInt(value))}
              disabled={isLoading || servicesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {servicesData?.data.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.service_id && (
              <p className="text-sm text-red-500">Le service est requis</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue('status', value as AppointmentFormData['status'])
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="canceled">Annulé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment_date">
              Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="appointment_date"
              type="date"
              {...register('appointment_date')}
              disabled={isLoading}
            />
            {errors.appointment_date && (
              <p className="text-sm text-red-500">
                {errors.appointment_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment_time">
              Heure <span className="text-red-500">*</span>
            </Label>
            <Input
              id="appointment_time"
              type="time"
              {...register('appointment_time')}
              disabled={isLoading}
            />
            {errors.appointment_time && (
              <p className="text-sm text-red-500">
                {errors.appointment_time.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              step="15"
              {...register('duration', { valueAsNumber: true })}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="message">Notes / Message</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Notes supplémentaires..."
              disabled={isLoading}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {appointment ? 'Mettre à jour' : 'Créer le rendez-vous'}
        </Button>
      </div>
    </form>
  );
}
