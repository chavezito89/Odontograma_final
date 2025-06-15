import React, { useEffect } from 'react';
import { useOdontoStore } from '@/store/odontoStore';
import OdontogramGrid from '@/components/odontogram/OdontogramGrid';
import StateSelector from '@/components/odontogram/StateSelector';
import ControlPanel from '@/components/odontogram/ControlPanel';
import { Stethoscope, Calendar, Activity } from 'lucide-react';
const Index = () => {
  const {
    selectedPatientId,
    setSelectedPatientId
  } = useOdontoStore();

  // Inicializar con paciente demo si no hay uno seleccionado
  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatientId('patient-demo');
    }
  }, [selectedPatientId, setSelectedPatientId]);
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Odontograma Digital</h1>
                <p className="text-sm text-gray-600">Sistema de diagnóstico dental profesional</p>
              </div>
            </div>
            
            {/* Stats rápidas */}
            <div className="hidden md:flex ml-auto space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Activity className="w-4 h-4" />
                <span>Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Panel de Control - Sidebar izquierdo */}
          <div className="xl:col-span-1 space-y-6">
            <ControlPanel />
          </div>

          {/* Odontograma Principal */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* Título de sección */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Odontograma Interactivo
                </h2>
                <p className="text-gray-600">
                  Selecciona un estado dental y haz clic en los dientes o caras específicas para aplicar el tratamiento
                </p>
              </div>

              {/* Odontograma */}
              <OdontogramGrid />

              {/* StateSelector movido aquí */}
              <StateSelector />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Odontograma Digital - DOTTOO SOLUTIONS</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;