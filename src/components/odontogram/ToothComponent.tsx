import React from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, getDisplayNumber, isFullToothState, isSymbolState, getStateSymbol } from '@/utils/toothUtils';
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
  const isFullToothStateSelected = isFullToothState(selectedState);
  const hasSymbol = toothData?.symbolState !== undefined;
  
  // Obtener el color del símbolo basado en el estado
  const getSymbolColor = (): string => {
    if (!hasSymbol || !toothData?.symbolState) return '';
    
    const symbolConfig = TOOTH_STATE_COLORS[toothData.symbolState];
    // Convertir clase de Tailwind a color CSS
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e'
    };
    
    return colorMap[symbolConfig.bg] || '#000000';
  };
  
  // Obtener el tamaño del símbolo según el tipo
  const getSymbolSize = (): string => {
    if (!hasSymbol || !toothData?.symbolState) return 'text-3xl';
    
    // El símbolo de movilidad necesita ser más grande
    if (toothData.symbolState === 'movilidad') {
      return 'text-4xl';
    }
    
    return 'text-3xl';
  };
  
  // Manejar click en el diente completo
  const handleToothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFullToothStateSelected || selectedState === 'healthy') {
      // Para estados que abarcan todo el diente o estado sano, aplicar directamente
      updateToothState(toothNumber, selectedState);
    } else {
      // Para estados por caras, solo seleccionar el diente
      if (isSelected) {
        // Si el diente ya tiene el estado seleccionado, lo eliminamos (volver a healthy)
        if (toothData?.state === selectedState) {
          updateToothState(toothNumber, 'healthy');
        } else {
          // Si no tiene el estado seleccionado, lo aplicamos
          updateToothState(toothNumber, selectedState);
        }
      } else {
        setSelectedTooth(toothNumber);
      }
    }
  };
  
  // Manejar click en una cara específica
  const handleFaceClick = (face: ToothFace, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // No permitir selección de caras para estados que abarcan todo el diente
    if (isFullToothStateSelected) {
      return;
    }
    
    const currentFaceState = toothData?.faces[face] || 'healthy';
    
    // Si la cara ya tiene el estado seleccionado, la volvemos a healthy
    if (currentFaceState === selectedState) {
      updateToothFace(toothNumber, face, 'healthy');
    } else {
      // Si no tiene el estado seleccionado, lo aplicamos
      updateToothFace(toothNumber, face, selectedState);
    }
  };
  
  // Obtener color de la cara
  const getFaceColor = (face: ToothFace): string => {
    // Si el diente tiene un estado completo, mostrar ese color en todas las caras
    if (toothData?.state && isFullToothState(toothData.state)) {
      return TOOTH_STATE_COLORS[toothData.state].bg;
    }
    
    // Si no, mostrar el color específico de cada cara
    const faceState = toothData?.faces[face] || 'healthy';
    return TOOTH_STATE_COLORS[faceState].bg;
  };

  // Verificar si las caras deben ser interactivas
  const areFacesInteractive = !isFullToothStateSelected && 
    !(toothData?.state && isFullToothState(toothData.state)) && 
    !hasSymbol;

  return (
    <div className={cn("relative group", className)}>
      {/* Diente con forma cuadrada dividida en 5 secciones */}
      <div
        className={cn(
          "relative w-12 h-12 cursor-pointer transition-all duration-200",
          "hover:scale-102"
        )}
        onClick={handleToothClick}
      >
        {/* Contenedor principal con bordes diagonales */}
        <div 
          className={cn(
            "relative w-full h-full border-2 border-gray-800 bg-white"
          )}
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
              "absolute inset-0 transition-colors duration-200",
              areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
              getFaceColor('mesial')
            )}
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)"
            }}
            onClick={areFacesInteractive ? (e) => handleFaceClick('mesial', e) : undefined}
            title={areFacesInteractive ? "Cara Mesial" : undefined}
          />
          
          {/* Cara Distal (inferior) */}
          <div
            className={cn(
              "absolute inset-0 transition-colors duration-200",
              areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
              getFaceColor('distal')
            )}
            style={{
              clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)"
            }}
            onClick={areFacesInteractive ? (e) => handleFaceClick('distal', e) : undefined}
            title={areFacesInteractive ? "Cara Distal" : undefined}
          />
          
          {/* Cara Vestibular (izquierda) */}
          <div
            className={cn(
              "absolute inset-0 transition-colors duration-200",
              areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
              getFaceColor('vestibular')
            )}
            style={{
              clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)"
            }}
            onClick={areFacesInteractive ? (e) => handleFaceClick('vestibular', e) : undefined}
            title={areFacesInteractive ? "Cara Vestibular" : undefined}
          />
          
          {/* Cara Lingual (derecha) */}
          <div
            className={cn(
              "absolute inset-0 transition-colors duration-200",
              areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
              getFaceColor('lingual')
            )}
            style={{
              clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)"
            }}
            onClick={areFacesInteractive ? (e) => handleFaceClick('lingual', e) : undefined}
            title={areFacesInteractive ? "Cara Lingual" : undefined}
          />
          
          {/* Cara Oclusal (centro) - SIEMPRE VISIBLE */}
          <div
            className={cn(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "w-6 h-6 transition-colors duration-200",
              "flex items-center justify-center text-xs font-bold text-gray-800",
              "border-2 border-gray-700 rounded-sm bg-white z-10",
              areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default"
            )}
            onClick={areFacesInteractive ? (e) => handleFaceClick('oclusal', e) : undefined}
            title={areFacesInteractive ? "Cara Oclusal" : undefined}
            style={{
              backgroundColor: !hasSymbol ? getFaceColor('oclusal').replace('bg-', '') === 'white' ? '#ffffff' : getFaceColor('oclusal') : '#ffffff'
            }}
          >
            {displayNumber}
          </div>
        </div>
        
        {/* Símbolo superpuesto CENTRADO CON CONTORNO NEGRO */}
        {hasSymbol && toothData?.symbolState && (
          <div 
            className={cn(
              "absolute inset-0",
              "flex items-center justify-center",
              getSymbolSize(),
              "font-bold pointer-events-none z-20"
            )}
            title={TOOTH_STATE_COLORS[toothData.symbolState].label}
            style={{
              color: getSymbolColor(),
              textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
            }}
          >
            {getStateSymbol(toothData.symbolState)}
          </div>
        )}
      </div>
      
      {/* Indicador visual para estados completos o símbolos */}
      {((toothData?.state && isFullToothState(toothData.state)) || hasSymbol) && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white shadow-sm" 
             title={hasSymbol ? "Estado con símbolo" : "Estado completo del diente"} />
      )}
    </div>
  );
};

export default ToothComponent;
