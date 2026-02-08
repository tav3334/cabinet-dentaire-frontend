'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServices } from '@/hooks/use-services';
import { useCreateAppointment } from '@/hooks/use-appointments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  Stethoscope,
  CalendarDays,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

interface AppointmentFormData {
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  message?: string;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

export default function PrendreRdvPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const createAppointment = useCreateAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>();

  const selectedDate = watch('appointment_date');

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await createAppointment.mutateAsync({
        name: data.name,
        phone: data.phone,
        service_id: parseInt(data.service_id),
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        message: data.message,
        status: 'pending',
      });
      setIsSubmitted(true);
      toast.success('Votre demande de rendez-vous a été envoyée !');
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Demande envoyée !
            </h2>
            <p className="text-muted-foreground mb-6">
              Votre demande de rendez-vous a bien été enregistrée. Nous vous contacterons dans les plus brefs délais pour confirmer votre rendez-vous.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-left text-sm">
              <p className="font-medium text-blue-900 mb-2">Prochaines étapes :</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Vous recevrez un appel de confirmation</li>
                <li>• Un SMS de rappel vous sera envoyé</li>
                <li>• Pensez à apporter votre carte vitale</li>
              </ul>
            </div>
            <Button
              className="mt-6"
              onClick={() => setIsSubmitted(false)}
            >
              Prendre un autre rendez-vous
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-12 bg-muted min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            Réservation en ligne
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Prendre rendez-vous
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Réservez votre consultation en quelques clics. Notre équipe vous contactera pour confirmer votre rendez-vous.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de réservation</CardTitle>
                <CardDescription>
                  Remplissez les informations ci-dessous pour demander un rendez-vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Vos informations
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          placeholder="Jean Dupont"
                          {...register('name', { required: 'Le nom est requis' })}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06 12 34 56 78"
                          {...register('phone', { required: 'Le téléphone est requis' })}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optionnel)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        {...register('email')}
                      />
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium text-foreground flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      Votre rendez-vous
                    </h3>
                    <div className="space-y-2">
                      <Label>Service souhaité *</Label>
                      <Select
                        onValueChange={(value) => setValue('service_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicesLoading ? (
                            <SelectItem value="" disabled>Chargement...</SelectItem>
                          ) : (
                            servicesData?.data?.map((service) => (
                              <SelectItem key={service.id} value={service.id.toString()}>
                                {service.title}
                              </SelectItem>
                            ))
                          )}
                          {!servicesLoading && (!servicesData?.data || servicesData.data.length === 0) && (
                            <>
                              <SelectItem value="1">Consultation générale</SelectItem>
                              <SelectItem value="2">Détartrage</SelectItem>
                              <SelectItem value="3">Blanchiment</SelectItem>
                              <SelectItem value="4">Urgence dentaire</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register('service_id', { required: 'Le service est requis' })} />
                      {errors.service_id && (
                        <p className="text-sm text-red-500">{errors.service_id.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="appointment_date">Date souhaitée *</Label>
                        <Input
                          id="appointment_date"
                          type="date"
                          min={today}
                          {...register('appointment_date', { required: 'La date est requise' })}
                        />
                        {errors.appointment_date && (
                          <p className="text-sm text-red-500">{errors.appointment_date.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Heure souhaitée *</Label>
                        <Select
                          onValueChange={(value) => setValue('appointment_time', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une heure" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input type="hidden" {...register('appointment_time', { required: 'L\'heure est requise' })} />
                        {errors.appointment_time && (
                          <p className="text-sm text-red-500">{errors.appointment_time.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="message">Message (optionnel)</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez vos symptômes ou vos besoins..."
                      rows={4}
                      {...register('message')}
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-5 w-5" />
                        Demander un rendez-vous
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Information</h3>
                    <p className="text-sm text-blue-700">
                      Ce formulaire est une demande de rendez-vous. Notre équipe vous contactera pour confirmer la disponibilité et valider votre créneau.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lundi - Vendredi</span>
                  <span className="font-medium">9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Samedi</span>
                  <span className="font-medium">9h - 13h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimanche</span>
                  <span className="font-medium text-red-500">Fermé</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Pour toute question ou urgence, n'hésitez pas à nous contacter directement.
                </p>
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  +33 1 23 45 67 89
                </a>
                <a
                  href="mailto:contact@cabinet-dentaire.fr"
                  className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  contact@cabinet-dentaire.fr
                </a>
              </CardContent>
            </Card>

            {/* Urgency Card */}
            <Card className="bg-red-50 border-red-100">
              <CardContent className="pt-6">
                <h3 className="font-medium text-red-900 mb-2">Urgence dentaire ?</h3>
                <p className="text-sm text-red-700 mb-3">
                  En cas d'urgence (douleur intense, traumatisme), appelez-nous directement pour une prise en charge rapide.
                </p>
                <a href="tel:+33123456789">
                  <Button variant="destructive" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Appeler maintenant
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
