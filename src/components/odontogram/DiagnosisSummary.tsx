
import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getDisplayNumber, TOOTH_STATE_COLORS, isSymbolState, getStateSymbol } from '@/utils/toothUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Obtener color del badge basado en el estado
  const getBadgeColor = (state: ToothState): string => {
    const config = TOOTH_STATE_COLORS[state];
    const colorMap: Record<string, string> = {
      'bg-red-500': 'bg-red-100 text-red-800 border-red-200',
      'bg-yellow-500': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-blue-500': 'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-500': 'bg-green-100 text-green-800 border-green-200',
      'bg-purple-500': 'bg-purple-100 text-purple-800 border-purple-200',
      'bg-purple-600': 'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-500': 'bg-orange-100 text-orange-800 border-orange-200',
      'bg-orange-400': 'bg-orange-100 text-orange-800 border-orange-200',
      'bg-purple-400': 'bg-purple-100 text-purple-800 border-purple-200',
      'bg-yellow-400': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-yellow-600': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-blue-600': 'bg-blue-100 text-blue-800 border-blue-200',
      'bg-amber-600': 'bg-amber-100 text-amber-800 border-amber-200',
      'bg-white': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[config.bg] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Renderizar badge de estado
  const renderStateBadge = (state: ToothState, label?: string) => {
    const symbol = getStateSymbol(state);
    const badgeColor = getBadgeColor(state);
    const displayLabel = label || TOOTH_STATE_COLORS[state].label;

    return (
      <Badge 
        key={state} 
        variant="outline" 
        className={cn("text-xs font-medium border", badgeColor)}
      >
        {symbol && <span className="mr-1">{symbol}</span>}
        {displayLabel}
      </Badge>
    );
  };

  // Renderizar entrada de resumen para un diente
  const renderToothSummary = (summary: ToothSummary) => {
    const { displayNumber, states, notes } = summary;
    const badges: React.ReactNode[] = [];

    // Agregar estado principal (no símbolo)
    if (states.mainState && !isSymbolState(states.mainState)) {
      badges.push(renderStateBadge(states.mainState));
    }

    // Agregar estado símbolo
    if (states.symbolState) {
      if (states.symbolState === 'otro' && notes) {
        // Para "otro", crear badge personalizado con las notas
        badges.push(
          <Badge 
            key="otro-custom" 
            variant="outline" 
            className={cn("text-xs font-medium border", getBadgeColor(states.symbolState))}
          >
            <span className="mr-1">?</span>
            {notes}
          </Badge>
        );
      } else {
        badges.push(renderStateBadge(states.symbolState));
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

      // Crear badges para cada grupo de estado
      Object.entries(stateGroups).forEach(([state, faces]) => {
        if (faces) {
          const faceNames = faces.map(formatFaceName).join(', ');
          badges.push(
            renderStateBadge(
              state as ToothState, 
              `${TOOTH_STATE_COLORS[state as ToothState].label} en ${faceNames}`
            )
          );
        }
      });
    }

    return (
      <Card key={summary.toothNumber} className="mb-3 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Número de diente destacado */}
            <Badge variant="default" className="bg-blue-600 text-white font-bold text-sm px-3 py-1 flex-shrink-0">
              Diente {displayNumber}
            </Badge>
            
            {/* Estados como badges */}
            <div className="flex flex-wrap gap-2 flex-1">
              {badges}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const summaries = getToothSummaries();
  const tabTitle = currentTab === 'diagnosis' ? 'Diagnóstico' : 'Tratamiento';

  return (
    <Card className="w-full mx-auto shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">
          📋 Resumen del {tabTitle}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {summaries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦷</div>
            <p className="text-gray-500 text-xl font-medium">
              No hay estados dentales registrados en {tabTitle.toLowerCase()}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Selecciona un estado dental y haz clic en los dientes para comenzar
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center mb-6">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-sm px-4 py-1">
                {summaries.length} {summaries.length === 1 ? 'diente afectado' : 'dientes afectados'}
              </Badge>
            </div>
            {summaries.map(renderToothSummary)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosisSummary;
