
import React from 'react';
import ToothComponent from './ToothComponent';
import { TOOTH_NUMBERS } from '@/utils/toothUtils';
import { useOdontoStore } from '@/store/odontoStore';
import { cn } from '@/lib/utils';

interface QuadrantViewProps {
  quadrant: 'upperRight' | 'upperLeft' | 'lowerLeft' | 'lowerRight';
  className?: string;
}

const QuadrantView: React.FC<QuadrantViewProps> = ({ quadrant, className }) => {
  const { dentitionType } = useOdontoStore();
  
  const getQuadrantLabel = (quad: string): string => {
    switch (quad) {
      case 'upperRight': return 'Superior Derecho';
      case 'upperLeft': return 'Superior Izquierdo';
      case 'lowerLeft': return 'Inferior Izquierdo';
      case 'lowerRight': return 'Inferior Derecho';
      default: return '';
    }
  };
  
  const getFlexDirection = (quad: string): string => {
    switch (quad) {
      case 'upperRight': return 'flex-row-reverse';
      case 'upperLeft': return 'flex-row';
      case 'lowerLeft': return 'flex-row';
      case 'lowerRight': return 'flex-row-reverse';
      default: return 'flex-row';
    }
  };

  // Obtener dientes para el cuadrante, siempre como array
  const getTeethArray = (): number[] => {
    const teeth = TOOTH_NUMBERS[dentitionType]?.[quadrant];
    
    // Si es dentición mixta, usar solo los permanentes para mantener estructura simple
    if (dentitionType === 'mixed' && teeth && typeof teeth === 'object' && !Array.isArray(teeth)) {
      return teeth.permanent || [];
    }
    
    // Si es array, devolverlo directamente
    if (Array.isArray(teeth)) {
      return teeth;
    }
    
    return [];
  };

  const teethArray = getTeethArray();

  return (
    <div className={cn("w-full", className)}>
      {/* Etiqueta del cuadrante */}
      <div className="text-center mb-3">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">
          {getQuadrantLabel(quadrant)}
        </h3>
        
        {/* Contenedor de dientes - una sola fila siempre */}
        <div className="w-full overflow-x-auto">
          <div className={cn(
            "flex gap-1 justify-center items-end",
            getFlexDirection(quadrant),
            "min-w-max" // Asegurar que no se envuelvan los dientes
          )}>
            {teethArray.length > 0 ? (
              teethArray.map((toothNumber) => (
                <ToothComponent
                  key={toothNumber}
                  toothNumber={toothNumber}
                  className="flex-shrink-0"
                />
              ))
            ) : (
              <div className="text-gray-500 text-sm">No hay dientes para mostrar</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadrantView;
