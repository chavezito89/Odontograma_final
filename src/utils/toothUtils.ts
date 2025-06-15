import { ToothState } from '@/store/odontoStore';

// Configuración de colores por estado dental - ACTUALIZADA con símbolos
export const TOOTH_STATE_COLORS: Record<ToothState, { bg: string; border: string; label: string; symbol?: string }> = {
  healthy: {
    bg: 'bg-white',
    border: 'border-slate-300',
    label: 'Sano'
  },
  // Estados con símbolos que pueden superponerse
  ausente: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    label: 'Ausente',
    symbol: '❌'
  },
  movilidad: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-600',
    label: 'Movilidad',
    symbol: '↔'
  },
  macrodontia: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    label: 'Macrodontia',
    symbol: '🔺'
  },
  microdontia: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    label: 'Microdontia',
    symbol: '🔻'
  },
  corona: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    label: 'Corona',
    symbol: '◼'
  },
  puente: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    label: 'Puente',
    symbol: '═'
  },
  endodoncia: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    label: 'Endodoncia',
    symbol: '≡'
  },
  tornillo: {
    bg: 'bg-green-500',
    border: 'border-green-600',
    label: 'Implante',
    symbol: '⊙'
  },
  temporal: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-600',
    label: 'Temporal',
    symbol: 'T'
  },
  // Estados que se aplican a UNA CARA del diente (sin símbolos)
  caries: {
    bg: 'bg-orange-500',
    border: 'border-orange-600',
    label: 'Caries'
  },
  fisura: {
    bg: 'bg-blue-600',
    border: 'border-blue-700',
    label: 'Fisura'
  },
  desgaste: {
    bg: 'bg-amber-600',
    border: 'border-amber-700',
    label: 'Desgaste/Erosión'
  },
  furcacion: {
    bg: 'bg-yellow-600',
    border: 'border-yellow-700',
    label: 'Furcación'
  },
  fracturado: {
    bg: 'bg-purple-500',
    border: 'border-purple-600',
    label: 'Fracturado'
  },
  amalgama: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-500',
    label: 'Amalgama'
  },
  resina: {
    bg: 'bg-purple-400',
    border: 'border-purple-500',
    label: 'Resina'
  },
  carilla: {
    bg: 'bg-orange-400',
    border: 'border-orange-500',
    label: 'Carilla'
  }
};

// Estados que abarcan todo el diente (con símbolos)
export const FULL_TOOTH_STATES: ToothState[] = [
  'ausente',
  'movilidad',
  'macrodontia',
  'microdontia',
  'corona',
  'puente',
  'endodoncia',
  'tornillo',
  'temporal'
];

// Estados que permiten selección por caras individuales
export const FACE_SELECTABLE_STATES: ToothState[] = [
  'healthy',
  'caries',
  'fisura',
  'desgaste',
  'furcacion',
  'fracturado',
  'amalgama',
  'resina',
  'carilla'
];

// Estados que usan símbolos
export const SYMBOL_STATES: ToothState[] = [
  'ausente',
  'movilidad',
  'macrodontia',
  'microdontia',
  'corona',
  'puente',
  'endodoncia',
  'tornillo',
  'temporal'
];

// Verificar si un estado abarca todo el diente
export const isFullToothState = (state: ToothState): boolean => {
  return FULL_TOOTH_STATES.includes(state);
};

// Verificar si un estado permite selección por caras
export const isFaceSelectableState = (state: ToothState): boolean => {
  return FACE_SELECTABLE_STATES.includes(state);
};

// Verificar si un estado usa símbolo
export const isSymbolState = (state: ToothState): boolean => {
  return SYMBOL_STATES.includes(state);
};

// Obtener el símbolo de un estado
export const getStateSymbol = (state: ToothState): string | undefined => {
  return TOOTH_STATE_COLORS[state].symbol;
};

// Números de dientes por cuadrante (FDI)
export const TOOTH_NUMBERS = {
  permanent: {
    upperRight: [11, 12, 13, 14, 15, 16, 17, 18],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
    lowerRight: [41, 42, 43, 44, 45, 46, 47, 48]
  },
  deciduous: {
    upperRight: [51, 52, 53, 54, 55],
    upperLeft: [61, 62, 63, 64, 65],
    lowerLeft: [71, 72, 73, 74, 75],
    lowerRight: [81, 82, 83, 84, 85]
  },
  mixed: {
    upperRight: {
      permanent: [11, 12, 13, 14, 15, 16, 17, 18],
      deciduous: [51, 52, 53, 54, 55]
    },
    upperLeft: {
      permanent: [21, 22, 23, 24, 25, 26, 27, 28],
      deciduous: [61, 62, 63, 64, 65]
    },
    lowerLeft: {
      permanent: [31, 32, 33, 34, 35, 36, 37, 38],
      deciduous: [71, 72, 73, 74, 75]
    },
    lowerRight: {
      permanent: [41, 42, 43, 44, 45, 46, 47, 48],
      deciduous: [81, 82, 83, 84, 85]
    }
  }
} as const;

