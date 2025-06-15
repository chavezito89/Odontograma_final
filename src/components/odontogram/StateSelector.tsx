
import React from 'react';
import { useOdontoStore, ToothState } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, isSymbolState, getStateSymbol } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';

const StateSelector: React.FC = () => {
  const {
    selectedState,
    setSelectedState
  } = useOdontoStore();

  // Estados organizados por categorías
  const symbolStates: ToothState[] = ['ausente', 'movilidad', 'macrodontia', 'microdontia', 'corona', 'puente', 'endodoncia', 'tornillo', 'temporal'];
  const faceStates: ToothState[] = ['caries', 'fisura', 'desgaste', 'furcacion', 'fracturado', 'amalgama', 'resina', 'carilla'];

  // Obtener color del símbolo
  const getSymbolColor = (state: ToothState): string => {
    const config = TOOTH_STATE_COLORS[state];
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e'
    };
    return colorMap[config.bg] || '#000000';
  };

  const renderStateButton = (state: ToothState) => {
    const config = TOOTH_STATE_COLORS[state];
    const isSelected = selectedState === state;
    const hasSymbol = isSymbolState(state);
    const symbol = getStateSymbol(state);

    return (
      <button
        key={state}
        onClick={() => setSelectedState(state)}
        className={cn(
          "w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          isSelected 
            ? "border-blue-500 bg-blue-50 shadow-md" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {/* Indicador de color o símbolo */}
        <div 
          className={cn(
            "w-6 h-6 rounded border flex items-center justify-center text-sm font-bold flex-shrink-0",
            hasSymbol 
              ? "border-gray-300 bg-white" 
              : `${config.bg} ${config.border}`
          )}
          style={hasSymbol ? { color: getSymbolColor(state) } : {}}
        >
          {hasSymbol && symbol}
        </div>
        
        {/* Etiqueta */}
        <span className={cn(
          "text-sm font-medium text-left",
          isSelected ? "text-blue-700" : "text-gray-700"
        )}>
          {config.label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Estados Dentales</h3>
      
      {/* Estado sano */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Estado Normal</h4>
        <div className="space-y-2">
          {renderStateButton('healthy')}
        </div>
      </div>
      
      {/* Estados con símbolos */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Estados Especiales</h4>
        <div className="space-y-2">
          {symbolStates.map(renderStateButton)}
        </div>
      </div>
      
      {/* Estados por cara */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-3">Estados por Cara</h4>
        <div className="space-y-2">
          {faceStates.map(renderStateButton)}
        </div>
      </div>
    </div>
  );
};

export default StateSelector;
