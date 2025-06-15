import React, { useEffect } from 'react';
import { useOdontoStore } from '@/store/odontoStore';
import OdontogramGrid from '@/components/odontogram/OdontogramGrid';
import StateSelector from '@/components/odontogram/StateSelector';
import TopBar from '@/components/odontogram/TopBar';
import ControlSidebar from '@/components/odontogram/ControlSidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';

const MainContent = () => {
  const {
    selectedPatientId,
    setSelectedPatientId
  } = useOdontoStore();

  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === 'collapsed';

  // Inicializar con paciente demo si no hay uno seleccionado
  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatientId('patient-demo');
    }
  }, [selectedPatientId, setSelectedPatientId]);

  return (
    <SidebarInset>
      {/* TopBar */}
      <TopBar />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${isCollapsed ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1 lg:grid-cols-4'}`}>
          {/* Odontograma Principal - Más espacio cuando sidebar está colapsado */}
          <div className={isCollapsed ? 'xl:col-span-4' : 'lg:col-span-3'}>
            <div className="space-y-6">
              {/* Título de sección */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Odontograma</h2>
                <p className="text-gray-600">
                  Selecciona un estado dental y haz clic en los dientes o caras específicas para aplicar el tratamiento
                </p>
              </div>

              {/* Odontograma */}
              <OdontogramGrid />
            </div>
          </div>

          {/* Estados Dentales - Sidebar derecho */}
          <div className={isCollapsed ? 'xl:col-span-1' : 'lg:col-span-1'}>
            <StateSelector />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Odontograma Digital - DOTTOO SOLUTIONS</p>
          </div>
        </div>
      </footer>
    </SidebarInset>
  );
};

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-slate-50">
        {/* Sidebar de Control */}
        <ControlSidebar />

        {/* Contenido Principal */}
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

export default Index;