// Conversión FDI a Universal - CORRECCIÓN FINAL
export const FDI_TO_UNIVERSAL: Record<number, string | number> = {
  // Superior Derecho: 1, 2, 3, 4, 5, 6, 7, 8 (del 18 al 11)
  18: 1, 17: 2, 16: 3, 15: 4, 14: 5, 13: 6, 12: 7, 11: 8,
  // Superior Izquierdo: 9, 10, 11, 12, 13, 14, 15, 16 (del 21 al 28)
  21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
  // Inferior Izquierdo (31-38): van del 24 al 17 en Universal
  31: 24, 32: 23, 33: 22, 34: 21, 35: 20, 36: 19, 37: 18, 38: 17,
  // Inferior Derecho (41-48): van del 25 al 32 en Universal (41=25, 42=26, etc.)
  41: 25, 42: 26, 43: 27, 44: 28, 45: 29, 46: 30, 47: 31, 48: 32,
  // Deciduos superiores - cuadrante 5 (superior derecho)
  55: 'A', 54: 'B', 53: 'C', 52: 'D', 51: 'E',
  // Deciduos superiores - cuadrante 6 (superior izquierdo)
  61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
  // Deciduos inferiores - cuadrante 7 (inferior izquierdo)
  71: 'O', 72: 'N', 73: 'M', 74: 'L', 75: 'K',
  // Deciduos inferiores - cuadrante 8 (inferior derecho)
  81: 'P', 82: 'Q', 83: 'R', 84: 'S', 85: 'T'
};

// Obtener el nombre del cuadrante
export const getQuadrantName = (toothNumber: number): string => {
  const quadrant = Math.floor(toothNumber / 10);
  
  switch (quadrant) {
    case 1: return 'Superior Derecho';
    case 2: return 'Superior Izquierdo';
    case 3: return 'Inferior Izquierdo';
    case 4: return 'Inferior Derecho';
    case 5: return 'Deciduo Superior Derecho';
    case 6: return 'Deciduo Superior Izquierdo';
    case 7: return 'Deciduo Inferior Izquierdo';
    case 8: return 'Deciduo Inferior Derecho';
    default: return 'Desconocido';
  }
};

// Verificar si un diente es posterior
export const isPosteriorTooth = (toothNumber: number): boolean => {
  const position = toothNumber % 10;
  return position >= 4; // Premolares y molares
};

// Verificar si un diente tiene estados combinados (ahora obsoleto con símbolos)
export const hasCombinedStates = (primaryState: ToothState, secondaryState?: ToothState): boolean => {
  return secondaryState !== undefined && primaryState !== 'healthy' && secondaryState !== 'healthy';
};

// Obtener clases CSS para estados combinados (mantenido para compatibilidad)
export const getCombinedStateClasses = (primaryState: ToothState, secondaryState?: ToothState): string => {
  if (!hasCombinedStates(primaryState, secondaryState)) {
    const config = TOOTH_STATE_COLORS[primaryState];
    return `${config.bg} ${config.border}`;
  }
  
  return 'border-2 border-gray-800';
};

// Obtener estilo de gradiente para estados combinados (mantenido para compatibilidad)
export const getCombinedStateGradient = (primaryState: ToothState, secondaryState?: ToothState): string => {
  if (!hasCombinedStates(primaryState, secondaryState)) {
    const primaryConfig = TOOTH_STATE_COLORS[primaryState];
    if (!primaryConfig) {
      console.warn(`Color configuration not found for state: ${primaryState}`);
      return 'white';
    }
    return primaryConfig.bg.replace('bg-', '');
  }
  
  const primaryConfig = TOOTH_STATE_COLORS[primaryState];
  const secondaryConfig = secondaryState ? TOOTH_STATE_COLORS[secondaryState] : null;
  
  if (!primaryConfig) {
    console.warn(`Color configuration not found for primary state: ${primaryState}`);
    return 'white';
  }
  
  if (!secondaryConfig) {
    console.warn(`Color configuration not found for secondary state: ${secondaryState}`);
    return primaryConfig.bg.replace('bg-', '');
  }
  
  const primaryColor = primaryConfig.bg.replace('bg-', '');
  const secondaryColor = secondaryConfig.bg.replace('bg-', '');
  
  // Mapear colores de Tailwind a valores CSS
  const colorMap: Record<string, string> = {
    'white': '#ffffff',
    'red-500': '#ef4444',
    'blue-500': '#3b82f6',
    'yellow-500': '#eab308',
    'purple-500': '#a855f7',
    'gray-500': '#6b7280',
    'green-500': '#22c55e',
    'orange-500': '#f97316',
    'gray-300': '#d1d5db',
    'red-300': '#fca5a5',
    'blue-300': '#93c5fd',
    'yellow-300': '#fde047',
    'yellow-400': '#facc15',
    'yellow-600': '#ca8a04',
    'blue-600': '#2563eb',
    'amber-600': '#d97706',
    'purple-400': '#c084fc',
    'orange-400': '#fb923c'
  };
  
  const primaryColorValue = colorMap[primaryColor] || primaryColor;
  const secondaryColorValue = colorMap[secondaryColor] || secondaryColor;
  
  return `linear-gradient(90deg, ${primaryColorValue} 50%, ${secondaryColorValue} 50%)`;
};

// Obtener clase CSS para el estado
export const getStateClasses = (state: ToothState): string => {
  const config = TOOTH_STATE_COLORS[state];
  return `${config.bg} ${config.border}`;
};

// Obtener número de display según el sistema de numeración
export const getDisplayNumber = (toothNumber: number, system: 'fdi' | 'universal'): string | number => {
  if (system === 'universal') {
    return FDI_TO_UNIVERSAL[toothNumber] || toothNumber;
  }
  return toothNumber;
};
