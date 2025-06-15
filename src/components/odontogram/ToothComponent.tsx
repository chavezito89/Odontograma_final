
import React, { useState } from 'react';
import { useOdontoStore, ToothState, ToothFace } from '@/store/odontoStore';
import { TOOTH_STATE_COLORS, getDisplayNumber, isFullToothState, isSymbolState, getStateSymbol } from '@/utils/toothUtils';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import ToothNotesDialog from './ToothNotesDialog';

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
    bridgeSelection,
    setSelectedTooth,
    updateToothState,
    updateToothFace 
  } = useOdontoStore();

  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  
  const odontogram = getCurrentOdontogram();
  const toothData = odontogram[toothNumber];
  const isSelected = selectedTooth === toothNumber;
  const displayNumber = getDisplayNumber(toothNumber, numberingSystem);
  const isFullToothStateSelected = isFullToothState(selectedState);
  const hasSymbols = toothData?.symbolStates && toothData.symbolStates.length > 0;
  const isBridgeMode = selectedState === 'puente' && bridgeSelection.isActive;
  const isFirstPilarSelected = bridgeSelection.firstPilar === toothNumber;
  const isBridgeIntermediate = toothData?.bridgeInfo?.isIntermediate;
  const isBridgePilar = toothData?.bridgeInfo?.isPilar;
  
  // Tamaño dinámico basado en el estado del sidebar
  const toothSize = isCollapsed ? 'w-16 h-16' : 'w-14 h-14';
  const centerSize = isCollapsed ? 'w-6 h-6' : 'w-5 h-5';
  
  // Determinar si el diente es superior o inferior
  const isUpperTooth = (): boolean => {
    const quadrant = Math.floor(toothNumber / 10);
    return quadrant === 1 || quadrant === 2 || quadrant === 5 || quadrant === 6;
  };
  
  // Determinar si el diente pertenece a un cuadrante derecho
  const isRightQuadrant = (): boolean => {
    const quadrant = Math.floor(toothNumber / 10);
    return quadrant === 1 || quadrant === 4 || quadrant === 5 || quadrant === 8;
  };
  
  // Obtener la cara lingual/palatina correcta según el cuadrante
  const getLingopalatineFace = (): ToothFace => {
    return isUpperTooth() ? 'palatina' : 'lingual';
  };
  
  // Obtener clipPath para cara mesial según el cuadrante
  const getMesialClipPath = (): string => {
    return isRightQuadrant() 
      ? "polygon(100% 0%, 100% 100%, 50% 50%)" // derecha
      : "polygon(0% 0%, 50% 50%, 0% 100%)";    // izquierda
  };
  
  // Obtener clipPath para cara distal según el cuadrante
  const getDistalClipPath = (): string => {
    return isRightQuadrant()
      ? "polygon(0% 0%, 50% 50%, 0% 100%)"     // izquierda
      : "polygon(100% 0%, 100% 100%, 50% 50%)"; // derecha
  };
  
  // Verificar si hay un diente adyacente que también es parte del puente
  const hasAdjacentBridgeTooth = (direction: 'left' | 'right'): boolean => {
    if (!toothData?.bridgeInfo?.bridgeId) return false;
    
    const adjacentNumber = direction === 'right' ? toothNumber + 1 : toothNumber - 1;
    const adjacentTooth = odontogram[adjacentNumber];
    
    return adjacentTooth?.bridgeInfo?.bridgeId === toothData.bridgeInfo.bridgeId;
  };
  
  // Manejar click en el diente completo - ACTUALIZADO para manejar puentes
  const handleToothClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Manejo especial para el modo puente
    if (isBridgeMode) {
      updateToothState(toothNumber, 'puente');
      return;
    }
    
    if (selectedState === 'otro') {
      updateToothState(toothNumber, selectedState);
      setIsNotesDialogOpen(true);
      return;
    }
    
    if (isFullToothStateSelected || selectedState === 'healthy') {
      updateToothState(toothNumber, selectedState);
    } else {
      if (isSelected) {
        if (toothData?.state === selectedState) {
          updateToothState(toothNumber, 'healthy');
        } else {
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
    
    if (isFullToothStateSelected) {
      return;
    }
    
    const currentFaceState = toothData?.faces[face] || 'healthy';
    
    if (currentFaceState === selectedState) {
      updateToothFace(toothNumber, face, 'healthy');
    } else {
      updateToothFace(toothNumber, face, selectedState);
    }
  };
  
  // Obtener color de la cara
  const getFaceColor = (face: ToothFace): string => {
    if (toothData?.state && isFullToothState(toothData.state)) {
      return TOOTH_STATE_COLORS[toothData.state].bg;
    }
    
    const faceState = toothData?.faces[face] || 'healthy';
    return TOOTH_STATE_COLORS[faceState].bg;
  };

  // Verificar si las caras deben ser interactivas - ACTUALIZADO
  const areFacesInteractive = !isFullToothStateSelected && 
    !(toothData?.state && isFullToothState(toothData.state)) && 
    !hasSymbols &&
    !isBridgeIntermediate &&
    !isBridgeMode;

  // Obtener el color CSS de la cara oclusal
  const getOclusalBackgroundColor = (): string => {
    const faceColor = getFaceColor('oclusal');
    if (faceColor === 'bg-white') return '#ffffff';
    
    const colorMap: Record<string, string> = {
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#a855f7',
      'bg-purple-600': '#9333ea',
      'bg-gray-500': '#6b7280',
      'bg-green-500': '#22c55e',
      'bg-orange-500': '#f97316',
      'bg-orange-400': '#fb923c',
      'bg-yellow-400': '#facc15',
      'bg-yellow-600': '#ca8a04',
      'bg-blue-600': '#2563eb',
      'bg-amber-600': '#d97706',
      'bg-purple-400': '#c084fc'
    };
    
    return colorMap[faceColor] || '#ffffff';
  };

  return (
    <>
      <div className={cn("relative group flex flex-col items-center", className)}>
        {/* Líneas continuas del puente - POSICIÓN AJUSTADA */}
        {(isBridgeIntermediate || isBridgePilar) && (
          <>
            {/* Línea hacia la izquierda */}
            {hasAdjacentBridgeTooth('left') && (
              <div 
                className="absolute -left-3 w-6 h-1 bg-purple-600 z-30 rounded-full shadow-sm"
                style={{ 
                  top: 'calc(50% - 6px)',
                  transform: 'translateY(-50%)' 
                }}
              />
            )}
            
            {/* Línea hacia la derecha */}
            {hasAdjacentBridgeTooth('right') && (
              <div 
                className="absolute -right-3 w-6 h-1 bg-purple-600 z-30 rounded-full shadow-sm"
                style={{ 
                  top: 'calc(50% - 6px)',
                  transform: 'translateY(-50%)' 
                }}
              />
            )}
            
            {/* Línea central para dientes intermedios */}
            {isBridgeIntermediate && (
              <div 
                className="absolute left-1/2 w-full h-1 bg-purple-600 z-20 rounded-full shadow-sm"
                style={{ 
                  top: 'calc(50% - 6px)',
                  transform: 'translate(-50%, -50%)' 
                }}
              />
            )}
          </>
        )}
        
        {/* Diente con forma cuadrada dividida en 5 secciones */}
        <div
          className={cn(
            "relative cursor-pointer transition-all duration-200",
            toothSize,
            "hover:scale-105",
            // Resaltado especial para modo puente
            isBridgeMode && isFirstPilarSelected && "ring-2 ring-purple-500 ring-opacity-75",
            isBridgeMode && !isFirstPilarSelected && "opacity-80"
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
            {/* Cara Mesial - posición dinámica según cuadrante */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-200",
                areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
                getFaceColor('mesial')
              )}
              style={{
                clipPath: getMesialClipPath()
              }}
              onClick={areFacesInteractive ? (e) => handleFaceClick('mesial', e) : undefined}
              title={areFacesInteractive ? "Cara Mesial" : undefined}
            />
            
            {/* Cara Distal - posición dinámica según cuadrante */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-200",
                areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
                getFaceColor('distal')
              )}
              style={{
                clipPath: getDistalClipPath()
              }}
              onClick={areFacesInteractive ? (e) => handleFaceClick('distal', e) : undefined}
              title={areFacesInteractive ? "Cara Distal" : undefined}
            />
            
            {/* Cara Vestibular - posición según si es superior o inferior */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-200",
                areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
                getFaceColor('vestibular')
              )}
              style={{
                clipPath: isUpperTooth() ? "polygon(0% 0%, 100% 0%, 50% 50%)" : "polygon(0% 100%, 50% 50%, 100% 100%)"
              }}
              onClick={areFacesInteractive ? (e) => handleFaceClick('vestibular', e) : undefined}
              title={areFacesInteractive ? "Cara Vestibular" : undefined}
            />
            
            {/* Cara Lingual/Palatina - posición según si es superior o inferior */}
            <div
              className={cn(
                "absolute inset-0 transition-colors duration-200",
                areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default",
                getFaceColor(getLingopalatineFace())
              )}
              style={{
                clipPath: isUpperTooth() ? "polygon(0% 100%, 50% 50%, 100% 100%)" : "polygon(0% 0%, 100% 0%, 50% 50%)"
              }}
              onClick={areFacesInteractive ? (e) => handleFaceClick(getLingopalatineFace(), e) : undefined}
              title={areFacesInteractive ? `Cara ${isUpperTooth() ? 'Palatina' : 'Lingual'}` : undefined}
            />
            
            {/* Cara Oclusal (centro) - tamaño dinámico */}
            <div
              className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                centerSize,
                "transition-colors duration-200",
                "border border-gray-700 rounded-sm z-10",
                areFacesInteractive ? "cursor-pointer hover:brightness-90" : "cursor-default"
              )}
              onClick={areFacesInteractive ? (e) => handleFaceClick('oclusal', e) : undefined}
              title={areFacesInteractive ? "Cara Oclusal" : undefined}
              style={{
                backgroundColor: getOclusalBackgroundColor()
              }}
            />
          </div>
          
          {/* Símbolos superpuestos - ACTUALIZADO para no mostrar línea en intermedios */}
          {hasSymbols && toothData?.symbolStates && !isBridgeIntermediate && (
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20"
              style={{ lineHeight: '1' }}
            >
              {toothData.symbolStates.map((symbolState, index) => {
                const symbol = getStateSymbol(symbolState);
                const config = TOOTH_STATE_COLORS[symbolState];
                
                const colorMap: Record<string, string> = {
                  'bg-red-500': '#ef4444',
                  'bg-yellow-500': '#eab308',
                  'bg-blue-500': '#3b82f6',
                  'bg-green-500': '#22c55e',
                  'bg-orange-500': '#f97316',
                  'bg-purple-500': '#a855f7',
                  'bg-purple-600': '#9333ea'
                };
                
                const symbolColor = colorMap[config.bg] || '#3b82f6';
                
                const getSymbolPosition = (index: number, total: number) => {
                  if (total === 1) return { transform: 'translate(-50%, -50%)' };
                  if (total === 2) {
                    return index === 0 
                      ? { transform: 'translate(-100%, -50%)' }
                      : { transform: 'translate(0%, -50%)' };
                  }
                  if (total === 3) {
                    if (index === 0) return { transform: 'translate(-50%, -100%)' };
                    if (index === 1) return { transform: 'translate(-100%, 0%)' };
                    return { transform: 'translate(0%, 0%)' };
                  }
                  const row = Math.floor(index / 2);
                  const col = index % 2;
                  return {
                    transform: `translate(${col === 0 ? '-100%' : '0%'}, ${row === 0 ? '-100%' : '0%'})`
                  };
                };
                
                return (
                  <span
                    key={`${symbolState}-${index}`}
                    className={cn(
                      "absolute font-bold",
                      isCollapsed ? 'text-xl' : 'text-lg'
                    )}
                    style={{
                      ...getSymbolPosition(index, toothData.symbolStates.length),
                      color: symbolColor,
                      textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
                    }}
                    title={config.label}
                  >
                    {symbol}
                  </span>
                );
              })}
            </div>
          )}
          
          {/* Indicador visual para estados completos, símbolos o puentes */}
          {(((toothData?.state && isFullToothState(toothData.state)) || hasSymbols || isBridgeIntermediate) && (
            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white shadow-sm" 
                 title={isBridgeIntermediate ? "Diente intermedio del puente" : hasSymbols ? "Estado con símbolos" : "Estado completo del diente"} />
          ))}
        </div>
        
        {/* Diálogo de notas para estado "otro" */}
        <ToothNotesDialog
          isOpen={isNotesDialogOpen}
          onClose={() => setIsNotesDialogOpen(false)}
          toothNumber={toothNumber}
        />
        
        {/* Número del diente debajo de la casilla */}
        <div className="mt-1 text-xs font-bold text-gray-700">
          {displayNumber}
        </div>
      </div>
    </>
  );
};

export default ToothComponent;
