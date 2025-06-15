import React, { useState } from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getDisplayNumber, TOOTH_STATE_COLORS, isSymbolState } from '@/utils/toothUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToothSummary {
  toothNumber: number;
  displayNumber: string | number;
  states: {
    mainState?: ToothState;
    symbolStates: ToothState[];
    faceStates: { face: ToothFace; state: ToothState }[];
  };
  notes?: string;
}

const DiagnosisSummary: React.FC = () => {
  const { 
    getCurrentOdontogram, 
    currentTab, 
    numberingSystem,
    updateToothNotes
  } = useOdontoStore();

  const [editingTooth, setEditingTooth] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const odontogram = getCurrentOdontogram();

  // Procesar y filtrar dientes con estados activos - ACTUALIZADO para incluir notas
  const getToothSummaries = (): ToothSummary[] => {
    const summaries: ToothSummary[] = [];

    Object.entries(odontogram).forEach(([toothNumberStr, toothData]) => {
      const toothNumber = parseInt(toothNumberStr);
      const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
      
      // Recopilar estados del diente
      const mainState = toothData.state !== 'healthy' ? toothData.state : undefined;
      const symbolStates = toothData.symbolStates || [];
      
      // Recopilar estados por caras (solo caras no sanas)
      const faceStates: { face: ToothFace; state: ToothState }[] = [];
      Object.entries(toothData.faces).forEach(([face, state]) => {
        if (state !== 'healthy') {
          faceStates.push({ face: face as ToothFace, state });
        }
      });

      // Si el diente tiene algún estado activo, agregarlo al resumen
      if (mainState || symbolStates.length > 0 || faceStates.length > 0) {
        summaries.push({
          toothNumber,
          displayNumber,
          states: {
            mainState,
            symbolStates,
            faceStates
          },
          notes: toothData.notes
        });
      }
    });

    // Ordenar por número de diente (numérico para permanentes, alfabético para deciduos)
    return summaries.sort((a, b) => {
      // Si ambos son strings (deciduos), ordenar alfabéticamente
      if (typeof a.displayNumber === 'string' && typeof b.displayNumber === 'string') {
        return a.displayNumber.localeCompare(b.displayNumber);
      }
      // Si ambos son números (permanentes), ordenar numéricamente
      if (typeof a.displayNumber === 'number' && typeof b.displayNumber === 'number') {
        return a.displayNumber - b.displayNumber;
      }
      // Deciduos después de permanentes
      if (typeof a.displayNumber === 'number' && typeof b.displayNumber === 'string') {
        return -1;
      }
      if (typeof a.displayNumber === 'string' && typeof b.displayNumber === 'number') {
        return 1;
      }
      return 0;
    });
  };

  // Formatear nombres de caras en español
  const formatFaceName = (face: ToothFace): string => {
    const faceNames: Record<ToothFace, string> = {
      mesial: 'Mesial',
      distal: 'Distal',
      vestibular: 'Vestibular',
      lingual: 'Lingual',
      palatina: 'Palatina',
      oclusal: 'Oclusal'
    };
    return faceNames[face];
  };

  // Manejar la edición de texto personalizado
  const handleEditClick = (toothNumber: number, currentNotes?: string) => {
    setEditingTooth(toothNumber);
    setEditText(currentNotes || '');
  };

  const handleSaveEdit = () => {
    if (editingTooth !== null) {
      updateToothNotes(editingTooth, editText.trim() || undefined);
      setEditingTooth(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTooth(null);
    setEditText('');
  };

  // Renderizar entrada de resumen para un diente - ACTUALIZADO para manejar múltiples símbolos y botón de edición
  const renderToothSummary = (summary: ToothSummary) => {
    const { displayNumber, states, notes, toothNumber } = summary;
    const entries: string[] = [];

    // Agregar estado principal (no símbolo)
    if (states.mainState && !isSymbolState(states.mainState)) {
      entries.push(`${TOOTH_STATE_COLORS[states.mainState].label}`);
    }

    // Agregar estados símbolo (múltiples)
    if (states.symbolStates.length > 0) {
      states.symbolStates.forEach(symbolState => {
        if (symbolState === 'otro' && notes) {
          // Para "otro", solo mostrar las notas sin el prefijo "Otro:"
          entries.push(notes);
        } else {
          entries.push(`${TOOTH_STATE_COLORS[symbolState].label}`);
        }
      });
    }

    // Agregar estados por caras agrupados
    if (states.faceStates.length > 0) {
      // Agrupar por estado
      const stateGroups: Partial<Record<ToothState, ToothFace[]>> = {};
      states.faceStates.forEach(({ face, state }) => {
        if (!stateGroups[state]) {
          stateGroups[state] = [];
        }
        stateGroups[state]!.push(face);
      });

      // Crear entradas para cada grupo de estado
      Object.entries(stateGroups).forEach(([state, faces]) => {
        if (faces) {
          const faceNames = faces.map(formatFaceName).join(', ');
          entries.push(`${TOOTH_STATE_COLORS[state as ToothState].label} en ${faceNames}`);
        }
      });
    }

    const toothData = odontogram[toothNumber];
    const customNotes = toothData?.notes && !states.symbolStates.includes('otro') ? toothData.notes : '';

    return (
      <div key={summary.toothNumber} className="mb-2 flex items-center justify-between">
        <div className="flex-1">
          <span className="font-semibold text-gray-800">
            Diente {displayNumber}:
          </span>
          <span className="ml-2 text-gray-700">
            {entries.join(' • ')}
            {customNotes && (
              <span className="ml-2 text-blue-600 italic">
                • {customNotes}
              </span>
            )}
          </span>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-4 h-8 w-8 p-0 hover:bg-gray-100"
              onClick={() => handleEditClick(toothNumber, customNotes)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar texto del diente {displayNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Texto personalizado:
                </label>
                <textarea
                  id="custom-text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Agregar texto personalizado para este diente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const summaries = getToothSummaries();
  const tabTitle = currentTab === 'diagnosis' ? 'Diagnóstico' : 'Tratamiento';

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Resumen del {tabTitle}
      </h3>
      
      {summaries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No hay estados dentales registrados en {tabTitle.toLowerCase()}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {summaries.map(renderToothSummary)}
        </div>
      )}
    </div>
  );
};

export default DiagnosisSummary;
