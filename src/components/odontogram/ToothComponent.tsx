
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
  
  // Obtener color del diente completo
  const getToothColor = (): string => {
    const toothState = toothData?.state || 'healthy';
    return TOOTH_STATE_COLORS[toothState].bg;
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Contenedor principal del diente */}
      <div
        className={cn(
          "relative w-14 h-14 cursor-pointer transition-all duration-200",
          "border-2 border-gray-400 bg-white hover:shadow-md",
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Layout en cuadrícula 3x3 */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
          {/* Fila superior */}
          <div className="border-r border-b border-gray-400"></div>
          <div 
            className={cn(
              "border-r border-b border-gray-400 cursor-pointer hover:opacity-80 transition-opacity",
              getFaceColor('oclusal')
            )}
            onClick={(e) => handleFaceClick('oclusal', e)}
            title="Cara Oclusal"
          ></div>
          <div className="border-b border-gray-400"></div>
          
          {/* Fila media */}
          <div 
            className={cn(
              "border-r border-b border-gray-400 cursor-pointer hover:opacity-80 transition-opacity",
              getFaceColor('mesial')
            )}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          ></div>
          <div 
            className={cn(
              "border-r border-b border-gray-400 cursor-pointer hover:opacity-80 transition-opacity relative",
              getFaceColor('vestibular')
            )}
            onClick={(e) => handleFaceClick('vestibular', e)}
            title="Cara Vestibular"
          >
            {/* Número del diente centrado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-800">{displayNumber}</span>
            </div>
          </div>
          <div 
            className={cn(
              "border-b border-gray-400 cursor-pointer hover:opacity-80 transition-opacity",
              getFaceColor('distal')
            )}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          ></div>
          
          {/* Fila inferior */}
          <div className="border-r border-gray-400"></div>
          <div 
            className={cn(
              "border-r border-gray-400 cursor-pointer hover:opacity-80 transition-opacity",
              getFaceColor('lingual')
            )}
            onClick={(e) => handleFaceClick('lingual', e)}
            title="Cara Lingual"
          ></div>
          <div className=""></div>
        </div>
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

export default ToothComponent;
