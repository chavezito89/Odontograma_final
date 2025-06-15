
import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { getStateClasses, TOOTH_STATE_COLORS } from '@/utils/toothUtils';
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
    setSelectedTooth,
    updateToothState,
    updateToothFace 
  } = useOdontoStore();
  
  const odontogram = getCurrentOdontogram();
  const toothData = odontogram[toothNumber];
  const isSelected = selectedTooth === toothNumber;
  
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
          "relative w-12 h-16 cursor-pointer transition-all duration-200",
          "border-2 rounded-lg shadow-sm hover:shadow-md",
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "",
          "bg-white"
        )}
        onClick={handleToothClick}
      >
        {/* Cara Oclusal/Incisal (superior) */}
        <div
          className={cn(
            "absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-3 rounded-t-lg border cursor-pointer z-10",
            getFaceColor('oclusal'),
            "hover:opacity-80 transition-opacity"
          )}
          onClick={(e) => handleFaceClick('oclusal', e)}
          title="Cara Oclusal"
        />
        
        {/* Cara Vestibular (frontal) */}
        <div
          className={cn(
            "absolute top-3 left-0 w-full h-8 border-x cursor-pointer",
            getFaceColor('vestibular'),
            "hover:opacity-80 transition-opacity"
          )}
          onClick={(e) => handleFaceClick('vestibular', e)}
          title="Cara Vestibular"
        />
        
        {/* Cara Lingual (posterior) - se ve a través de transparencia */}
        <div
          className={cn(
            "absolute top-3 left-1 right-1 h-8 border cursor-pointer opacity-30",
            getFaceColor('lingual'),
            "hover:opacity-50 transition-opacity rounded-sm"
          )}
          onClick={(e) => handleFaceClick('lingual', e)}
          title="Cara Lingual"
        />
        
        {/* Cara Mesial (izquierda) */}
        <div
          className={cn(
            "absolute top-3 left-0 w-3 h-8 border-l border-y cursor-pointer",
            getFaceColor('mesial'),
            "hover:opacity-80 transition-opacity rounded-l"
          )}
          onClick={(e) => handleFaceClick('mesial', e)}
          title="Cara Mesial"
        />
        
        {/* Cara Distal (derecha) */}
        <div
          className={cn(
            "absolute top-3 right-0 w-3 h-8 border-r border-y cursor-pointer",
            getFaceColor('distal'),
            "hover:opacity-80 transition-opacity rounded-r"
          )}
          onClick={(e) => handleFaceClick('distal', e)}
          title="Cara Distal"
        />
        
        {/* Raíz del diente */}
        <div
          className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-5 rounded-b-full border",
            getToothColor(),
            "opacity-60"
          )}
        />
      </div>
      
      {/* Número del diente */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
        {toothNumber}
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
};

export default ToothComponent;
