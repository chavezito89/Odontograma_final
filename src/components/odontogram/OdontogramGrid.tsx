
import React from 'react';
import QuadrantView from './QuadrantView';
import { cn } from '@/lib/utils';

interface OdontogramGridProps {
  className?: string;
}

const OdontogramGrid: React.FC<OdontogramGridProps> = ({ className }) => {
  return (
    <div className={cn("w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg", className)}>
      {/* Arcada Superior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <QuadrantView quadrant="upperRight" />
        <QuadrantView quadrant="upperLeft" />
      </div>
      
      {/* Línea divisoria */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-12" />
      
      {/* Arcada Inferior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <QuadrantView quadrant="lowerRight" />
        <QuadrantView quadrant="lowerLeft" />
      </div>
    </div>
  );
};

export default OdontogramGrid;
