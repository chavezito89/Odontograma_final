

import React from 'react';
import { useOdontoStore, ToothState } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, isSymbolState, getStateSymbol, isIconState, getStateIcon, getStateIconColor } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';
import { TrendingUp, Circle, AudioWaveform, Blinds, Square, Diamond } from 'lucide-react';

const StateSelector: React.FC = () => {
  const {
    selectedState,
    setSelectedState,
    bridgeSelection,
    cancelBridgeSelection
  } = useOdontoStore();

  // Estados organizados por categorías - ACTUALIZADO con nuevos estados especiales
  const symbolStates: ToothState[] = ['ausente', 'extraccion', 'movilidad', 'macrodontia', 'microdontia', 'corona', 'puente', 'endodoncia', 'tornillo', 'temporal', 'carilla', 'fractura', 'furcacion', 'otro'];
  const faceStates: ToothState[] = ['caries', 'fisura', 'desgaste', 'amalgama', 'resina'];

  // Obtener color del símbolo
  const getSymbolColor = (state: ToothState): string => {
    const config = TOOTH_STATE_COLORS[state];
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-orange-500': '#f97316',
      'bg-purple-500': '#a855f7',
      'bg-purple-600': '#9333ea'
    };
    return colorMap[config.bg] || '#000000';
  };

  const renderStateButton = (state: ToothState) => {
    const config = TOOTH_STATE_COLORS[state];
    const isSelected = selectedState === state;
    const hasSymbol = isSymbolState(state);
    const hasIcon = isIconState(state);
    const symbol = getStateSymbol(state);
    const icon = getStateIcon(state);
    const iconColor = getStateIconColor(state);

    return (
      <button
        key={state}
        onClick={() => setSelectedState(state)}
        className={cn(
          "w-full flex items-center space-x-2 p-2 rounded-lg border-2 transition-all duration-200",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
          isSelected 
            ? "border-blue-500 bg-blue-50 shadow-md" 
            : "border-gray-200 hover:border-gray-300"
        )}
      >
        {/* Indicador de color, símbolo o ícono */}
        <div 
          className={cn(
            "w-5 h-5 rounded border flex items-center justify-center text-sm font-bold flex-shrink-0",
            (hasSymbol || hasIcon)
              ? "border-gray-300 bg-white" 
              : `${config.bg} ${config.border}`
          )}
          style={(hasSymbol || hasIcon) ? {} : {}}
        >
          {hasIcon && icon && iconColor ? (
            (() => {
              const IconComponent = {
                'trending-up': TrendingUp,
                'circle': Circle,
                'audio-waveform': AudioWaveform,
                'blinds': Blinds,
                'square': Square,
                'diamond': Diamond
              }[icon];

              return IconComponent ? (
                <IconComponent
                  size={12}
                  color={iconColor}
                  strokeWidth={
                    state === 'corona' || state === 'puente' 
                      ? 3 
                      : 4
                  }
                  style={{
                    transform: state === 'endodoncia' ? 'rotate(90deg)' : undefined
                  }}
                />
              ) : null;
            })()
          ) : hasSymbol && symbol ? (
            <span style={{ color: getSymbolColor(state) }}>{symbol}</span>
          ) : null}
        </div>
        
        {/* Etiqueta */}
        <span className={cn(
          "text-xs font-medium text-left leading-tight",
          isSelected ? "text-blue-700" : "text-gray-700"
        )}>
          {config.label}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Estados Dentales</h3>
      
      {/* Modo puente activo */}
      {bridgeSelection.isActive && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-purple-800">Modo Puente Activo</h4>
            <button
              onClick={cancelBridgeSelection}
              className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Cancelar
            </button>
          </div>
          <p className="text-xs text-purple-700">
            {!bridgeSelection.firstPilar 
              ? "1. Selecciona el primer diente pilar 🟣" 
              : "2. Selecciona el segundo diente pilar 🟣"
            }
          </p>
          {bridgeSelection.firstPilar && (
            <p className="text-xs text-purple-600 mt-1">
              Primer pilar: {bridgeSelection.firstPilar}
            </p>
          )}
        </div>
      )}
      
      {/* Estado sano */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Estado Normal</h4>
        <div className="grid grid-cols-1 gap-1">
          {renderStateButton('healthy')}
        </div>
      </div>
      
      {/* Estados con símbolos - doble columna */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Estados Especiales</h4>
        <div className="grid grid-cols-2 gap-1">
          {symbolStates.map(renderStateButton)}
        </div>
      </div>
      
      {/* Estados por cara - doble columna */}
      <div>
        <h4 className="text-xs font-medium text-gray-600 mb-2">Estados por Cara</h4>
        <div className="grid grid-cols-2 gap-1">
          {faceStates.map(renderStateButton)}
        </div>
      </div>
    </div>
  );
};

export default StateSelector;
