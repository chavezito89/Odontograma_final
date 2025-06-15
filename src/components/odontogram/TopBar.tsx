
import React from 'react';
import { Stethoscope, Calendar, Activity } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const TopBar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Trigger del Sidebar y Logo */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Odontograma Digital</h1>
                <p className="text-sm text-gray-600">Sistema de diagnóstico dental profesional</p>
              </div>
            </div>
          </div>

          {/* Información del sistema y fecha */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('es-ES')}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="w-4 h-4" />
              <span>Sistema Activo</span>
            </div>
            <div className="hidden lg:block text-sm text-gray-600">
              <span>DOTTOO SOLUTIONS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
