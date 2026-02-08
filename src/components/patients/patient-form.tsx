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
import { Patient, PatientFormData } from '@/types';
import { patientSchema, PatientFormSchema } from '@/lib/validations';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientForm({ patient, onSubmit, onCancel, isLoading }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PatientFormSchema>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: patient?.first_name || '',
      last_name: patient?.last_name || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      date_of_birth: patient?.date_of_birth?.split('T')[0] || '',
      gender: patient?.gender || undefined,
      address: patient?.address || '',
      city: patient?.city || '',
      postal_code: patient?.postal_code || '',
      medical_history: patient?.medical_history || '',
      allergies: patient?.allergies || '',
      notes: patient?.notes || '',
    },
  });

  const gender = watch('gender');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              Prénom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              {...register('first_name')}
              disabled={isLoading}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500">{errors.first_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">
              Nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              {...register('last_name')}
              disabled={isLoading}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register('date_of_birth')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Genre</Label>
            <Select
              value={gender}
              onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Homme</SelectItem>
                <SelectItem value="female">Femme</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
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

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              {...register('address')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              {...register('city')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              {...register('postal_code')}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations médicales */}
      <Card>
        <CardHeader>
          <CardTitle>Informations médicales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="medical_history">Antécédents médicaux</Label>
            <Textarea
              id="medical_history"
              {...register('medical_history')}
              placeholder="Antécédents médicaux, maladies chroniques, etc."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              {...register('allergies')}
              placeholder="Allergies connues..."
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {patient ? 'Mettre à jour' : 'Créer le patient'}
        </Button>
      </div>
    </form>
  );
}
