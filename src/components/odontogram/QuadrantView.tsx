
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

  // Render mixed dentition with two rows
  const renderMixedDentition = () => {
    const mixedData = TOOTH_NUMBERS.mixed[quadrant] as { permanent: number[], deciduous: number[] };
    
    return (
      <div className="space-y-2">
        {/* Permanent teeth row */}
        <div className={cn(
          "flex gap-1 justify-center items-end",
          getFlexDirection(quadrant)
        )}>
          {mixedData.permanent.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              toothNumber={toothNumber}
              className="flex-shrink-0"
            />
          ))}
        </div>
        
        {/* Deciduous teeth row */}
        <div className={cn(
          "flex gap-1 justify-center items-end",
          getFlexDirection(quadrant)
        )}>
          {mixedData.deciduous.map((toothNumber) => (
            <ToothComponent
              key={toothNumber}
              toothNumber={toothNumber}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  };

  // Render single row for permanent or deciduous
  const renderSingleRow = () => {
    const teeth = TOOTH_NUMBERS[dentitionType]?.[quadrant] || TOOTH_NUMBERS.permanent[quadrant] || [];
    
    return (
      <div className={cn(
        "flex gap-1 justify-center items-end",
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
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Etiqueta del cuadrante */}
      <div className="text-center">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {getQuadrantLabel(quadrant)}
        </h3>
        
        {/* Contenedor de dientes con padding reducido para dentición mixta */}
        <div className={dentitionType === 'mixed' ? 'pb-4' : 'pb-6'}>
          {dentitionType === 'mixed' ? renderMixedDentition() : renderSingleRow()}
        </div>
      </div>
    </div>
  );
};

export default QuadrantView;
