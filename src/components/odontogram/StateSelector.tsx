
import React from 'react';
import { useOdontoStore, ToothState } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';

const StateSelector: React.FC = () => {
  const { selectedState, setSelectedState } = useOdontoStore();
  
  const states: ToothState[] = [
    'healthy',
    'caries',
    'restoration',
    'crown',
    'endodontics',
    'extraction',
    'implant',
    'fissure',
    'missing'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Estados Dentales</h3>
      
      <div className="grid grid-cols-3 gap-3">
        {states.map((state) => {
          const config = TOOTH_STATE_COLORS[state];
          const isSelected = selectedState === state;
          
          return (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200",
                "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                isSelected 
                  ? "border-blue-500 bg-blue-50 shadow-md scale-105" 
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              {/* Indicador de color */}
              <div
                className={cn(
                  "w-4 h-4 rounded-full border",
                  config.bg,
                  config.border
                )}
              />
              
              {/* Etiqueta */}
              <span className={cn(
                "text-sm font-medium",
                isSelected ? "text-blue-700" : "text-gray-700"
              )}>
                {config.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StateSelector;
