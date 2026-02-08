'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Stethoscope,
  Menu,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Sun,
  Moon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/accueil' },
  { name: 'Services', href: '/nos-services' },
  { name: 'Rendez-vous', href: '/prendre-rdv' },
  { name: 'Contact', href: '/contact' },
];

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
      {/* Top bar */}
      <div className="hidden md:block bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+33123456789" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Phone className="h-4 w-4" />
              +33 1 23 45 67 89
            </a>
            <a href="mailto:contact@cabinet-dentaire.fr" className="flex items-center gap-2 hover:text-blue-200 transition-colors">
              <Mail className="h-4 w-4" />
              contact@cabinet-dentaire.fr
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lun - Ven: 9h - 18h
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/accueil" className="flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-foreground">Cabinet Dentaire</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                  pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Basculer le thème"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            <Link href="/prendre-rdv">
              <Button>
                Prendre RDV
              </Button>
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 mt-6">
                <Link href="/accueil" className="flex items-center gap-2">
                  <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold">Cabinet Dentaire</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400',
                        pathname === item.href ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 pt-4 border-t">
                  {mounted && (
                    <Button
                      variant="outline"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-full"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="mr-2 h-4 w-4" />
                          Mode clair
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 h-4 w-4" />
                          Mode sombre
                        </>
                      )}
                    </Button>
                  )}
                  <Link href="/prendre-rdv">
                    <Button className="w-full">Prendre RDV</Button>
                  </Link>
                </div>
                <div className="pt-4 border-t space-y-3 text-sm text-muted-foreground">
                  <a href="tel:+33123456789" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    +33 1 23 45 67 89
                  </a>
                  <a href="mailto:contact@cabinet-dentaire.fr" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    contact@cabinet-dentaire.fr
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">Cabinet Dentaire</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre santé bucco-dentaire est notre priorité. Des soins de qualité dans un environnement moderne et accueillant.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horaires</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h - 18h</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi</span>
                <span>9h - 13h</span>
              </li>
              <li className="flex justify-between">
                <span>Dimanche</span>
                <span>Fermé</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-400" />
                <span>123 Rue de la Santé<br />75000 Paris, France</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+33123456789" className="hover:text-white transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:contact@cabinet-dentaire.fr" className="hover:text-white transition-colors">
                  contact@cabinet-dentaire.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>&copy; {year || '2025'} Cabinet Dentaire. Tous droits réservés.</p>
          <Link href="/login" className="text-gray-500 hover:text-gray-300 transition-colors">
            Accès professionnel
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
