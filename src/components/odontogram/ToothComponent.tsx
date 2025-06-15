
import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, getDisplayNumber } from '@/utils/toothUtils';
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
      {/* Diente con forma cuadrada dividida en 5 secciones - tamaño reducido */}
      <div
        className={cn(
          "relative w-12 h-12 cursor-pointer transition-all duration-200",
          "hover:scale-102",
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Contenedor principal con bordes diagonales */}
        <div 
          className="relative w-full h-full border-2 border-gray-800 bg-white"
          style={{
            background: `
              linear-gradient(to bottom left, transparent 0 calc(50% - 1px), #1f2937, transparent calc(50% + 1px)) no-repeat,
              linear-gradient(to bottom right, transparent 0 calc(50% - 1px), #1f2937, transparent calc(50% + 1px)) no-repeat
            `
          }}
        >
          {/* Cara Mesial (superior) */}
          <div
            className={cn(
              "absolute inset-0 cursor-pointer transition-colors duration-200 hover:brightness-90",
              getFaceColor('mesial')
            )}
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)"
            }}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Cara Distal (inferior) */}
          <div
            className={cn(
              "absolute inset-0 cursor-pointer transition-colors duration-200 hover:brightness-90",
              getFaceColor('distal')
            )}
            style={{
              clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)"
            }}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          />
          
          {/* Cara Vestibular (izquierda) */}
          <div
            className={cn(
              "absolute inset-0 cursor-pointer transition-colors duration-200 hover:brightness-90",
              getFaceColor('vestibular')
            )}
            style={{
              clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)"
            }}
            onClick={(e) => handleFaceClick('vestibular', e)}
            title="Cara Vestibular"
          />
          
          {/* Cara Lingual (derecha) */}
          <div
            className={cn(
              "absolute inset-0 cursor-pointer transition-colors duration-200 hover:brightness-90",
              getFaceColor('lingual')
            )}
            style={{
              clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)"
            }}
            onClick={(e) => handleFaceClick('lingual', e)}
            title="Cara Lingual"
          />
          
          {/* Cara Oclusal (centro) - reducida proporcionalmente */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "w-6 h-6 cursor-pointer transition-colors duration-200 hover:brightness-90",
              "flex items-center justify-center text-xs font-bold text-gray-800",
              "border-2 border-gray-700 rounded-sm",
              getFaceColor('oclusal')
            )}
            onClick={(e) => handleFaceClick('oclusal', e)}
            title="Cara Oclusal"
          >
            {displayNumber}
          </div>
        </div>
      </div>
      
      {/* Número del diente debajo - ajustado para el nuevo tamaño */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
        {toothNumber}
      </div>
      
      {/* Indicador de estado seleccionado */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white animate-pulse shadow-sm" />
      )}
    </div>
  );
};

export default ToothComponent;
