
import React from 'react';
import { useOdontoStore, TabType, DentitionType, NumberingSystem } from '@/store/odontoStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, User, Settings, Activity, Calendar, Download } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

const ControlSidebar: React.FC = () => {
  const {
    currentTab,
    dentitionType,
    numberingSystem,
    selectedPatientId,
    patientData,
    setCurrentTab,
    setDentitionType,
    setNumberingSystem,
    setSelectedPatientId,
    resetOdontogram
  } = useOdontoStore();

  const handlePatientChange = (value: string) => {
    if (value === 'new') {
      const newPatientId = `patient-${Date.now()}`;
      setSelectedPatientId(newPatientId);
    } else {
      setSelectedPatientId(value);
    }
  };

  const handleExportData = () => {
    if (!selectedPatientId) return;

    const patientInfo = patientData[selectedPatientId];
    if (!patientInfo) return;

    const exportData = {
      patientId: selectedPatientId,
      exportDate: new Date().toISOString(),
      dentitionType,
      numberingSystem,
      diagnosis: patientInfo.diagnosis || {},
      treatment: patientInfo.treatment || {}
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `odontograma-${selectedPatientId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800">Panel de Control</h2>
          <p className="text-sm text-gray-600">Configuración del odontograma</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Selección de Paciente */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <User className="w-4 h-4 mr-2" />
            Paciente
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3">
              <Select value={selectedPatientId || ''} onValueChange={handlePatientChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar paciente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">+ Nuevo Paciente</SelectItem>
                  <SelectItem value="patient-demo">Paciente Demo</SelectItem>
                  {selectedPatientId && selectedPatientId !== 'patient-demo' && <SelectItem value={selectedPatientId}>
                      Paciente Actual ({selectedPatientId.split('-')[1]})
                    </SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Modo de Trabajo */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Activity className="w-4 h-4 mr-2" />
            Modo de Trabajo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3">
              <Tabs value={currentTab} onValueChange={value => setCurrentTab(value as TabType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
                  <TabsTrigger value="treatment">Tratamiento</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Configuración Dental */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="px-3 py-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tipo de Dentición
                  </label>
                  <Select value={dentitionType} onValueChange={value => setDentitionType(value as DentitionType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanente</SelectItem>
                      <SelectItem value="deciduous">Decidua</SelectItem>
                      <SelectItem value="mixed">Mixta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <div className="px-3 py-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sistema de Numeración
                  </label>
                  <Select value={numberingSystem} onValueChange={value => setNumberingSystem(value as NumberingSystem)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fdi">FDI</SelectItem>
                      <SelectItem value="universal">Universal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Acciones */}
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-3 py-2 space-y-2">
              <Button onClick={resetOdontogram} variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50" disabled={!selectedPatientId}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar Odontograma
              </Button>
              
              <Button onClick={handleExportData} variant="outline" size="sm" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50" disabled={!selectedPatientId}>
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 space-y-2">
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Sistema Activo</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>;
};

export default ControlSidebar;
