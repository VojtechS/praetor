import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  const toasterLayerRef = useRef<HTMLDivElement>(null);

  // Modal dialogs live in the top layer, a popover is the only way to show toasts above them.
  useEffect(() => {
    toasterLayerRef.current?.showPopover();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <div ref={toasterLayerRef} popover="manual" data-toaster-layer="">
        <Toaster
          position="bottom-left"
          richColors
          icons={{
            success: null,
            error: null,
            info: null,
            warning: null,
            loading: null,
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
