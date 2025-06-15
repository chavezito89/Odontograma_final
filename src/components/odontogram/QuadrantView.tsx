
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
    const mixedData = TOOTH_NUMBERS.mixed[quadrant];
    const isUpperQuadrant = quadrant === 'upperRight' || quadrant === 'upperLeft';
    
    return (
      <div className="space-y-2">
        {/* Primera fila */}
        <div className={cn(
          "flex gap-1 justify-center items-end",
          getFlexDirection(quadrant)
        )}>
          {isUpperQuadrant ? (
            // Cuadrantes superiores: permanentes arriba
            mixedData.permanent.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                toothNumber={toothNumber}
                className="flex-shrink-0"
              />
            ))
          ) : (
            // Cuadrantes inferiores: temporales arriba
            mixedData.deciduous.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                toothNumber={toothNumber}
                className="flex-shrink-0"
              />
            ))
          )}
        </div>
        
        {/* Segunda fila */}
        <div className={cn(
          "flex gap-1 justify-center items-end",
          getFlexDirection(quadrant)
        )}>
          {isUpperQuadrant ? (
            // Cuadrantes superiores: temporales abajo
            mixedData.deciduous.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                toothNumber={toothNumber}
                className="flex-shrink-0"
              />
            ))
          ) : (
            // Cuadrantes inferiores: permanentes abajo
            mixedData.permanent.map((toothNumber) => (
              <ToothComponent
                key={toothNumber}
                toothNumber={toothNumber}
                className="flex-shrink-0"
              />
            ))
          )}
        </div>
      </div>
    );
  };

  // Render single row for permanent or deciduous
  const renderSingleRow = () => {
    const teeth = TOOTH_NUMBERS[dentitionType]?.[quadrant];
    
    // Handle the case where teeth might be an object (mixed type) or array
    const teethArray = Array.isArray(teeth) ? teeth : [];
    
    return (
      <div className={cn(
        "flex gap-1 justify-center items-end",
        getFlexDirection(quadrant)
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
