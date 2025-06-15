
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
      {/* Contenedor principal del diente */}
      <div
        className={cn(
          "relative w-16 h-16 cursor-pointer transition-all duration-200",
          "border-2 border-gray-400 bg-white hover:shadow-md",
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Cara Oclusal (Superior) */}
        <div 
          className={cn(
            "absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 cursor-pointer hover:opacity-80 transition-opacity border border-gray-400",
            getFaceColor('oclusal')
          )}
          onClick={(e) => handleFaceClick('oclusal', e)}
          title="Cara Oclusal"
        />
        
        {/* Cara Mesial (Izquierda) */}
        <div 
          className={cn(
            "absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-8 cursor-pointer hover:opacity-80 transition-opacity border border-gray-400",
            getFaceColor('mesial')
          )}
          onClick={(e) => handleFaceClick('mesial', e)}
          title="Cara Mesial"
        />
        
        {/* Cara Vestibular (Centro) - Aquí va el número */}
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity border border-gray-400 flex items-center justify-center",
            getFaceColor('vestibular')
          )}
          onClick={(e) => handleFaceClick('vestibular', e)}
          title="Cara Vestibular"
        >
          <span className="text-xs font-bold text-gray-800">{displayNumber}</span>
        </div>
        
        {/* Cara Distal (Derecha) */}
        <div 
          className={cn(
            "absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-8 cursor-pointer hover:opacity-80 transition-opacity border border-gray-400",
            getFaceColor('distal')
          )}
          onClick={(e) => handleFaceClick('distal', e)}
          title="Cara Distal"
        />
        
        {/* Cara Lingual (Inferior) */}
        <div 
          className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 cursor-pointer hover:opacity-80 transition-opacity border border-gray-400",
            getFaceColor('lingual')
          )}
          onClick={(e) => handleFaceClick('lingual', e)}
          title="Cara Lingual"
        />
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

export default ToothComponent;
