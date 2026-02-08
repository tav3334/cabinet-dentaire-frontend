'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Wrench,
  FolderHeart,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Fiches Médicales', href: '/medical-records', icon: FolderHeart },
  { name: 'Rendez-vous', href: '/appointments', icon: Calendar },
  { name: 'Services', href: '/services', icon: Wrench },
  { name: 'Traitements', href: '/treatments', icon: ClipboardList },
  { name: 'Consultations', href: '/consultations', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border">
        <Image src="/dent.png" alt="Logo" width={36} height={36} className="rounded-lg" />
        <span className="text-base font-semibold text-foreground">Cabinet Dentaire</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px]', isActive ? 'text-primary' : 'text-muted-foreground')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-3 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Settings className={cn('h-[18px] w-[18px]', pathname === '/settings' ? 'text-primary' : 'text-muted-foreground')} />
          Paramètres
        </Link>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Sun className="h-[18px] w-[18px] text-muted-foreground rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] text-muted-foreground rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="dark:hidden">Mode sombre</span>
          <span className="hidden dark:inline">Mode clair</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </button>
      </div>

      {/* User */}
      {user && (
        <Link href="/profile" className="border-t border-border p-3 flex items-center gap-3 hover:bg-accent transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </Link>
      )}
    </div>
  );
}
