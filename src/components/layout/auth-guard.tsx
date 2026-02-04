'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading, checkAuth, _hasHydrated, setHasHydrated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    // Hydrater le store manuellement
    useAuthStore.persist.rehydrate();
    setHasHydrated(true);
  }, [setHasHydrated]);

  useEffect(() => {
    if (_hasHydrated) {
      checkAuth();
    }
  }, [_hasHydrated, checkAuth]);

  useEffect(() => {
    if (_hasHydrated && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, _hasHydrated]);

  // Ne rien rendre côté serveur ou avant l'hydratation
  if (!mounted || !_hasHydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
