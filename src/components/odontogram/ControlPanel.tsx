
import React from 'react';
import { useOdontoStore, TabType, DentitionType, NumberingSystem } from '@/store/odontoStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ControlPanel: React.FC = () => {
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
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
      </div>

      {/* Selección de Paciente */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
          <User className="w-4 h-4" />
          <span>Paciente</span>
        </label>
        <Select value={selectedPatientId || ''} onValueChange={handlePatientChange}>
          <SelectTrigger className="w-full">
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

      {/* Pestañas */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Modo</label>
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TabType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diagnosis" className="text-sm">
              Diagnóstico
            </TabsTrigger>
            <TabsTrigger value="treatment" className="text-sm">
              Tratamiento
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tipo de Dentición */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Dentición</label>
        <Select 
          value={dentitionType} 
          onValueChange={(value) => setDentitionType(value as DentitionType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="permanent">Permanente</SelectItem>
            <SelectItem value="deciduous">Decidua</SelectItem>
            <SelectItem value="mixed">Mixta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sistema de Numeración */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Numeración</label>
        <Select 
          value={numberingSystem} 
          onValueChange={(value) => setNumberingSystem(value as NumberingSystem)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fdi">Sistema FDI</SelectItem>
            <SelectItem value="universal">Sistema Universal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Acciones */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          onClick={resetOdontogram}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          disabled={!selectedPatientId}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar Odontograma
        </Button>
      </div>

      {/* Estado actual */}
      {selectedPatientId && (
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <div>Paciente: {selectedPatientId}</div>
          <div>Modo: {currentTab === 'diagnosis' ? 'Diagnóstico' : 'Tratamiento'}</div>
          <div>Dentición: {dentitionType === 'permanent' ? 'Permanente' : dentitionType === 'deciduous' ? 'Decidua' : 'Mixta'}</div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
