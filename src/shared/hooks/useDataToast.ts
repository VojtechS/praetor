import { useEffect } from 'react';
import { toast } from 'sonner';

export function useDataToast(isActive: boolean, message: string) {
  useEffect(() => {
    if (isActive) {
      toast.error(message);
    }
  }, [isActive, message]);
}
