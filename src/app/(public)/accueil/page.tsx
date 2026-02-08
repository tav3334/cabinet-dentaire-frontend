'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Stethoscope,
  Shield,
  Clock,
  Award,
  Users,
  Heart,
  ChevronRight,
  Star,
  Phone,
  Calendar,
  Sparkles,
  Smile,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Soins de qualité',
    description: 'Des traitements réalisés avec les dernières technologies et techniques dentaires.',
  },
  {
    icon: Clock,
    title: 'Disponibilité',
    description: 'Des horaires flexibles et des rendez-vous rapides pour votre confort.',
  },
  {
    icon: Heart,
    title: 'Approche douce',
    description: 'Une équipe attentive qui prend en compte vos appréhensions.',
  },
  {
    icon: Award,
    title: 'Expertise',
    description: 'Plus de 15 ans d\'expérience dans les soins dentaires.',
  },
];

const services = [
  {
    icon: Sparkles,
    title: 'Soins préventifs',
    description: 'Détartrage, scellement de sillons, conseils d\'hygiène bucco-dentaire.',
  },
  {
    icon: Smile,
    title: 'Esthétique dentaire',
    description: 'Blanchiment, facettes, alignement pour un sourire éclatant.',
  },
  {
    icon: Stethoscope,
    title: 'Soins courants',
    description: 'Traitement des caries, dévitalisation, extraction dentaire.',
  },
  {
    icon: Zap,
    title: 'Urgences dentaires',
    description: 'Prise en charge rapide des douleurs et traumatismes.',
  },
];

const testimonials = [
  {
    name: 'Marie Dupont',
    text: 'Excellente expérience ! L\'équipe est très professionnelle et à l\'écoute. Je recommande vivement.',
    rating: 5,
  },
  {
    name: 'Jean Martin',
    text: 'Un cabinet moderne avec un personnel attentionné. Les soins sont de qualité et les prix raisonnables.',
    rating: 5,
  },
  {
    name: 'Sophie Bernard',
    text: 'Très satisfaite de ma prise en charge. Le dentiste prend le temps d\'expliquer chaque étape.',
    rating: 5,
  },
];

export default function AccueilPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Votre sourire, notre priorité
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Des soins dentaires{' '}
                <span className="text-blue-300">d'excellence</span>
              </h1>
              <p className="text-lg text-blue-100 max-w-xl">
                Bienvenue au Cabinet Dentaire. Notre équipe de professionnels vous accompagne pour tous vos soins bucco-dentaires dans un environnement moderne et apaisant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/prendre-rdv">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 w-full sm:w-auto">
                    <Calendar className="mr-2 h-5 w-5" />
                    Prendre rendez-vous
                  </Button>
                </Link>
                <Link href="/nos-services">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                    Nos services
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white flex items-center justify-center text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-blue-200">+500 patients satisfaits</p>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-indigo-600/30 rounded-full blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    <Stethoscope className="h-32 w-32 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre cabinet s'engage à vous offrir les meilleurs soins dans un environnement confortable et moderne.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des soins complets pour toute la famille, de la prévention aux traitements spécialisés.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:border-blue-300 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/nos-services">
              <Button variant="outline" size="lg">
                Voir tous nos services
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prenez soin de votre sourire dès aujourd'hui
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            N'attendez plus pour prendre rendez-vous. Notre équipe est là pour vous accueillir et répondre à tous vos besoins dentaires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/prendre-rdv">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
                <Calendar className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </Button>
            </Link>
            <a href="tel:+33123456789">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                +33 1 23 45 67 89
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ce que disent nos patients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La satisfaction de nos patients est notre plus belle récompense.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">Patient(e)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">15+</div>
              <p className="text-muted-foreground">Années d'expérience</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">5000+</div>
              <p className="text-muted-foreground">Patients traités</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</div>
              <p className="text-muted-foreground">Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">24h</div>
              <p className="text-muted-foreground">Urgences</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
