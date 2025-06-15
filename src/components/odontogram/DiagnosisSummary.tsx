
import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getDisplayNumber, TOOTH_STATE_COLORS, isSymbolState } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';

interface ToothSummary {
  toothNumber: number;
  displayNumber: string | number;
  states: {
    mainState?: ToothState;
    symbolState?: ToothState;
    faceStates: { face: ToothFace; state: ToothState }[];
  };
  notes?: string;
}

const DiagnosisSummary: React.FC = () => {
  const { 
    getCurrentOdontogram, 
    currentTab, 
    numberingSystem 
  } = useOdontoStore();

  const odontogram = getCurrentOdontogram();

  // Procesar y filtrar dientes con estados activos - ACTUALIZADO para incluir notas
  const getToothSummaries = (): ToothSummary[] => {
    const summaries: ToothSummary[] = [];

    Object.entries(odontogram).forEach(([toothNumberStr, toothData]) => {
      const toothNumber = parseInt(toothNumberStr);
      const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
      
      // Recopilar estados del diente
      const mainState = toothData.state !== 'healthy' ? toothData.state : undefined;
      const symbolState = toothData.symbolState;
      
      // Recopilar estados por caras (solo caras no sanas)
      const faceStates: { face: ToothFace; state: ToothState }[] = [];
      Object.entries(toothData.faces).forEach(([face, state]) => {
        if (state !== 'healthy') {
          faceStates.push({ face: face as ToothFace, state });
        }
      });

      // Si el diente tiene algún estado activo, agregarlo al resumen
      if (mainState || symbolState || faceStates.length > 0) {
        summaries.push({
          toothNumber,
          displayNumber,
          states: {
            mainState,
            symbolState,
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

  // Renderizar entrada de resumen para un diente - ACTUALIZADO para no mostrar "Otro:"
  const renderToothSummary = (summary: ToothSummary) => {
    const { displayNumber, states, notes } = summary;
    const entries: string[] = [];

    // Agregar estado principal (no símbolo)
    if (states.mainState && !isSymbolState(states.mainState)) {
      entries.push(`${TOOTH_STATE_COLORS[states.mainState].label}`);
    }

    // Agregar estado símbolo
    if (states.symbolState) {
      if (states.symbolState === 'otro' && notes) {
        // Para "otro", solo mostrar las notas sin el prefijo "Otro:"
        entries.push(notes);
      } else {
        entries.push(`${TOOTH_STATE_COLORS[states.symbolState].label}`);
      }
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

    return (
      <div key={summary.toothNumber} className="mb-2">
        <span className="font-semibold text-gray-800">
          Diente {displayNumber}:
        </span>
        <span className="ml-2 text-gray-700">
          {entries.join(' • ')}
        </span>
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
