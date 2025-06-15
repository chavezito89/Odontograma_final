import { ToothState } from '@/store/odontoStore';

// Configuración de colores por estado dental
export const TOOTH_STATE_COLORS: Record<ToothState, { bg: string; border: string; label: string }> = {
  healthy: {
    bg: 'bg-white',
    border: 'border-slate-300',
    label: 'Sano'
  },
  caries: {
    bg: 'bg-red-500',
    border: 'border-red-600',
    label: 'Caries'
  },
  restoration: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    label: 'Restauración'
  },
  crown: {
    bg: 'bg-yellow-500',
    border: 'border-yellow-600',
    label: 'Corona'
  },
  endodontics: {
    bg: 'bg-purple-500',
    border: 'border-purple-600',
    label: 'Endodoncia'
  },
  extraction: {
    bg: 'bg-gray-500',
    border: 'border-gray-600',
    label: 'Extracción'
  },
  implant: {
    bg: 'bg-green-500',
    border: 'border-green-600',
    label: 'Implante'
  },
  fissure: {
    bg: 'bg-orange-500',
    border: 'border-orange-600',
    label: 'Fisura'
  },
  missing: {
    bg: 'bg-gray-300',
    border: 'border-gray-400',
    label: 'Ausente'
  }
};

// Números de dientes por cuadrante (FDI)
export const TOOTH_NUMBERS = {
  permanent: {
    upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
    upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
    lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38],
    lowerRight: [48, 47, 46, 45, 44, 43, 42, 41]
  },
  deciduous: {
    upperRight: [55, 54, 53, 52, 51],
    upperLeft: [61, 62, 63, 64, 65],
    lowerLeft: [71, 72, 73, 74, 75],
    lowerRight: [85, 84, 83, 82, 81]
  },
  mixed: {
    upperRight: {
      permanent: [18, 17, 16, 15, 14, 13, 12, 11],
      deciduous: [55, 54, 53, 52, 51]
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
      permanent: [48, 47, 46, 45, 44, 43, 42, 41],
      deciduous: [85, 84, 83, 82, 81]
    }
  }
} as const;

// Conversión FDI a Universal - Según imagen exacta
export const FDI_TO_UNIVERSAL: Record<number, string | number> = {
  // Superior Derecho: 1, 2, 3, 4, 5, 6, 7, 8 (del 18 al 11) - de izquierda a derecha
  18: 8, 17: 7, 16: 6, 15: 5, 14: 4, 13: 3, 12: 2, 11: 1,
  // Superior Izquierdo: 9, 10, 11, 12, 13, 14, 15, 16 (del 21 al 28)
  21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
  // Inferior Izquierdo: 24, 23, 22, 21, 20, 19, 18, 17 (del 31 al 38)
  31: 24, 32: 23, 33: 22, 34: 21, 35: 20, 36: 19, 37: 18, 38: 17,
  // Inferior Derecho: 32, 31, 30, 29, 28, 27, 26, 25 (del 41 al 48)
  41: 32, 42: 31, 43: 30, 44: 29, 45: 28, 46: 27, 47: 26, 48: 25,
  // Deciduos superiores - cuadrante 5 (superior derecho) - A, B, C, D, E
  55: 'E', 54: 'D', 53: 'C', 52: 'B', 51: 'A',
  // Deciduos superiores - cuadrante 6 (superior izquierdo) - F, G, H, I, J
  61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
  // Deciduos inferiores - cuadrante 8 (inferior derecho) - P, Q, R, S, T (de izquierda a derecha)
  85: 'P', 84: 'Q', 83: 'R', 82: 'S', 81: 'T',
  // Deciduos inferiores - cuadrante 7 (inferior izquierdo) - O, N, M, L, K
  71: 'O', 72: 'N', 73: 'M', 74: 'L', 75: 'K'
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
