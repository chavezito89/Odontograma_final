
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
  
  // Add safety check and fallback to permanent if undefined
  const teeth = TOOTH_NUMBERS[dentitionType]?.[quadrant] || TOOTH_NUMBERS.permanent[quadrant] || [];
  
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

  return (
    <div className={cn("space-y-4", className)}>
      {/* Etiqueta del cuadrante */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {getQuadrantLabel(quadrant)}
        </h3>
        
        {/* Contenedor de dientes - reducido gap y padding */}
        <div className={cn(
          "flex gap-1 justify-center items-end pb-6",
          getFlexDirection(quadrant)
        )}>
          {teeth.length > 0 ? (
            teeth.map((toothNumber) => (
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
  );
};

export default QuadrantView;
