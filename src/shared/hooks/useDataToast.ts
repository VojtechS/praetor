import { useEffect } from 'react';
import { toast } from 'sonner';

export type DataToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

export function useDataToast(isActive: boolean, message: string, type: DataToastType = 'error') {
  useEffect(() => {
    if (isActive) {
      toast[type](message);
    }
  }, [isActive, message, type]);
}
