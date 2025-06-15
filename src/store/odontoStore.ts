
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos de estados dentales - ACTUALIZADO con "fractura" y estados especiales
export type ToothState = 
  | 'healthy' 
  | 'ausente'
  | 'extraccion'
  | 'movilidad'
  | 'macrodontia'
  | 'microdontia'
  | 'corona'
  | 'puente'
  | 'endodoncia'
  | 'tornillo'
  | 'temporal'
  | 'carilla'
  | 'fractura'
  | 'furcacion'
  | 'caries'
  | 'fisura'
  | 'desgaste'
  | 'amalgama'
  | 'resina'
  | 'otro';

// Caras del diente - ACTUALIZADO para soportar palatina y lingual
export type ToothFace = 'mesial' | 'distal' | 'vestibular' | 'lingual' | 'palatina' | 'oclusal';

// Información de puente
export interface BridgeInfo {
  bridgeId: string;
  isPilar: boolean;
  isIntermediate: boolean;
}

// Estado de un diente individual - ACTUALIZADO para soportar múltiples símbolos y puentes
export interface ToothData {
  number: number;
  quadrant: number;
  state: ToothState;
  secondaryState?: ToothState;
  symbolStates: ToothState[];
  faces: Record<ToothFace, ToothState>;
  bridgeInfo?: BridgeInfo;
  notes?: string;
  lastModified: Date;
}

// Selección de puente en progreso
export interface BridgeSelection {
  firstPilar?: number;
  isActive: boolean;
}

// Tipos de pestañas
export type TabType = 'diagnosis' | 'treatment';

// Tipos de dentición
export type DentitionType = 'permanent' | 'deciduous' | 'mixed';

// Tipos de numeración
export type NumberingSystem = 'fdi' | 'universal';

// Estado del store
interface OdontoState {
  // Configuración actual
  currentTab: TabType;
  dentitionType: DentitionType;
  numberingSystem: NumberingSystem;
  selectedPatientId: string | null;
  
  // Datos de odontograma por paciente y pestaña
  patientData: Record<string, {
    diagnosis: Record<number, ToothData>;
    treatment: Record<number, ToothData>;
  }>;
  
  // Estado UI
  selectedTooth: number | null;
  selectedState: ToothState;
  bridgeSelection: BridgeSelection;
  
  // Acciones
  setCurrentTab: (tab: TabType) => void;
  setDentitionType: (type: DentitionType) => void;
  setNumberingSystem: (system: NumberingSystem) => void;
  setSelectedPatientId: (id: string) => void;
  setSelectedTooth: (tooth: number | null) => void;
  setSelectedState: (state: ToothState) => void;
  
  // Operaciones con dientes
  updateToothState: (toothNumber: number, state: ToothState) => void;
  updateToothFace: (toothNumber: number, face: ToothFace, state: ToothState) => void;
  updateToothNotes: (toothNumber: number, notes: string) => void;
  resetOdontogram: () => void;
  
  // Operaciones con puentes
  setBridgeSelection: (selection: BridgeSelection) => void;
  completeBridge: (firstPilar: number, secondPilar: number) => void;
  cancelBridgeSelection: () => void;
  
  // Utilidades
  getCurrentOdontogram: () => Record<number, ToothData>;
  initializePatient: (patientId: string) => void;
}

// Estado inicial de un diente - ACTUALIZADO para incluir symbolStates
const createInitialTooth = (number: number): ToothData => ({
  number,
  quadrant: Math.ceil(number / 10),
  state: 'healthy',
  secondaryState: undefined,
  symbolStates: [],
  faces: {
    mesial: 'healthy',
    distal: 'healthy',
    vestibular: 'healthy',
    lingual: 'healthy',
    palatina: 'healthy',
    oclusal: 'healthy'
  },
  lastModified: new Date()
});

