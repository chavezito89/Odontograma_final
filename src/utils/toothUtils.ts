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

// Conversión FDI a Universal - Corregida según imagen
export const FDI_TO_UNIVERSAL: Record<number, string | number> = {
  // Superior Derecho: 1, 2, 3, 4, 5, 6, 7, 8 (del 11 al 18) - de derecha a izquierda en FDI, de izquierda a derecha en Universal
  18: 1, 17: 2, 16: 3, 15: 4, 14: 5, 13: 6, 12: 7, 11: 8,
  // Superior Izquierdo: 9, 10, 11, 12, 13, 14, 15, 16 (del 21 al 28)
  21: 9, 22: 10, 23: 11, 24: 12, 25: 13, 26: 14, 27: 15, 28: 16,
  // Inferior Izquierdo: 17, 18, 19, 20, 21, 22, 23, 24 (del 31 al 38)
  31: 17, 32: 18, 33: 19, 34: 20, 35: 21, 36: 22, 37: 23, 38: 24,
  // Inferior Derecho: 25, 26, 27, 28, 29, 30, 31, 32 (del 48 al 41) - de derecha a izquierda en FDI, de izquierda a derecha en Universal
  48: 25, 47: 26, 46: 27, 45: 28, 44: 29, 43: 30, 42: 31, 41: 32,
  // Deciduos superiores - cuadrante 5 (superior derecho) - E, D, C, B, A (de izquierda a derecha)
  51: 'E', 52: 'D', 53: 'C', 54: 'B', 55: 'A',
  // Deciduos superiores - cuadrante 6 (superior izquierdo) - F, G, H, I, J
  61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
  // Deciduos inferiores - cuadrante 8 (inferior derecho) - P, Q, R, S, T (de izquierda a derecha)
  81: 'P', 82: 'Q', 83: 'R', 84: 'S', 85: 'T',
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
