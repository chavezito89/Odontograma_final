import React, { useState } from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getDisplayNumber, TOOTH_STATE_COLORS, isSymbolState } from '@/utils/toothUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BridgeEntry {
  type: 'bridge';
  bridgeId: string;
  range: string;
  displayRange: string;
}

interface ToothEntry {
  type: 'tooth';
  toothNumber: number;
  displayNumber: string | number;
  states: {
    mainState?: ToothState;
    symbolStates: ToothState[];
    faceStates: { face: ToothFace; state: ToothState }[];
  };
  notes?: string;
}

type SummaryEntry = BridgeEntry | ToothEntry;

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

  // Función para exportar JSON
  const exportToJSON = () => {
    const summaryEntries = getSummaryEntries();
    const exportData = {
      type: currentTab,
      timestamp: new Date().toISOString(),
      numberingSystem,
      data: summaryEntries.map(entry => {
        if (entry.type === 'bridge') {
          return {
            type: 'bridge',
            bridgeId: entry.bridgeId,
            range: entry.range,
            displayRange: entry.displayRange,
            description: `Dientes ${entry.displayRange}: ${TOOTH_STATE_COLORS.puente.label}`
          };
        } else {
          const entries: string[] = [];

          // Agregar estado principal
          if (entry.states.mainState && !isSymbolState(entry.states.mainState)) {
            entries.push(TOOTH_STATE_COLORS[entry.states.mainState].label);
          }

          // Agregar estados símbolo
          if (entry.states.symbolStates.length > 0) {
            entry.states.symbolStates.forEach(symbolState => {
              if (symbolState === 'otro' && entry.notes) {
                entries.push(entry.notes);
              } else {
                entries.push(TOOTH_STATE_COLORS[symbolState].label);
              }
            });
          }

          // Agregar estados por caras
          if (entry.states.faceStates.length > 0) {
            const stateGroups: Partial<Record<ToothState, ToothFace[]>> = {};
            entry.states.faceStates.forEach(({ face, state }) => {
              if (!stateGroups[state]) {
                stateGroups[state] = [];
              }
              stateGroups[state]!.push(face);
            });

            Object.entries(stateGroups).forEach(([state, faces]) => {
              if (faces) {
                const faceNames = faces.map(formatFaceName).join(', ');
                entries.push(`${TOOTH_STATE_COLORS[state as ToothState].label} en ${faceNames}`);
              }
            });
          }

          const toothData = odontogram[entry.toothNumber];
          const customNotes = toothData?.notes && !entry.states.symbolStates.includes('otro') ? toothData.notes : '';

          return {
            type: 'tooth',
            toothNumber: entry.toothNumber,
            displayNumber: entry.displayNumber,
            states: entry.states,
            description: `Diente ${entry.displayNumber}: ${entries.join(' • ')}${customNotes ? ` • ${customNotes}` : ''}`,
            notes: entry.notes || customNotes
          };
        }
      })
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentTab === 'diagnosis' ? 'diagnostico' : 'tratamiento'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Procesar puentes del odontograma
  const processBridges = (): BridgeEntry[] => {
    const bridgeGroups: Record<string, number[]> = {};
    
    // Agrupar dientes por bridgeId
    Object.entries(odontogram).forEach(([toothNumberStr, toothData]) => {
      if (toothData.bridgeInfo?.bridgeId) {
        const bridgeId = toothData.bridgeInfo.bridgeId;
        if (!bridgeGroups[bridgeId]) {
          bridgeGroups[bridgeId] = [];
        }
        bridgeGroups[bridgeId].push(parseInt(toothNumberStr));
      }
    });

    // Crear entradas de puente
    return Object.entries(bridgeGroups).map(([bridgeId, toothNumbers]) => {
      const sortedNumbers = toothNumbers.sort((a, b) => a - b);
      const minTooth = sortedNumbers[0];
      const maxTooth = sortedNumbers[sortedNumbers.length - 1];
      
      const minDisplay = getDisplayNumber(minTooth, numberingSystem);
      const maxDisplay = getDisplayNumber(maxTooth, numberingSystem);
      
      return {
        type: 'bridge' as const,
        bridgeId,
        range: `${minTooth}-${maxTooth}`,
        displayRange: `${minDisplay}-${maxDisplay}`
      };
    });
  };

  // Procesar dientes individuales (excluyendo puentes simples)
  const processIndividualTeeth = (bridgeTeeth: Set<number>): ToothEntry[] => {
    const entries: ToothEntry[] = [];

    Object.entries(odontogram).forEach(([toothNumberStr, toothData]) => {
      const toothNumber = parseInt(toothNumberStr);
      const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
      
      // Recopilar estados del diente (excluyendo puente si es el único estado)
      const mainState = toothData.state !== 'healthy' ? toothData.state : undefined;
      const symbolStates = (toothData.symbolStates || []).filter(state => state !== 'puente');
      
      // Recopilar estados por caras (solo caras no sanas)
      const faceStates: { face: ToothFace; state: ToothState }[] = [];
      Object.entries(toothData.faces).forEach(([face, state]) => {
        if (state !== 'healthy') {
          faceStates.push({ face: face as ToothFace, state });
        }
      });

      // Determinar si el diente tiene otros tratamientos además del puente
      const hasOtherTreatments = mainState || symbolStates.length > 0 || faceStates.length > 0;
      
      // Solo agregar si:
      // 1. No es parte de un puente, O
      // 2. Es parte de un puente PERO tiene otros tratamientos
      if (!bridgeTeeth.has(toothNumber) || (bridgeTeeth.has(toothNumber) && hasOtherTreatments)) {
        if (hasOtherTreatments) {
          entries.push({
            type: 'tooth',
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
      }
    });

    return entries;
  };

  // Obtener todas las entradas del resumen
  const getSummaryEntries = (): SummaryEntry[] => {
    const bridgeEntries = processBridges();
    
    // Crear set de dientes que son parte de puentes
    const bridgeTeeth = new Set<number>();
    Object.entries(odontogram).forEach(([toothNumberStr, toothData]) => {
      if (toothData.bridgeInfo?.bridgeId) {
        bridgeTeeth.add(parseInt(toothNumberStr));
      }
    });
    
    const toothEntries = processIndividualTeeth(bridgeTeeth);
    
    // Combinar y ordenar entradas
    const allEntries: SummaryEntry[] = [...bridgeEntries, ...toothEntries];
    
    return allEntries.sort((a, b) => {
      // Puentes primero, luego dientes individuales
      if (a.type === 'bridge' && b.type === 'tooth') return -1;
      if (a.type === 'tooth' && b.type === 'bridge') return 1;
      
      if (a.type === 'bridge' && b.type === 'bridge') {
        return a.range.localeCompare(b.range);
      }
      
      if (a.type === 'tooth' && b.type === 'tooth') {
        // Ordenar dientes por número de display
        if (typeof a.displayNumber === 'string' && typeof b.displayNumber === 'string') {
          return a.displayNumber.localeCompare(b.displayNumber);
        }
        if (typeof a.displayNumber === 'number' && typeof b.displayNumber === 'number') {
          return a.displayNumber - b.displayNumber;
        }
        if (typeof a.displayNumber === 'number' && typeof b.displayNumber === 'string') {
          return -1;
        }
        if (typeof a.displayNumber === 'string' && typeof b.displayNumber === 'number') {
          return 1;
        }
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
      palatina: 'Palatino',
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

  // Renderizar entrada de puente
  const renderBridgeEntry = (entry: BridgeEntry) => {
    return (
      <div key={entry.bridgeId} className="mb-2">
        <span className="font-semibold text-gray-800">
          Dientes {entry.displayRange}:
        </span>
        <span className="ml-2 text-gray-700">
          {TOOTH_STATE_COLORS.puente.label}
        </span>
      </div>
    );
  };

  // Renderizar entrada de diente individual
  const renderToothEntry = (entry: ToothEntry) => {
    const { displayNumber, states, notes, toothNumber } = entry;
    const entries: string[] = [];

    // Agregar estado principal (no símbolo)
    if (states.mainState && !isSymbolState(states.mainState)) {
      entries.push(`${TOOTH_STATE_COLORS[states.mainState].label}`);
    }

    // Agregar estados símbolo (múltiples)
    if (states.symbolStates.length > 0) {
      states.symbolStates.forEach(symbolState => {
        if (symbolState === 'otro' && notes) {
          entries.push(notes);
        } else {
          entries.push(`${TOOTH_STATE_COLORS[symbolState].label}`);
        }
      });
    }

    // Agregar estados por caras agrupados
    if (states.faceStates.length > 0) {
      const stateGroups: Partial<Record<ToothState, ToothFace[]>> = {};
      states.faceStates.forEach(({ face, state }) => {
        if (!stateGroups[state]) {
          stateGroups[state] = [];
        }
        stateGroups[state]!.push(face);
      });

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
      <div key={toothNumber} className="mb-2 flex items-center justify-between">
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

  // Renderizar entrada del resumen
  const renderSummaryEntry = (entry: SummaryEntry) => {
    if (entry.type === 'bridge') {
      return renderBridgeEntry(entry);
    } else {
      return renderToothEntry(entry);
    }
  };

  const summaryEntries = getSummaryEntries();
  const tabTitle = currentTab === 'diagnosis' ? 'Diagnóstico' : 'Tratamiento';

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Resumen del {tabTitle}
        </h3>
        
        {summaryEntries.length > 0 && (
          <Button
            onClick={exportToJSON}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </Button>
        )}
      </div>
      
      {summaryEntries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No hay estados dentales registrados en {tabTitle.toLowerCase()}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {summaryEntries.map(renderSummaryEntry)}
        </div>
      )}
    </div>
  );
};

export default DiagnosisSummary;
