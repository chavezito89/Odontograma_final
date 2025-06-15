
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos de estados dentales
export type ToothState = 
  | 'healthy' 
  | 'caries' 
  | 'restoration' 
  | 'crown' 
  | 'endodontics' 
  | 'extraction' 
  | 'implant' 
  | 'fissure'
  | 'missing';

// Caras del diente
export type ToothFace = 'mesial' | 'distal' | 'vestibular' | 'lingual' | 'oclusal';

// Estado de un diente individual
export interface ToothData {
  number: number;
  quadrant: number;
  state: ToothState;
  faces: Record<ToothFace, ToothState>;
  notes?: string;
  lastModified: Date;
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
  resetOdontogram: () => void;
  
  // Utilidades
  getCurrentOdontogram: () => Record<number, ToothData>;
  initializePatient: (patientId: string) => void;
}

// Estado inicial de un diente
const createInitialTooth = (number: number): ToothData => ({
  number,
  quadrant: Math.ceil(number / 10),
  state: 'healthy',
  faces: {
    mesial: 'healthy',
    distal: 'healthy',
    vestibular: 'healthy',
    lingual: 'healthy',
    oclusal: 'healthy'
  },
  lastModified: new Date()
});

// Store principal
export const useOdontoStore = create<OdontoState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      currentTab: 'diagnosis',
      dentitionType: 'permanent',
      numberingSystem: 'fdi',
      selectedPatientId: null,
      patientData: {},
      selectedTooth: null,
      selectedState: 'healthy',
      
      // Acciones de configuración
      setCurrentTab: (tab) => set({ currentTab: tab }),
      setDentitionType: (type) => set({ dentitionType: type }),
      setNumberingSystem: (system) => set({ numberingSystem: system }),
      setSelectedPatientId: (id) => {
        set({ selectedPatientId: id });
        get().initializePatient(id);
      },
      setSelectedTooth: (tooth) => set({ selectedTooth: tooth }),
      setSelectedState: (state) => set({ selectedState: state }),
      
      // Operaciones con dientes
      updateToothState: (toothNumber, state) => {
        const { selectedPatientId, currentTab } = get();
        if (!selectedPatientId) return;
        
        set((prev) => ({
          patientData: {
            ...prev.patientData,
            [selectedPatientId]: {
              ...prev.patientData[selectedPatientId],
              [currentTab]: {
                ...prev.patientData[selectedPatientId]?.[currentTab],
                [toothNumber]: {
                  ...prev.patientData[selectedPatientId]?.[currentTab]?.[toothNumber] || createInitialTooth(toothNumber),
                  state,
                  lastModified: new Date()
                }
              }
            }
          }
        }));
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
      
      // Utilidades
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
