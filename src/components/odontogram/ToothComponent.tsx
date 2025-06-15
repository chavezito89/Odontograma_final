
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
          "relative w-16 h-20 cursor-pointer transition-all duration-200",
          "bg-gray-50 hover:shadow-md border border-gray-300 rounded-sm",
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Cara Oclusal (Superior) */}
        <div 
          className={cn(
            "absolute top-0 left-2 right-2 h-4 cursor-pointer hover:opacity-80 transition-all",
            "border border-gray-400 rounded-t-sm",
            getFaceColor('oclusal')
          )}
          onClick={(e) => handleFaceClick('oclusal', e)}
          title="Cara Oclusal"
        />
        
        {/* Fila media con Mesial, Vestibular y Distal */}
        <div className="absolute top-4 left-0 right-0 h-8 flex">
          {/* Cara Mesial (Izquierda) - 30% del ancho */}
          <div 
            className={cn(
              "w-[30%] h-full cursor-pointer hover:opacity-80 transition-all",
              "border-l border-t border-b border-gray-400",
              getFaceColor('mesial')
            )}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Cara Vestibular (Centro) - 40% del ancho */}
          <div 
            className={cn(
              "w-[40%] h-full cursor-pointer hover:opacity-80 transition-all",
              "border border-gray-400 flex items-center justify-center",
              getFaceColor('vestibular')
            )}
            onClick={(e) => handleFaceClick('vestibular', e)}
            title="Cara Vestibular"
          >
            <span className="text-xs font-bold text-gray-800 select-none">{displayNumber}</span>
          </div>
          
          {/* Cara Distal (Derecha) - 30% del ancho */}
          <div 
            className={cn(
              "w-[30%] h-full cursor-pointer hover:opacity-80 transition-all",
              "border-r border-t border-b border-gray-400",
              getFaceColor('distal')
            )}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          />
        </div>
        
        {/* Cara Lingual (Inferior) */}
        <div 
          className={cn(
            "absolute bottom-0 left-2 right-2 h-4 cursor-pointer hover:opacity-80 transition-all",
            "border border-gray-400 rounded-b-sm",
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
