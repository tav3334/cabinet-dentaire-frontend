'use client';

import Link from 'next/link';
import { useServices } from '@/hooks/use-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Stethoscope,
  Sparkles,
  Smile,
  Zap,
  Shield,
  Heart,
  Syringe,
  Scissors,
  Crown,
  Baby,
  Scan,
  Calendar,
  ChevronRight,
} from 'lucide-react';

// Default services if API doesn't return data
const defaultServices = [
  {
    id: 1,
    icon: Stethoscope,
    title: 'Consultation générale',
    description: 'Examen complet de votre santé bucco-dentaire, diagnostic et établissement d\'un plan de traitement personnalisé.',
    details: ['Examen clinique', 'Radiographie panoramique', 'Bilan personnalisé', 'Plan de traitement'],
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'Soins préventifs',
    description: 'Détartrage, polissage et conseils d\'hygiène pour maintenir une bouche saine et prévenir les problèmes dentaires.',
    details: ['Détartrage', 'Polissage', 'Scellement des sillons', 'Conseils d\'hygiène'],
  },
  {
    id: 3,
    icon: Smile,
    title: 'Esthétique dentaire',
    description: 'Blanchiment professionnel, facettes et autres traitements pour un sourire éclatant et harmonieux.',
    details: ['Blanchiment dentaire', 'Facettes céramiques', 'Composite esthétique', 'Contourage'],
  },
  {
    id: 4,
    icon: Heart,
    title: 'Soins conservateurs',
    description: 'Traitement des caries, reconstitutions et restaurations pour préserver vos dents naturelles.',
    details: ['Traitement des caries', 'Inlays/Onlays', 'Composites', 'Amalgames'],
  },
  {
    id: 5,
    icon: Syringe,
    title: 'Endodontie',
    description: 'Traitement des racines dentaires (dévitalisation) pour sauver les dents atteintes en profondeur.',
    details: ['Traitement de canal', 'Retraitement', 'Apicoectomie', 'Diagnostic pulpaire'],
  },
  {
    id: 6,
    icon: Shield,
    title: 'Parodontologie',
    description: 'Traitement des maladies des gencives pour préserver la santé de vos tissus de soutien.',
    details: ['Surfaçage radiculaire', 'Chirurgie parodontale', 'Greffes de gencive', 'Maintenance'],
  },
  {
    id: 7,
    icon: Crown,
    title: 'Prothèses dentaires',
    description: 'Couronnes, bridges et prothèses amovibles pour remplacer les dents manquantes ou abîmées.',
    details: ['Couronnes', 'Bridges', 'Prothèses amovibles', 'Prothèses sur implants'],
  },
  {
    id: 8,
    icon: Scissors,
    title: 'Chirurgie dentaire',
    description: 'Extractions simples et complexes, chirurgie des dents de sagesse et autres interventions.',
    details: ['Extractions', 'Dents de sagesse', 'Chirurgie pré-prothétique', 'Biopsies'],
  },
  {
    id: 9,
    icon: Scan,
    title: 'Implantologie',
    description: 'Pose d\'implants dentaires pour remplacer une ou plusieurs dents de façon durable et esthétique.',
    details: ['Pose d\'implants', 'Greffes osseuses', 'Sinus lift', 'Prothèses sur implants'],
  },
  {
    id: 10,
    icon: Baby,
    title: 'Pédodontie',
    description: 'Soins dentaires adaptés aux enfants dans un environnement rassurant et bienveillant.',
    details: ['Soins adaptés', 'Prévention', 'Orthodontie précoce', 'Suivi de croissance'],
  },
  {
    id: 11,
    icon: Zap,
    title: 'Urgences dentaires',
    description: 'Prise en charge rapide des douleurs aiguës, traumatismes et urgences dentaires.',
    details: ['Douleurs aiguës', 'Traumatismes', 'Infections', 'Descellements'],
  },
];

const iconMap: Record<string, React.ElementType> = {
  'Consultation': Stethoscope,
  'Prévention': Sparkles,
  'Esthétique': Smile,
  'Conservateur': Heart,
  'Endodontie': Syringe,
  'Parodontie': Shield,
  'Prothèse': Crown,
  'Chirurgie': Scissors,
  'Implant': Scan,
  'Enfant': Baby,
  'Urgence': Zap,
};

function getIconForService(title: string): React.ElementType {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return Stethoscope;
}

export default function NosServicesPage() {
  const { data: servicesData, isLoading } = useServices();

  const services = servicesData?.data && servicesData.data.length > 0
    ? servicesData.data.map((service) => ({
        id: service.id,
        icon: getIconForService(service.title),
        title: service.title,
        description: service.description || 'Service dentaire professionnel.',
        details: [],
      }))
    : defaultServices;

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
            <Stethoscope className="h-4 w-4" />
            Nos prestations
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Nos services dentaires
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Découvrez l'ensemble de nos soins dentaires. Notre équipe de professionnels vous accompagne pour tous vos besoins bucco-dentaires.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={service.id}
                    className="group hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
                      {'details' in service && service.details.length > 0 && (
                        <ul className="space-y-2">
                          {service.details.map((detail, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <ChevronRight className="h-4 w-4 text-blue-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi nous faire confiance ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre engagement envers l'excellence et le bien-être de nos patients.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Équipements modernes</h3>
              <p className="text-muted-foreground">
                Technologies de pointe pour des diagnostics précis et des soins confortables.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Approche personnalisée</h3>
              <p className="text-muted-foreground">
                Chaque patient est unique. Nous adaptons nos soins à vos besoins spécifiques.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Résultats durables</h3>
              <p className="text-muted-foreground">
                Des traitements de qualité pour des résultats qui durent dans le temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Besoin d'un soin dentaire ?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Prenez rendez-vous dès maintenant et bénéficiez d'une consultation personnalisée avec nos experts.
          </p>
          <Link href="/prendre-rdv">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Calendar className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
