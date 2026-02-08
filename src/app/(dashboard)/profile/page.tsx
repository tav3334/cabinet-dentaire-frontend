'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Pencil,
  Save,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    toast.success('Profil mis à jour avec succès');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            Mon Profil
          </h1>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge className="mt-2 capitalize" variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                <Shield className="mr-1 h-3 w-3" />
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </Badge>

              <Separator className="my-6" />

              <div className="w-full space-y-3 text-left text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {phone && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{phone}</span>
                  </div>
                )}
                {address && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Membre depuis{' '}
                    {user?.created_at
                      ? format(new Date(user.created_at), 'MMMM yyyy', { locale: fr })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              {isEditing
                ? 'Modifiez vos informations ci-dessous'
                : 'Vos informations de profil'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user?.name || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {user?.email || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {phone || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Rue Exemple, Ville"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 rounded-md bg-muted">
                    {address || '-'}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Parlez-nous de vous..."
                  rows={4}
                />
              ) : (
                <p className="text-sm py-2 px-3 rounded-md bg-muted min-h-[100px]">
                  {bio || 'Aucune bio renseignée'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vos dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                icon={<Calendar className="h-4 w-4" />}
                title="Rendez-vous créé"
                description="Nouveau rendez-vous planifié pour Jean Dupont"
                time="Il y a 2 heures"
              />
              <ActivityItem
                icon={<User className="h-4 w-4" />}
                title="Patient ajouté"
                description="Marie Martin a été ajoutée à la liste des patients"
                time="Il y a 5 heures"
              />
              <ActivityItem
                icon={<Mail className="h-4 w-4" />}
                title="Rappel envoyé"
                description="Rappel de rendez-vous envoyé à Pierre Durant"
                time="Hier"
              />
              <ActivityItem
                icon={<Shield className="h-4 w-4" />}
                title="Connexion"
                description="Connexion réussie depuis un nouvel appareil"
                time="Il y a 2 jours"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <p className="text-xs text-muted-foreground whitespace-nowrap">{time}</p>
    </div>
  );
}
