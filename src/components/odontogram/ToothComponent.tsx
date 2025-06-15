
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
          "relative w-20 h-24 cursor-pointer transition-all duration-300",
          "hover:scale-105",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Estructura del diente con 5 caras */}
        <div className="relative w-full h-full border-2 border-gray-400 bg-white rounded-sm">
          
          {/* Cara Mesial (Superior) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-full h-6 top-0 left-0 border-b border-gray-300",
              getFaceColor('mesial')
            )}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Sección media con 3 caras */}
          <div className="absolute top-6 left-0 w-full h-12 flex">
            
            {/* Cara Vestibular (Izquierda) */}
            <div 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:brightness-90",
                "w-1/4 h-full border-r border-gray-300",
                getFaceColor('vestibular')
              )}
              onClick={(e) => handleFaceClick('vestibular', e)}
              title="Cara Vestibular"
            />
            
            {/* Cara Oclusal (Centro) */}
            <div 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:brightness-90",
                "w-1/2 h-full flex items-center justify-center border-r border-gray-300",
                getFaceColor('oclusal')
              )}
              onClick={(e) => handleFaceClick('oclusal', e)}
              title="Cara Oclusal"
            >
              <span className={cn(
                "text-sm font-bold select-none",
                "text-gray-800"
              )}>
                {displayNumber}
              </span>
            </div>
            
            {/* Cara Lingual (Derecha) */}
            <div 
              className={cn(
                "cursor-pointer transition-all duration-200 hover:brightness-90",
                "w-1/4 h-full",
                getFaceColor('lingual')
              )}
              onClick={(e) => handleFaceClick('lingual', e)}
              title="Cara Lingual"
            />
            
          </div>
          
          {/* Cara Distal (Inferior) */}
          <div 
            className={cn(
              "absolute cursor-pointer transition-all duration-200 hover:brightness-90",
              "w-full h-6 bottom-0 left-0 border-t border-gray-300",
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
