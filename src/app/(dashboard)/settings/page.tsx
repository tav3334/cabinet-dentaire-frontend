'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Bell,
  Clock,
  Calendar,
  Shield,
  Palette,
  Globe,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState('24');

  // Calendar settings
  const [workStartTime, setWorkStartTime] = useState('08:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [appointmentDuration, setAppointmentDuration] = useState('30');
  const [workDays, setWorkDays] = useState(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']);

  // Display settings
  const [language, setLanguage] = useState('fr');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');
  const [timeFormat, setTimeFormat] = useState('24h');

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');

  const handleSaveNotifications = () => {
    toast.success('Paramètres de notifications sauvegardés');
  };

  const handleSaveCalendar = () => {
    toast.success('Paramètres du calendrier sauvegardés');
  };

  const handleSaveDisplay = () => {
    toast.success('Paramètres d\'affichage sauvegardés');
  };

  const handleSaveSecurity = () => {
    toast.success('Paramètres de sécurité sauvegardés');
  };

  const toggleWorkDay = (day: string) => {
    if (workDays.includes(day)) {
      setWorkDays(workDays.filter((d) => d !== day));
    } else {
      setWorkDays([...workDays, day]);
    }
  };

  const allDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          Paramètres
        </h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre application
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Affichage</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Paramètres de notifications
              </CardTitle>
              <CardDescription>
                Configurez comment vous souhaitez recevoir les notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez les notifications importantes par email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des SMS pour les rendez-vous urgents
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Rappels de rendez-vous</Label>
                    <p className="text-sm text-muted-foreground">
                      Envoyez des rappels automatiques aux patients
                    </p>
                  </div>
                  <Switch
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>

                {appointmentReminders && (
                  <div className="ml-6 space-y-2">
                    <Label>Envoyer le rappel</Label>
                    <Select value={reminderTime} onValueChange={setReminderTime}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 heure avant</SelectItem>
                        <SelectItem value="2">2 heures avant</SelectItem>
                        <SelectItem value="12">12 heures avant</SelectItem>
                        <SelectItem value="24">24 heures avant</SelectItem>
                        <SelectItem value="48">48 heures avant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Paramètres du calendrier
              </CardTitle>
              <CardDescription>
                Configurez les horaires et la durée des rendez-vous
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure de début
                  </Label>
                  <Input
                    type="time"
                    value={workStartTime}
                    onChange={(e) => setWorkStartTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure de fin
                  </Label>
                  <Input
                    type="time"
                    value={workEndTime}
                    onChange={(e) => setWorkEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Durée par défaut des rendez-vous</Label>
                <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Jours de travail</Label>
                <div className="flex flex-wrap gap-2">
                  {allDays.map((day) => (
                    <Button
                      key={day}
                      variant={workDays.includes(day) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleWorkDay(day)}
                      className="capitalize"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCalendar}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Paramètres d'affichage
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Langue
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format de date</Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format d'heure</Label>
                <Select value={timeFormat} onValueChange={setTimeFormat}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 heures (14:00)</SelectItem>
                    <SelectItem value="12h">12 heures (2:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveDisplay}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Paramètres de sécurité
              </CardTitle>
              <CardDescription>
                Gérez les options de sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Délai d'expiration de session</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                    <SelectItem value="480">8 heures</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Vous serez déconnecté après cette période d'inactivité
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base">Changer le mot de passe</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Mot de passe actuel</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div />
                  <div className="space-y-2">
                    <Label>Nouveau mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmer le mot de passe</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
