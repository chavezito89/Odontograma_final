
import React from 'react';
import { useOdontoStore, ToothState } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, isSymbolState, getStateSymbol } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';

const StateSelector: React.FC = () => {
  const { selectedState, setSelectedState } = useOdontoStore();
  
  // Estados organizados por categorías
  const symbolStates: ToothState[] = [
    'ausente',
    'movilidad',
    'macrodontia',
    'microdontia',
    'corona',
    'puente',
    'endodoncia',
    'tornillo',
    'temporal'
  ];
  
  const faceStates: ToothState[] = [
    'caries',
    'fisura',
    'desgaste',
    'furcacion',
    'fracturado',
    'amalgama',
    'resina',
    'carilla'
  ];

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
          "flex items-center space-x-2 p-2 rounded-lg border-2 transition-all duration-200",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          isSelected 
            ? "border-blue-500 bg-blue-50 shadow-md scale-105" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {/* Indicador de color o símbolo */}
        <div
          className={cn(
            "w-4 h-4 rounded border flex items-center justify-center text-xs font-bold",
            config.bg,
            config.border,
            hasSymbol ? "text-white" : ""
          )}
        >
          {hasSymbol && symbol}
        </div>
        
        {/* Etiqueta */}
        <span className={cn(
          "text-xs font-medium",
          isSelected ? "text-blue-700" : "text-gray-700"
        )}>
          {config.label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Estados Dentales</h3>
      
      {/* Estado sano */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Estado Base</h4>
        <div className="grid grid-cols-1 gap-2">
          {renderStateButton('healthy')}
        </div>
      </div>
      
      {/* Estados con símbolos */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Estados con Símbolos</h4>
        <div className="grid grid-cols-2 gap-2">
          {symbolStates.map(renderStateButton)}
        </div>
      </div>
      
      {/* Estados por cara */}
      <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Estados por Cara</h4>
        <div className="grid grid-cols-2 gap-2">
          {faceStates.map(renderStateButton)}
        </div>
      </div>
    </div>
  );
};

export default StateSelector;
