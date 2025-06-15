
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
  
  const teeth = TOOTH_NUMBERS[dentitionType][quadrant];
  
  const getQuadrantLabel = (quad: string): string => {
    switch (quad) {
      case 'upperRight': return 'MAXILAR DERECHO';
      case 'upperLeft': return 'MAXILAR IZQUIERDO';
      case 'lowerLeft': return 'MANDIBULAR IZQUIERDO';
      case 'lowerRight': return 'MANDIBULAR DERECHO';
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
        <h3 className="text-sm font-bold text-gray-700 mb-4">
          {getQuadrantLabel(quadrant)}
        </h3>
        
        {/* Contenedor de dientes */}
        <div className={cn(
          "flex gap-1 justify-center items-center",
          getFlexDirection(quadrant)
        )}>
          {teeth.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              toothNumber={toothNumber}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuadrantView;
