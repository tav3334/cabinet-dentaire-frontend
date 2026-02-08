'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form data:', data);
    toast.success('Message envoyé avec succès !');
    setIsSubmitted(true);
    reset();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
            <MessageSquare className="h-4 w-4" />
            Contactez-nous
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nous sommes à votre écoute
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Une question ? Besoin d'informations ? Notre équipe est disponible pour vous répondre et vous accompagner.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Merci de nous avoir contacté. Nous vous répondrons très prochainement.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Envoyer un autre message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="jean.dupont@email.com"
                            {...register('email', {
                              required: 'L\'email est requis',
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Email invalide',
                              },
                            })}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone (optionnel)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="06 12 34 56 78"
                            {...register('phone')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Sujet *</Label>
                          <Input
                            id="subject"
                            placeholder="Objet de votre message"
                            {...register('subject', { required: 'Le sujet est requis' })}
                          />
                          {errors.subject && (
                            <p className="text-sm text-red-500">{errors.subject.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Décrivez votre demande en détail..."
                          rows={6}
                          {...register('message', { required: 'Le message est requis' })}
                        />
                        {errors.message && (
                          <p className="text-sm text-red-500">{errors.message.message}</p>
                        )}
                      </div>

                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Address */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                      <p className="text-muted-foreground text-sm">
                        123 Rue de la Santé<br />
                        75000 Paris, France
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                      <a
                        href="tel:+33123456789"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        +33 1 23 45 67 89
                      </a>
                      <p className="text-muted-foreground text-xs mt-1">
                        Du lundi au vendredi, 9h-18h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a
                        href="mailto:contact@cabinet-dentaire.fr"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        contact@cabinet-dentaire.fr
                      </a>
                      <p className="text-muted-foreground text-xs mt-1">
                        Réponse sous 24-48h
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">Horaires</h3>
                      <div className="space-y-1 text-sm">
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
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-200 transition-colors"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-200 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Nous trouver
            </h2>
            <div className="bg-gray-200 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Carte interactive</p>
                <p className="text-sm">123 Rue de la Santé, 75000 Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
