
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
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'restoration':
        return <div className="w-2 h-2 bg-blue-500" />;
      case 'crown':
        return <div className="w-3 h-1 bg-yellow-500 rounded-t-full" />;
      case 'endodontics':
        return <div className="w-0.5 h-3 bg-purple-500" />;
      case 'extraction':
        return <div className="text-red-500 font-bold text-sm">✗</div>;
      case 'implant':
        return <div className="w-1 h-3 bg-green-500 rounded-sm" />;
      case 'missing':
        return <div className="text-gray-400 font-bold text-sm">○</div>;
      default:
        return null;
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Estructura del diente con forma anatómica */}
      <div
        className={cn(
          "relative w-12 h-16 cursor-pointer transition-all duration-300",
          "hover:scale-105",
          isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        )}
        onClick={handleToothClick}
      >
        {/* Corona del diente - forma anatómica */}
        <div className="relative w-full h-10">
          
          {/* Cara Mesial (superior) */}
          <div 
            className={cn(
              "absolute w-full h-2 top-0 left-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90",
              "clip-path-polygon-[0%_100%,_25%_0%,_75%_0%,_100%_100%]",
              getFaceColor('mesial')
            )}
            style={{
              clipPath: "polygon(0% 100%, 25% 0%, 75% 0%, 100% 100%)"
            }}
            onClick={(e) => handleFaceClick('mesial', e)}
            title="Cara Mesial"
          />
          
          {/* Cara Vestibular (izquierda) */}
          <div 
            className={cn(
              "absolute w-2 h-6 top-2 left-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90",
              getFaceColor('vestibular')
            )}
            style={{
              clipPath: "polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)"
            }}
            onClick={(e) => handleFaceClick('vestibular', e)}
            title="Cara Vestibular"
          />
          
          {/* Cara Oclusal (centro) - forma de rombo/cuadrado */}
          <div 
            className={cn(
              "absolute w-8 h-6 top-2 left-2 cursor-pointer transition-colors duration-200",
              "hover:brightness-90 flex flex-col items-center justify-center",
              "border border-gray-400",
              getFaceColor('oclusal')
            )}
            style={{
              clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)"
            }}
            onClick={(e) => handleFaceClick('oclusal', e)}
            title="Cara Oclusal"
          >
            {/* Número del diente */}
            <span className="text-xs font-bold text-gray-800 mb-0.5">
              {displayNumber}
            </span>
            
            {/* Símbolo del estado */}
            <div className="flex items-center justify-center">
              {renderToothSymbol()}
            </div>
          </div>
          
          {/* Cara Lingual (derecha) */}
          <div 
            className={cn(
              "absolute w-2 h-6 top-2 right-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90",
              getFaceColor('lingual')
            )}
            style={{
              clipPath: "polygon(0% 20%, 100% 0%, 100% 100%, 0% 80%)"
            }}
            onClick={(e) => handleFaceClick('lingual', e)}
            title="Cara Lingual"
          />
          
          {/* Cara Distal (inferior de la corona) */}
          <div 
            className={cn(
              "absolute w-full h-2 bottom-0 left-0 cursor-pointer transition-colors duration-200",
              "hover:brightness-90",
              getFaceColor('distal')
            )}
            style={{
              clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)"
            }}
            onClick={(e) => handleFaceClick('distal', e)}
            title="Cara Distal"
          />
        </div>
        
        {/* Raíces del diente */}
        <div className="w-full h-6 flex justify-center">
          <div 
            className="w-1.5 h-full bg-gray-200 border border-gray-400"
            style={{
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"
            }}
          />
          <div 
            className="w-1.5 h-full bg-gray-200 border border-gray-400 ml-1"
            style={{
              clipPath: "polygon(0% 0%, 80% 0%, 100% 100%, 20% 100%)"
            }}
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
