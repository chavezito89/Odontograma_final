
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

  // Renderizar símbolo según el estado principal del diente
  const renderToothSymbol = () => {
    const mainState = toothData?.state || 'healthy';
    
    switch (mainState) {
      case 'caries':
        return <div className="w-3 h-3 bg-red-500 rounded-full mx-auto" />;
      case 'restoration':
        return <div className="w-3 h-3 bg-blue-500 mx-auto" />;
      case 'crown':
        return <div className="w-4 h-2 bg-yellow-500 rounded-t-full mx-auto" />;
      case 'endodontics':
        return <div className="w-1 h-4 bg-purple-500 mx-auto" />;
      case 'extraction':
        return <div className="text-red-500 font-bold text-lg mx-auto">✗</div>;
      case 'implant':
        return <div className="w-2 h-4 bg-green-500 mx-auto rounded-sm" />;
      case 'missing':
        return <div className="text-gray-400 font-bold text-lg mx-auto">○</div>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Estructura del diente estilo tradicional */}
      <div
        className={cn(
          "relative w-16 h-20 cursor-pointer transition-all duration-300",
          "hover:scale-105",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Corona del diente */}
        <div className="relative w-full h-12 bg-white border-2 border-gray-400 rounded-t-lg">
          
          {/* Cara Mesial (superior) */}
          <div 
            className={cn(
              "absolute w-full h-3 top-0 left-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90 rounded-t-lg",
              getFaceColor('mesial')
            )}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Caras laterales y oclusal */}
          <div className="absolute top-3 left-0 w-full h-6 flex">
            {/* Cara Vestibular (izquierda) */}
            <div 
              className={cn(
                "w-3 h-full cursor-pointer transition-colors duration-200",
                "hover:brightness-90",
                getFaceColor('vestibular')
              )}
              onClick={(e) => handleFaceClick('vestibular', e)}
              title="Cara Vestibular"
            />
            
            {/* Cara Oclusal (centro) */}
            <div 
              className={cn(
                "flex-1 h-full cursor-pointer transition-colors duration-200",
                "hover:brightness-90 flex flex-col items-center justify-center",
                getFaceColor('oclusal')
              )}
              onClick={(e) => handleFaceClick('oclusal', e)}
              title="Cara Oclusal"
            >
              {/* Número del diente */}
              <span className="text-xs font-bold text-gray-800 mb-1">
                {displayNumber}
              </span>
              
              {/* Símbolo del estado */}
              {renderToothSymbol()}
            </div>
            
            {/* Cara Lingual (derecha) */}
            <div 
              className={cn(
                "w-3 h-full cursor-pointer transition-colors duration-200",
                "hover:brightness-90",
                getFaceColor('lingual')
              )}
              onClick={(e) => handleFaceClick('lingual', e)}
              title="Cara Lingual"
            />
          </div>
          
          {/* Cara Distal (inferior de la corona) */}
          <div 
            className={cn(
              "absolute w-full h-3 bottom-0 left-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90",
              getFaceColor('distal')
            )}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          />
        </div>
        
        {/* Raíces del diente */}
        <div className="w-full h-8 flex justify-center">
          <div className="w-2 h-full bg-gray-200 border border-gray-400"></div>
          <div className="w-2 h-full bg-gray-200 border border-gray-400 ml-2"></div>
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
