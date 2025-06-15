
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

  // Fix: Properly type the teeth array to avoid union type issues
  const getTeethArray = (): number[] => {
    const teethData = TOOTH_NUMBERS[dentitionType]?.[quadrant];
    
    // Si es mixed dentition, usar solo permanent para evitar dobles filas
    if (dentitionType === 'mixed' && teethData && typeof teethData === 'object' && 'permanent' in teethData) {
      return (teethData.permanent || []) as number[];
    }
    
    // Para permanent y deciduous que ya son arrays
    return (Array.isArray(teethData) ? teethData : []) as number[];
  };

  const teeth = getTeethArray();

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {/* Etiqueta del cuadrante */}
      <div className="text-center mb-3">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">
          {getQuadrantLabel(quadrant)}
        </h3>
        
        {/* Contenedor de dientes - UNA SOLA FILA */}
        <div className="w-full">
          <div className={cn(
            "flex gap-1 justify-center items-end flex-wrap",
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
    </div>
  );
};

export default QuadrantView;
