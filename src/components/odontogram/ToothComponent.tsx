
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
          "relative w-16 h-20 cursor-pointer transition-all duration-300",
          "bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md",
          "grid grid-cols-4 grid-rows-5 gap-0 overflow-hidden",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2 border-blue-400" : "hover:border-gray-400"
        )}
        onClick={handleToothClick}
      >
        {/* Cara Oclusal (Fila 1, columnas 2-3) */}
        <div 
          className={cn(
            "col-span-2 col-start-2 row-start-1 cursor-pointer",
            "hover:brightness-90 transition-all duration-200",
            "border-b border-gray-200 relative",
            getFaceColor('oclusal')
          )}
          onClick={(e) => handleFaceClick('oclusal', e)}
          title="Cara Oclusal"
        />
        
        {/* Cara Mesial (Filas 2-4, columna 1) */}
        <div 
          className={cn(
            "col-start-1 row-start-2 row-span-3 cursor-pointer",
            "hover:brightness-90 transition-all duration-200",
            "border-r border-gray-200 relative",
            getFaceColor('mesial')
          )}
          onClick={(e) => handleFaceClick('mesial', e)}
          title="Cara Mesial"
        />
        
        {/* Cara Vestibular (Filas 2-4, columnas 2-3) - Centro con número */}
        <div 
          className={cn(
            "col-span-2 col-start-2 row-start-2 row-span-3 cursor-pointer",
            "hover:brightness-90 transition-all duration-200",
            "flex items-center justify-center relative",
            "border-r border-gray-200",
            getFaceColor('vestibular')
          )}
          onClick={(e) => handleFaceClick('vestibular', e)}
          title="Cara Vestibular"
        >
          <span className={cn(
            "text-xs font-bold select-none drop-shadow-sm",
            "text-gray-800 z-10"
          )}>
            {displayNumber}
          </span>
        </div>
        
        {/* Cara Distal (Filas 2-4, columna 4) */}
        <div 
          className={cn(
            "col-start-4 row-start-2 row-span-3 cursor-pointer",
            "hover:brightness-90 transition-all duration-200",
            "relative",
            getFaceColor('distal')
          )}
          onClick={(e) => handleFaceClick('distal', e)}
          title="Cara Distal"
        />
        
        {/* Cara Lingual (Fila 5, columnas 2-3) */}
        <div 
          className={cn(
            "col-span-2 col-start-2 row-start-5 cursor-pointer",
            "hover:brightness-90 transition-all duration-200",
            "border-t border-gray-200 relative",
            getFaceColor('lingual')
          )}
          onClick={(e) => handleFaceClick('lingual', e)}
          title="Cara Lingual"
        />
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse shadow-sm" />
      )}
    </div>
  );
};

export default ToothComponent;
