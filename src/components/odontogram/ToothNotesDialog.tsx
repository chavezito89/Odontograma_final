
import React, { useState, useEffect } from 'react';
import { useOdontoStore } from '@/store/odontoStore';
import { getDisplayNumber } from '@/utils/toothUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ToothNotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  toothNumber: number;
}

const ToothNotesDialog: React.FC<ToothNotesDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  toothNumber,
}) => {
  const { 
    getCurrentOdontogram, 
    updateToothNotes, 
    numberingSystem,
    currentTab 
  } = useOdontoStore();
  
  const [notes, setNotes] = useState('');
  const odontogram = getCurrentOdontogram();
  const toothData = odontogram[toothNumber];
  const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
  const tabTitle = currentTab === 'diagnosis' ? 'Diagnóstico' : 'Tratamiento';

  // Cargar las notas existentes cuando se abre el diálogo
  useEffect(() => {
    if (isOpen && toothData?.notes) {
      setNotes(toothData.notes);
    } else if (isOpen) {
      setNotes('');
    }
  }, [isOpen, toothData?.notes]);

  const handleSave = () => {
    updateToothNotes(toothNumber, notes.trim());
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setNotes(toothData?.notes || '');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tabTitle} - Diente {displayNumber}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del {tabTitle.toLowerCase()}:
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Describe el ${tabTitle.toLowerCase()} para este diente...`}
              className="min-h-[100px]"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToothNotesDialog;
