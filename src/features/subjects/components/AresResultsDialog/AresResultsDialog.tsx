import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../../shared/components/Button/Button.tsx';
import { Dialog } from '../../../../shared/components/Dialog/Dialog.tsx';
import { SubjectPickerAresResults } from '../SubjectPickerAresResults/SubjectPickerAresResults.tsx';

export interface AresResultsDialogProps {
  // Null while the dialog is closed.
  submittedSearch: string | null;
  onSelect: (regNumber: string) => void;
  onClose: () => void;
}

export function AresResultsDialog({
  submittedSearch,
  onSelect,
  onClose,
}: Readonly<AresResultsDialogProps>) {
  const [selectedRegNumber, setSelectedRegNumber] = useState<string | null>(null);

  function close() {
    setSelectedRegNumber(null);
    onClose();
  }

  function choose(regNumber: string) {
    setSelectedRegNumber(null);
    onSelect(regNumber);
  }

  return (
    <Dialog
      isOpen={submittedSearch !== null}
      title="Seznam subjektů"
      size="lg"
      onClose={close}
      footer={
        <>
          <Button
            variant="primary"
            icon={Check}
            disabled={selectedRegNumber === null}
            onClick={() => selectedRegNumber && choose(selectedRegNumber)}
          >
            Vybrat
          </Button>
          <Button onClick={close}>Storno</Button>
        </>
      }
    >
      <SubjectPickerAresResults
        submittedSearch={submittedSearch ?? ''}
        selectedRegNumber={selectedRegNumber}
        onSelect={setSelectedRegNumber}
        onChoose={choose}
      />
    </Dialog>
  );
}
