import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Toaster, toast } from 'sonner';

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { errorMessage: string };
    mutationMeta: { errorMessage: string };
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (_error, query) => {
      if (query.meta) {
        toast.error(query.meta.errorMessage);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (_error, _variables, _onMutateResult, mutation) => {
      if (mutation.meta) {
        toast.error(mutation.meta.errorMessage);
      }
    },
  }),
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
