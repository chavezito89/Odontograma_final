
import React from 'react';
import { useOdontoStore, TabType, DentitionType, NumberingSystem } from '@/store/odontoStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, User, Stethoscope, Calendar, Activity } from 'lucide-react';

const TopBar: React.FC = () => {
  const {
    currentTab,
    dentitionType,
    numberingSystem,
    selectedPatientId,
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

  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Odontograma Digital</h1>
                <p className="text-sm text-gray-600">Sistema de diagnóstico dental profesional</p>
              </div>
            </div>
          </div>

          {/* Controles principales */}
          <div className="flex items-center space-x-6">
            {/* Selección de Paciente */}
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <Select value={selectedPatientId || ''} onValueChange={handlePatientChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar paciente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">+ Nuevo Paciente</SelectItem>
                  <SelectItem value="patient-demo">Paciente Demo</SelectItem>
                  {selectedPatientId && selectedPatientId !== 'patient-demo' && (
                    <SelectItem value={selectedPatientId}>
                      Paciente Actual ({selectedPatientId.split('-')[1]})
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Pestañas de Modo */}
            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabType)}>
              <TabsList>
                <TabsTrigger value="diagnosis">Diagnóstico</TabsTrigger>
                <TabsTrigger value="treatment">Tratamiento</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Tipo de Dentición */}
            <Select 
              value={dentitionType} 
              onValueChange={(value) => setDentitionType(value as DentitionType)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permanent">Permanente</SelectItem>
                <SelectItem value="deciduous">Decidua</SelectItem>
                <SelectItem value="mixed">Mixta</SelectItem>
              </SelectContent>
            </Select>

            {/* Sistema de Numeración */}
            <Select 
              value={numberingSystem} 
              onValueChange={(value) => setNumberingSystem(value as NumberingSystem)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fdi">FDI</SelectItem>
                <SelectItem value="universal">Universal</SelectItem>
              </SelectContent>
            </Select>

            {/* Botón de Reiniciar */}
            <Button
              onClick={resetOdontogram}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={!selectedPatientId}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Stats rápidas */}
          <div className="hidden xl:flex space-x-6">
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
  );
};

export default TopBar;
