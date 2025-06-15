
import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getStateClasses, TOOTH_STATE_COLORS, getDisplayNumber } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';

interface ToothComponentProps {
  toothNumber: number;
  className?: string;
}

const ToothComponent: React.FC<ToothComponentProps> = ({ toothNumber, className }) => {
  const { 
    getCurrentOdontogram, 
    selectedTooth, 
    selectedState,
    numberingSystem,
    setSelectedTooth,
    updateToothState,
    updateToothFace 
  } = useOdontoStore();
  
  const odontogram = getCurrentOdontogram();
  const toothData = odontogram[toothNumber];
  const isSelected = selectedTooth === toothNumber;
  const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
  
  // Manejar click en el diente completo
  const handleToothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      updateToothState(toothNumber, selectedState);
    } else {
      setSelectedTooth(toothNumber);
    }
  };
  
  // Manejar click en una cara específica
  const handleFaceClick = (face: ToothFace, e: React.MouseEvent) => {
    e.stopPropagation();
    updateToothFace(toothNumber, face, selectedState);
  };
  
  // Obtener color de la cara
  const getFaceColor = (face: ToothFace): string => {
    const faceState = toothData?.faces[face] || 'healthy';
    return TOOTH_STATE_COLORS[faceState].bg;
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Contenedor principal del diente con efecto isométrico */}
      <div
        className={cn(
          "relative w-16 h-16 cursor-pointer transition-all duration-300",
          "hover:scale-105",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Estructura isométrica del diente */}
        <div className="relative w-full h-full">
          
          {/* Cara Oclusal (Centro/Top) - Forma de rombo */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-8 h-8 transform rotate-45 top-1 left-4",
              "border border-gray-400 flex items-center justify-center",
              getFaceColor('oclusal')
            )}
            onClick={(e) => handleFaceClick('oclusal', e)}
            title="Cara Oclusal"
            style={{
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            }}
          >
            <span className={cn(
              "text-xs font-bold select-none transform -rotate-45",
              "text-gray-800 z-10"
            )}>
              {displayNumber}
            </span>
          </div>
          
          {/* Cara Vestibular (Izquierda) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-4 h-8 top-4 left-0",
              "border-l border-t border-b border-gray-400",
              "transform skew-y-12",
              getFaceColor('vestibular')
            )}
            onClick={(e) => handleFaceClick('vestibular', e)}
            title="Cara Vestibular"
          />
          
          {/* Cara Lingual (Derecha) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-4 h-8 top-4 right-0",
              "border-r border-t border-b border-gray-400",
              "transform skew-y-[-12deg]",
              getFaceColor('lingual')
            )}
            onClick={(e) => handleFaceClick('lingual', e)}
            title="Cara Lingual"
          />
          
          {/* Cara Mesial (Superior) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-8 h-4 top-0 left-4",
              "border-t border-l border-r border-gray-400",
              "transform skew-x-12",
              getFaceColor('mesial')
            )}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Cara Distal (Inferior) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-8 h-4 bottom-0 left-4",
              "border-b border-l border-r border-gray-400",
              "transform skew-x-[-12deg]",
              getFaceColor('distal')
            )}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          />
          
        </div>
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse shadow-sm" />
      )}
    </div>
  );
};

export default ToothComponent;