// Función para calcular dientes intermedios entre dos pilares
const getIntermediateTeeth = (pilar1: number, pilar2: number): number[] => {
  // Verificar que están en la misma arcada
  const quadrant1 = Math.floor(pilar1 / 10);
  const quadrant2 = Math.floor(pilar2 / 10);
  
  // Deben estar en cuadrantes adyacentes de la misma arcada
  const sameUpperArcade = (quadrant1 === 1 && quadrant2 === 2) || (quadrant1 === 2 && quadrant2 === 1);
  const sameLowerArcade = (quadrant1 === 3 && quadrant2 === 4) || (quadrant1 === 4 && quadrant2 === 3);
  const sameQuadrant = quadrant1 === quadrant2;
  
  if (!sameUpperArcade && !sameLowerArcade && !sameQuadrant) {
    return [];
  }
  
  const min = Math.min(pilar1, pilar2);
  const max = Math.max(pilar1, pilar2);
  const intermediates: number[] = [];
  
  if (sameQuadrant) {
    // Mismo cuadrante
    for (let i = min + 1; i < max; i++) {
      intermediates.push(i);
    }
  } else {
    // Cuadrantes adyacentes
    if (sameUpperArcade) {
      // Arcada superior: del menor al 18, luego del 21 al mayor
      if (quadrant1 === 1 && quadrant2 === 2) {
        for (let i = min + 1; i <= 18; i++) intermediates.push(i);
        for (let i = 21; i < max; i++) intermediates.push(i);
      } else {
        for (let i = min + 1; i <= 28; i++) intermediates.push(i);
        for (let i = 11; i < max; i++) intermediates.push(i);
      }
    } else {
      // Arcada inferior: del menor al 38, luego del 41 al mayor
      if (quadrant1 === 3 && quadrant2 === 4) {
        for (let i = min + 1; i <= 38; i++) intermediates.push(i);
        for (let i = 41; i < max; i++) intermediates.push(i);
      } else {
        for (let i = min + 1; i <= 48; i++) intermediates.push(i);
        for (let i = 31; i < max; i++) intermediates.push(i);
      }
    }
  }
  
  return intermediates;
};

// Store principal
export const useOdontoStore = create<OdontoState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentTab: 'diagnosis',
      dentitionType: 'permanent',
      numberingSystem: 'universal',
      selectedPatientId: null,
      patientData: {},
      selectedTooth: null,
      selectedState: 'healthy',
      bridgeSelection: { isActive: false },
      
      // Acciones de configuración
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setDentitionType: (type) => set({ dentitionType: type }),
      setNumberingSystem: (system) => set({ numberingSystem: system }),
      setSelectedPatientId: (id) => {
        set({ selectedPatientId: id });
        get().initializePatient(id);
      },
      setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
      setSelectedState: (state) => {
        // Si cambiamos de estado puente, cancelar selección activa
        if (state !== 'puente') {
          set({ selectedState: state, bridgeSelection: { isActive: false } });
        } else {
          set({ selectedState: state, bridgeSelection: { isActive: true } });
        }
      },
      
      // Operaciones con puentes
      setBridgeSelection: (selection) => set({ bridgeSelection: selection }),
      
      completeBridge: (firstPilar, secondPilar) => {
        const { selectedPatientId, currentTab } = get();
        if (!selectedPatientId) return;
        
        const bridgeId = `bridge-${Date.now()}`;
        const intermediateTeeth = getIntermediateTeeth(firstPilar, secondPilar);
        
        set((prev) => {
          const newPatientData = { ...prev.patientData };
          const currentData = newPatientData[selectedPatientId]?.[currentTab] || {};
          
          // Configurar primer pilar
          const firstPilarTooth = currentData[firstPilar] || createInitialTooth(firstPilar);
          currentData[firstPilar] = {
            ...firstPilarTooth,
            symbolStates: [...(firstPilarTooth.symbolStates || []), 'puente'],
            bridgeInfo: { bridgeId, isPilar: true, isIntermediate: false },
            lastModified: new Date()
          };
          
          // Configurar segundo pilar
          const secondPilarTooth = currentData[secondPilar] || createInitialTooth(secondPilar);
          currentData[secondPilar] = {
            ...secondPilarTooth,
            symbolStates: [...(secondPilarTooth.symbolStates || []), 'puente'],
            bridgeInfo: { bridgeId, isPilar: true, isIntermediate: false },
            lastModified: new Date()
          };
          
          // Configurar dientes intermedios
          intermediateTeeth.forEach(toothNumber => {
            const intermediateTooth = currentData[toothNumber] || createInitialTooth(toothNumber);
            currentData[toothNumber] = {
              ...intermediateTooth,
              bridgeInfo: { bridgeId, isPilar: false, isIntermediate: true },
              lastModified: new Date()
            };
          });
          
          newPatientData[selectedPatientId] = {
            ...newPatientData[selectedPatientId],
            [currentTab]: currentData
          };
          
          return {
            patientData: newPatientData,
            bridgeSelection: { isActive: false },
            selectedState: 'healthy'
          };
        });
      },
      
      cancelBridgeSelection: () => set({ 
        bridgeSelection: { isActive: false },
        selectedState: 'healthy'
      }),
      
      // Operaciones con dientes
      updateToothState: (toothNumber, state) => {
        const { selectedPatientId, currentTab, bridgeSelection } = get();
        if (!selectedPatientId) return;
        
        // Manejo especial para el estado puente
        if (state === 'puente' && bridgeSelection.isActive) {
          if (!bridgeSelection.firstPilar) {
            // Seleccionar primer pilar
            set({ bridgeSelection: { isActive: true, firstPilar: toothNumber } });
            return;
          } else if (bridgeSelection.firstPilar !== toothNumber) {
            // Completar puente con segundo pilar
            get().completeBridge(bridgeSelection.firstPilar, toothNumber);
            return;
          }
        }
        
        set((prev) => {
          const currentTooth = prev.patientData[selectedPatientId]?.[currentTab]?.[toothNumber] || createInitialTooth(toothNumber);
          const currentOdontogram = prev.patientData[selectedPatientId]?.[currentTab] || {};
          
          // Si seleccionamos "healthy", verificar si el diente es parte de un puente
          if (state === 'healthy') {
            // Si el diente tiene bridgeInfo, eliminar todo el puente
            if (currentTooth.bridgeInfo?.bridgeId) {
              const bridgeId = currentTooth.bridgeInfo.bridgeId;
              const newOdontogram = { ...currentOdontogram };
              
              // Encontrar todos los dientes que pertenecen a este puente y limpiarlos
              Object.entries(newOdontogram).forEach(([toothNumberStr, toothData]) => {
                if (toothData.bridgeInfo?.bridgeId === bridgeId) {
                  const toothNum = parseInt(toothNumberStr);
                  newOdontogram[toothNum] = {
                    ...toothData,
                    symbolStates: toothData.symbolStates.filter(s => s !== 'puente'),
                    bridgeInfo: undefined,
                    lastModified: new Date()
                  };
                  
                  // Si no hay otros estados símbolo, limpiar completamente
                  if (newOdontogram[toothNum].symbolStates.length === 0 && 
                      newOdontogram[toothNum].state === 'healthy') {
                    newOdontogram[toothNum] = {
                      ...newOdontogram[toothNum],
                      state: 'healthy',
                      secondaryState: undefined,
                      notes: undefined,
                      faces: {
                        mesial: 'healthy',
                        distal: 'healthy',
                        vestibular: 'healthy',
                        lingual: 'healthy',
                        palatina: 'healthy',
                        oclusal: 'healthy'
                      }
                    };
                  }
                }
              });
              
              return {
                patientData: {
                  ...prev.patientData,
                  [selectedPatientId]: {
                    ...prev.patientData[selectedPatientId],
                    [currentTab]: newOdontogram
                  }
                }
              };
            }
            
            // Si no es parte de un puente, limpiar normalmente
            return {
              patientData: {
                ...prev.patientData,
                [selectedPatientId]: {
                  ...prev.patientData[selectedPatientId],
                  [currentTab]: {
                    ...prev.patientData[selectedPatientId]?.[currentTab],
                    [toothNumber]: {
                      ...currentTooth,
                      state: 'healthy',
                      secondaryState: undefined,
                      symbolStates: [],
                      bridgeInfo: undefined,
                      notes: undefined,
                      faces: {
                        mesial: 'healthy',
                        distal: 'healthy',
                        vestibular: 'healthy',
                        lingual: 'healthy',
                        palatina: 'healthy',
                        oclusal: 'healthy'
                      },
                      lastModified: new Date()
                    }
                  }
                }
              }
            };
          }
          
          // Verificar si es un estado con símbolo (excluyendo puente que tiene manejo especial)
          const isSymbol = ['ausente', 'extraccion', 'movilidad', 'macrodontia', 'microdontia', 'corona', 'endodoncia', 'tornillo', 'temporal', 'carilla', 'fractura', 'furcacion', 'otro'].includes(state);
          
          if (isSymbol) {
            const currentSymbolStates = currentTooth.symbolStates || [];
            
            if (currentSymbolStates.includes(state)) {
              const newSymbolStates = currentSymbolStates.filter(s => s !== state);
              
              return {
                patientData: {
                  ...prev.patientData,
                  [selectedPatientId]: {
                    ...prev.patientData[selectedPatientId],
                    [currentTab]: {
                      ...prev.patientData[selectedPatientId]?.[currentTab],
                      [toothNumber]: {
                        ...currentTooth,
                        symbolStates: newSymbolStates,
                        notes: state === 'otro' && newSymbolStates.length === 0 ? undefined : currentTooth.notes,
                        lastModified: new Date()
                      }
                    }
                  }
                }
              };
            }
            
            const newSymbolStates = [...currentSymbolStates, state];
            
            return {
              patientData: {
                ...prev.patientData,
                [selectedPatientId]: {
                  ...prev.patientData[selectedPatientId],
                  [currentTab]: {
                    ...prev.patientData[selectedPatientId]?.[currentTab],
                    [toothNumber]: {
                      ...currentTooth,
                      symbolStates: newSymbolStates,
                      lastModified: new Date()
                    }
                  }
                }
              }
            };
          }
          
          // Para estados no-símbolos, usar la lógica anterior
          if (currentTooth.state === state) {
            return {
              patientData: {
                ...prev.patientData,
                [selectedPatientId]: {
                  ...prev.patientData[selectedPatientId],
                  [currentTab]: {
                    ...prev.patientData[selectedPatientId]?.[currentTab],
                    [toothNumber]: {
                      ...currentTooth,
                      state: 'healthy',
                      secondaryState: undefined,
                      faces: {
                        mesial: 'healthy',
                        distal: 'healthy',
                        vestibular: 'healthy',
                        lingual: 'healthy',
                        palatina: 'healthy',
                        oclusal: 'healthy'
                      },
                      lastModified: new Date()
                    }
                  }
                }
              }
            };
          }
          
          if (currentTooth.state === 'healthy') {
            return {
              patientData: {
                ...prev.patientData,
                [selectedPatientId]: {
                  ...prev.patientData[selectedPatientId],
                  [currentTab]: {
                    ...prev.patientData[selectedPatientId]?.[currentTab],
                    [toothNumber]: {
                      ...currentTooth,
                      state,
                      lastModified: new Date()
                    }
                  }
                }
              }
            };
          }
          
          return {
            patientData: {
              ...prev.patientData,
              [selectedPatientId]: {
                ...prev.patientData[selectedPatientId],
                [currentTab]: {
                  ...prev.patientData[selectedPatientId]?.[currentTab],
                  [toothNumber]: {
                    ...currentTooth,
                    secondaryState: state,
                    faces: {
                      mesial: 'healthy',
                      distal: 'healthy',
                      vestibular: 'healthy',
                      lingual: 'healthy',
                      palatina: 'healthy',
                      oclusal: 'healthy'
                    },
                    lastModified: new Date()
                  }
                }
              }
            }
          };
        });
      },
      
      updateToothFace: (toothNumber, face, state) => {
        const { selectedPatientId, currentTab } = get();
        if (!selectedPatientId) return;
        
        set((prev) => {
          const currentTooth = prev.patientData[selectedPatientId]?.[currentTab]?.[toothNumber] || createInitialTooth(toothNumber);
          
          return {
            patientData: {
              ...prev.patientData,
              [selectedPatientId]: {
                ...prev.patientData[selectedPatientId],
                [currentTab]: {
                  ...prev.patientData[selectedPatientId]?.[currentTab],
                  [toothNumber]: {
                    ...currentTooth,
                    faces: {
                      ...currentTooth.faces,
                      [face]: state
                    },
                    lastModified: new Date()
                  }
                }
              }
            }
          };
        });
      },
      
      updateToothNotes: (toothNumber, notes) => {
        const { selectedPatientId, currentTab } = get();
        if (!selectedPatientId) return;
        
        set((prev) => {
          const currentTooth = prev.patientData[selectedPatientId]?.[currentTab]?.[toothNumber] || createInitialTooth(toothNumber);
          
          return {
            patientData: {
              ...prev.patientData,
              [selectedPatientId]: {
                ...prev.patientData[selectedPatientId],
                [currentTab]: {
                  ...prev.patientData[selectedPatientId]?.[currentTab],
                  [toothNumber]: {
                    ...currentTooth,
                    notes,
                    lastModified: new Date()
                  }
                }
              }
            }
          };
        });
      },
      
      resetOdontogram: () => {
        const { selectedPatientId, currentTab } = get();
        if (!selectedPatientId) return;
        
        set((prev) => ({
          patientData: {
            ...prev.patientData,
            [selectedPatientId]: {
              ...prev.patientData[selectedPatientId],
              [currentTab]: {}
            }
          }
        }));
      },
      
      getCurrentOdontogram: () => {
        const { selectedPatientId, currentTab, patientData } = get();
        if (!selectedPatientId) return {};
        return patientData[selectedPatientId]?.[currentTab] || {};
      },
      
      initializePatient: (patientId) => {
        set((prev) => ({
          patientData: {
            ...prev.patientData,
            [patientId]: prev.patientData[patientId] || {
              diagnosis: {},
              treatment: {}
            }
          }
        }));
      }
    }),
    {
      name: 'odonto-storage',
      partialize: (state) => ({
        patientData: state.patientData,
        dentitionType: state.dentitionType,
        numberingSystem: state.numberingSystem
      })
    }
  )
);
